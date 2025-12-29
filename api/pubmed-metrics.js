// /api/pubmed-metrics.js
// Computes Total Citations, h-index, i10-index from PubMed + NIH iCite
// No scraping, API-only, production hardened

/* =========================
   HELPERS
========================= */

const fetchWithTimeout = async (url, ms = 8000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);

    try {
        return await fetch(url, { signal: controller.signal });
    } finally {
        clearTimeout(timer);
    }
};

const computeHIndex = (citations) => {
    const sorted = [...citations].sort((a, b) => b - a);
    let h = 0;
    for (let i = 0; i < sorted.length; i++) {
        if (sorted[i] >= i + 1) h = i + 1;
        else break;
    }
    return h;
};

/* =========================
   HANDLER
========================= */

export default async function handler(req, res) {
    try {
        const term = req.query.term || "El-Hattab AW";
        const apiKey = process.env.NCBI_API_KEY || "";

        /* =========================
           1) GET ALL PMIDs
        ========================= */

        const searchUrl =
            "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?" +
            new URLSearchParams({
                db: "pubmed",
                term,
                retmax: "5000",
                retmode: "json",
                api_key: apiKey,
            });

        const searchRes = await fetchWithTimeout(searchUrl, 6000);
        if (!searchRes.ok) {
            return res.status(200).json({
                term,
                publications: 0,
                totalCitations: 0,
                hIndex: 0,
                i10Index: 0,
                updatedFrom: "PubMed + NIH iCite",
            });
        }

        const searchData = await searchRes.json();
        const ids = searchData?.esearchresult?.idlist || [];

        if (!ids.length) {
            return res.status(200).json({
                term,
                publications: 0,
                totalCitations: 0,
                hIndex: 0,
                i10Index: 0,
                updatedFrom: "PubMed + NIH iCite",
            });
        }

        /* =========================
           2) FETCH ICITE IN BATCHES
        ========================= */

        const batchSize = 200;
        const citations = [];

        for (let i = 0; i < ids.length; i += batchSize) {
            const batch = ids.slice(i, i + batchSize);

            try {
                const iciteUrl =
                    "https://icite.od.nih.gov/api/pubs?" +
                    new URLSearchParams({ pmids: batch.join(",") });

                const iciteRes = await fetchWithTimeout(iciteUrl, 5000);
                if (!iciteRes.ok) continue;

                const iciteJson = await iciteRes.json();
                const data = Array.isArray(iciteJson?.data)
                    ? iciteJson.data
                    : [];

                for (const item of data) {
                    const count = Number(item?.citation_count) || 0;
                    citations.push(count);
                }
            } catch {
                
            }
        }

        /* =========================
           3) COMPUTE METRICS
        ========================= */

        const totalCitations = citations.reduce((sum, n) => sum + n, 0);
        const hIndex = computeHIndex(citations);
        const i10Index = citations.filter((n) => n >= 10).length;

        /* =========================
           4) RESPONSE
        ========================= */

        return res.status(200).json({
            term,
            publications: ids.length,
            totalCitations,
            hIndex,
            i10Index,
            updatedFrom: "PubMed + NIH iCite",
        });
    } catch (error) {
        console.error("PubMed metrics error:", error);

        return res.status(200).json({
            term: req.query.term || "El-Hattab AW",
            publications: 0,
            totalCitations: 0,
            hIndex: 0,
            i10Index: 0,
            updatedFrom: "PubMed + NIH iCite",
        });
    }
}
