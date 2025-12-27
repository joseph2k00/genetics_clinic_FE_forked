// /api/pubmed-metrics.js
// Computes Total Citations, h-index, i10-index from PubMed+NIH iCite (no scraping)
function computeHIndex(citations) {
    const sorted = [...citations].sort((a, b) => b - a);
    let h = 0;
    for (let i = 0; i < sorted.length; i++) {
        const rank = i + 1;
        if (sorted[i] >= rank) h = rank;
        else break;
    }
    return h;
}

export default async function handler(req, res) {
    try {
        const term = req.query.term || "El-Hattab AW";

        // 1) Get ALL PMIDs (retmax can be high; usually authors < 500)
        const searchUrl =
            "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?" +
            new URLSearchParams({
                db: "pubmed",
                term,
                sort: "date",
                retmax: "5000",
                retmode: "json",
            });

        const searchRes = await fetch(searchUrl);
        if (!searchRes.ok) {
            return res.status(500).json({ error: "PubMed search failed" });
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

        // 2) Fetch citation counts from iCite in batches
        const batchSize = 200; // safe size
        const citations = [];

        for (let i = 0; i < ids.length; i += batchSize) {
            const batch = ids.slice(i, i + batchSize);

            const iciteUrl =
                "https://icite.od.nih.gov/api/pubs?" +
                new URLSearchParams({ pmids: batch.join(",") });

            const iciteRes = await fetch(iciteUrl);
            if (!iciteRes.ok) continue; // skip batch on failure

            const iciteJson = await iciteRes.json();
            const data = iciteJson?.data || [];

            for (const item of data) {
                const count = item.citation_count ?? 0;
                citations.push(Number(count) || 0);
            }
        }

        // If iCite fails completely, still respond safely
        const totalCitations = citations.reduce((sum, n) => sum + n, 0);
        const hIndex = computeHIndex(citations);
        const i10Index = citations.filter((n) => n >= 10).length;

        return res.status(200).json({
            term,
            publications: ids.length,
            totalCitations,
            hIndex,
            i10Index,
            updatedFrom: "PubMed + NIH iCite",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to compute metrics" });
    }
}
