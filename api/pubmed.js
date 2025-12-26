export default async function handler(req, res) {
    try {
        const searchUrl =
            "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?" +
            new URLSearchParams({
                db: "pubmed",
                term: "El-Hattab AW",
                sort: "date",
                retmax: "50",
                retmode: "json",
            });

        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        const ids = searchData.esearchresult.idlist;

        if (!ids.length) {
            return res.status(200).json([]);
        }

        const summaryUrl =
            "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?" +
            new URLSearchParams({
                db: "pubmed",
                id: ids.join(","), // ✅ FIXED
                retmode: "json",
            });

        const summaryRes = await fetch(summaryUrl);
        const summaryData = await summaryRes.json();

        const publications = ids.map((id) => ({
            id,
            title: summaryData.result[id].title,
            journal: summaryData.result[id].fulljournalname,
            year: summaryData.result[id].pubdate?.split(" ")[0],
            url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        }));

        res.status(200).json(publications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch publications" });
    }
}
