import { useEffect, useState } from "react";
import { sanityClient } from "../../SanityClient";
import "./Certificates.css";
import Loader from "../../components/Loader/Loader";

const Certificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        sanityClient
            .fetch(`
                *[_type == "certificates" && _id == "certificates"][0]{
                    title,
                    awards[]{
                        _key,
                        title
                    }
                }
            `)
            .then((data) => {
                setCertificates(data?.awards || []);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    if (loading) return <Loader/>;

    return (
        <div className="section">
            <div className="section-title">Certificates & Memberships</div>

            <div className="certificates-single-column">
                {certificates.map((item) => (
                    <div className="certificate-pill" key={item._key}>
                        {item.title}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Certificates;
