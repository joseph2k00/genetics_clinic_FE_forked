import { useEffect, useState } from "react";
import { sanityClient } from "../../SanityClient";
import "./Awards.css";
import Loader from "../../components/Loader/Loader";

const Awards = () => {
    const [awards, setAwards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        sanityClient
            .fetch(`
                *[_type == "awards" && _id == "awards"][0]{
                    title,
                    awards[]{
                        _key,
                        date,
                        title
                    }
                }
            `)
            .then((data) => {
                setAwards(data?.awards || []);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    if (loading) return <Loader/>;
    return (
        <div className="section">
            <div className="section-title">Awards</div>

            <div className="awards-container">
                {awards.map((item) => (
                    <div className="award-card" key={item._key}>
                        <div className="award-date">{item.date}</div>
                        <div className="award-title">{item.title}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Awards;
