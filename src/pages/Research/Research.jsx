import { useEffect, useState } from "react";
import "./Research.css";
import Loader from "../../components/Loader/Loader";

const Research = () => {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchPublications = async () => {
            try {
                const res = await fetch("/api/pubmed");
                const data = await res.json();
                setPapers(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load publications.");
            } finally {
                setLoading(false);
            }
        };

        fetchPublications();
    }, []);

    if (loading) return <Loader />;
    
    return (
        <div className="section">
            <div className="section-title">Research & Publications</div>

            <div className="research-container">
                {error && <p className="error">{error}</p>}

                {!loading && !error && papers.length === 0 && (
                    <p>No publications found.</p>
                )}

                {!loading && papers.map((paper) => (
                    <div className="publication-card" key={paper.id}>
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
                ))}
            </div>
        </div>
    );
}

export default Research;