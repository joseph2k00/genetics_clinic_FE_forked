export default async function handler(req, res) {
    try {
        const page = parseInt(req.query.page || "0");
        const limit = parseInt(req.query.limit || "20");
        const retstart = page * limit;

        const searchUrl =
            "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?" +
            new URLSearchParams({
                db: "pubmed",
                term: "El-Hattab AW",
                sort: "date",
                retmax: limit.toString(),
                retstart: retstart.toString(),
                retmode: "json",
            });

        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        const ids = searchData.esearchresult?.idlist || [];

        if (!ids.length) {
            return res.status(200).json({ data: [], hasMore: false });
        }

        const summaryUrl =
            "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?" +
            new URLSearchParams({
                db: "pubmed",
                id: ids.join(","),
                retmode: "json",
            });

        const summaryRes = await fetch(summaryUrl);
        const summaryData = await summaryRes.json();
        if (!summaryData.result) {
            return res.status(200).json({ data: [], hasMore: false });
        }

        const publications = ids
            .map((id) => {
                const item = summaryData.result[id];
                if (!item) return null;

                return {
                    id,
                    title: item.title,
                    journal: item.fulljournalname,
                    year: item.pubdate?.split(" ")[0],
                    url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
                };
            })
            .filter(Boolean);

        res.status(200).json({
            data: publications,
            hasMore: publications.length === limit,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch publications" });
    }
}
