// /api/pubmed.js
// Returns paginated publications from PubMed + citation counts from NIH iCite
export default async function handler(req, res) {
    try {
        const formatDate = (yyyymmdd) => {
            if (!yyyymmdd || yyyymmdd.length !== 8) return "";
            const y = yyyymmdd.slice(0, 4);
            const m = yyyymmdd.slice(4, 6);
            const d = yyyymmdd.slice(6, 8);

            return new Date(`${y}-${m}-${d}`).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
        };
        const page = Math.max(parseInt(req.query.page || "0", 10), 0);
        const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 50);
        const retstart = page * limit;

        const term = req.query.term || "El-Hattab AW";

        // 1) Search PubMed for PMIDs
        const searchUrl =
            "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?" +
            new URLSearchParams({
                db: "pubmed",
                term,
                sort: "date",
                retmax: limit.toString(),
                retstart: retstart.toString(),
                retmode: "json",
            });

        const searchRes = await fetch(searchUrl);
        if (!searchRes.ok) {
            return res.status(500).json({ error: "PubMed search failed" });
        }
        const searchData = await searchRes.json();

        const ids = searchData?.esearchresult?.idlist || [];
        if (!ids.length) {
            return res.status(200).json({ data: [], hasMore: false });
        }

        // 2) Fetch summaries from PubMed
        const summaryUrl =
            "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?" +
            new URLSearchParams({
                db: "pubmed",
                id: ids.join(","),
                retmode: "json",
            });

        const summaryRes = await fetch(summaryUrl);
        if (!summaryRes.ok) {
            return res.status(500).json({ error: "PubMed summary failed" });
        }
        const summaryData = await summaryRes.json();

        // 3) Fetch citation counts from NIH iCite
        // iCite API: https://icite.od.nih.gov/api
        const iciteUrl =
            "https://icite.od.nih.gov/api/pubs?" +
            new URLSearchParams({ pmids: ids.join(",") });

        const iciteRes = await fetch(iciteUrl);
        // iCite may occasionally fail; don't crash the page
        const iciteJson = iciteRes.ok ? await iciteRes.json() : null;

        const citationsByPmid = {};
        if (iciteJson?.data?.length) {
            for (const item of iciteJson.data) {
                // item.pmid is a string/number; normalize to string
                citationsByPmid[String(item.pmid)] = item.citation_count ?? 0;
            }
        }

        // 4) Build publications (defensive against missing summary entries)
        const publications = ids
            .map((id) => {
                const item = summaryData?.result?.[id];
                if (!item) return null;

                return {
                    id,
                    title: item.title || "Untitled",
                    journal: item.fulljournalname || "",
                    year: item.pubdate ? item.pubdate.split(" ")[0] : "",
                    publicationDate: formatDate(item.lastupdate),
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
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch publications" });
    }
}
