import { useEffect, useRef, useState } from "react";
import "./Research.css";
import Loader from "../../components/Loader/Loader";
import ScrollLoader from "../../components/ScrollLoader/ScrollLoader";

const LIMIT = 20;

const Research = () => {
    const [papers, setPapers] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);

    const observer = useRef();

    const lastPaperRef = (node) => {
        if (loadingMore || !hasMore) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((prev) => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    };

    useEffect(() => {
        const fetchPublications = async () => {
            try {
                page === 0 ? setLoading(true) : setLoadingMore(true);

                const res = await fetch(
                    `/api/pubmed?page=${page}&limit=${LIMIT}`
                );

                const json = await res.json();

                setPapers((prev) => [...prev, ...json.data]);
                setHasMore(json.hasMore);
            } catch (err) {
                console.error(err);
                setError("Failed to load publications.");
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        };

        fetchPublications();
    }, [page]);

    if (loading && page === 0) return <Loader />;

    return (
        <div className="section">
            <div className="section-title">Research & Publications</div>

            <div className="research-container">
                {error && <p className="error">{error}</p>}

                {papers.map((paper, index) => {
                    const isLast = index === papers.length - 1;

                    return (
                        <div
                            ref={isLast ? lastPaperRef : null}
                            className="publication-card"
                            key={paper.id}
                        >
                            <h3 className="publication-title">
                                <a
                                    href={paper.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {paper.title}
                                </a>
                            </h3>

                            <p className="publication-meta">
                                {paper.journal}
                                {paper.year && ` • ${paper.year}`}
                            </p>
                        </div>
                    );
                })}

                {loadingMore && <ScrollLoader />}
                {!hasMore && (
                    <p style={{ textAlign: "center", opacity: 0.6 }}>
                        No more publications
                    </p>
                )}
            </div>
        </div>
    );
};

export default Research;
