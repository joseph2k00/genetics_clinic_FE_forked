import { kv } from "@vercel/kv";

const DAY = 86400; // seconds

export default async function handler(req, res) {
    try {
        const cacheKey = "scholar_metrics";

        // check cache
        const cached = await kv.get(cacheKey);

        if (cached) {
            return res.status(200).json(cached);
        }

        // fetch from SerpAPI
        const response = await fetch(
            `https://serpapi.com/search.json?engine=google_scholar_author&author_id=${process.env.SCHOLAR_AUTHOR_ID}&api_key=${process.env.SERPAPI_KEY}`
        );

        const data = await response.json();

        const metrics = {
            totalCitations: data.cited_by?.table?.[0]?.citations || 0,
            hIndex: data.cited_by?.table?.[0]?.h_index || 0,
            i10Index: data.cited_by?.table?.[0]?.i10_index || 0,
            publications: data.articles?.length || 0,
            updatedAt: Date.now()
        };

        // store in KV with TTL = 1 day
        await kv.set(cacheKey, metrics, { ex: DAY });

        res.status(200).json(metrics);
    } catch (error) {
        console.error("Scholar API error:", error);

        res.status(500).json({
            error: "Failed to fetch scholar metrics",
            message: error.message
        });
    }
}