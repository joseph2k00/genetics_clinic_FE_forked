// /api/pubmed.js
// Paginated PubMed publications + optional NIH iCite citation counts

const fetchWithTimeout = async (url, ms = 8000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);

    try {
        return await fetch(url, { signal: controller.signal });
    } finally {
        clearTimeout(timer);
    }
};

const formatSortPubDate = (sortpubdate) => {
    if (!sortpubdate) return "";

    // Expected: "YYYY/MM/DD HH:mm"
    const [datePart] = sortpubdate.split(" ");
    const [year, month, day] = datePart.split("/");

    if (!year || !month || !day) return "";

    return new Date(`${year}-${month}-${day}`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};


export default async function handler(req, res) {
    try {
        const page = Math.max(parseInt(req.query.page || "0", 10), 0);
        const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 50);
        const retstart = page * limit;
        const term = req.query.term || "El-Hattab AW";

        /* =========================
           1) SEARCH PUBMED
        ========================= */

        const searchUrl =
            "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?" +
            new URLSearchParams({
                db: "pubmed",
                term,
                sort: "date",
                retmax: limit.toString(),
                retstart: retstart.toString(),
                retmode: "json",
                api_key: process.env.NCBI_API_KEY || "",
            });

        const searchRes = await fetchWithTimeout(searchUrl, 6000);
        if (!searchRes.ok) {
            return res.status(200).json({ data: [], hasMore: false });
        }

        const searchData = await searchRes.json();
        const ids = searchData?.esearchresult?.idlist || [];

        if (!ids.length) {
            return res.status(200).json({ data: [], hasMore: false });
        }

        /* =========================
           2) FETCH SUMMARIES
        ========================= */

        const summaryUrl =
            "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?" +
            new URLSearchParams({
                db: "pubmed",
                id: ids.join(","),
                retmode: "json",
                api_key: process.env.NCBI_API_KEY || "",
            });

        const summaryRes = await fetchWithTimeout(summaryUrl, 6000);
        if (!summaryRes.ok) {
            return res.status(200).json({ data: [], hasMore: false });
        }

        const summaryData = await summaryRes.json();
        console.log(summaryData);

        /* =========================
           3) FETCH ICITE (OPTIONAL)
        ========================= */

        let citationsByPmid = {};

        try {
            const iciteUrl =
                "https://icite.od.nih.gov/api/pubs?" +
                new URLSearchParams({ pmids: ids.join(",") });

            const iciteRes = await fetchWithTimeout(iciteUrl, 5000);

            if (iciteRes.ok) {
                const iciteJson = await iciteRes.json();
                if (Array.isArray(iciteJson?.data)) {
                    for (const item of iciteJson.data) {
                        citationsByPmid[String(item.pmid)] =
                            item.citation_count ?? 0;
                    }
                }
            }
        } catch {
            // iCite failures are silently ignored
        }

        /* =========================
           4) BUILD RESPONSE
        ========================= */

        const publications = ids
            .map((id) => {
                const item = summaryData?.result?.[id];
                if (!item) return null;

                return {
                    id,
                    title: item.title || "Untitled",
                    journal: item.fulljournalname || "",
                    year: item.pubdate ? item.pubdate.split(" ")[0] : "",
                    publicationDate: formatSortPubDate(item.sortpubdate),
                    authors: Array.isArray(item.authors)
                        ? item.authors.map((a) => a.name).join(", ")
                        : "",
                    url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
                    citationCount: citationsByPmid[String(id)] ?? null,
                };
            })
            .filter(Boolean);

        return res.status(200).json({
            data: publications,
            hasMore: publications.length === limit,
        });
    } catch (err) {
        console.error("PubMed API error:", err);
        return res.status(200).json({ data: [], hasMore: false });
    }
}
