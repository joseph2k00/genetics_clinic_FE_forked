const fetchWithTimeout = async (url, ms = 8000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

export default async function handler(req, res) {
  try {

    const term = "El-Hattab AW";

    /* =========================
       1) GET PUBLICATION COUNT
       (PubMed)
    ========================= */

    const searchUrl =
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?" +
      new URLSearchParams({
        db: "pubmed",
        term,
        retmax: "0",
        retmode: "json"
      });

    const pubmedRes = await fetchWithTimeout(searchUrl, 6000);
    const pubmedJson = await pubmedRes.json();

    const publications =
      Number(pubmedJson?.esearchresult?.count) || 0;

    /* =========================
       2) GET SCHOLAR METRICS
    ========================= */

    const scholarRes = await fetch(
      `https://serpapi.com/search.json?engine=google_scholar_author&author_id=${process.env.SCHOLAR_AUTHOR_ID}&api_key=${process.env.SERPAPI_KEY}`
    );

    const scholarData = await scholarRes.json();
    
    const metrics = {
    publications,
    totalCitations: scholarData?.cited_by?.table?.[0]?.citations?.all || 0,
    hIndex: scholarData?.cited_by?.table?.[0]?.h_index || 0,
    i10Index: scholarData?.cited_by?.table?.[0]?.i10_index || 0
    };
    /* =========================
       3) CACHE (VERCEL CDN)
    ========================= */

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate"
    );

    res.status(200).json(metrics);

  } catch (error) {
    console.error(error);

    res.status(200).json({
      publications: 0,
      totalCitations: 0,
      hIndex: 0,
      i10Index: 0
    });
  }
}