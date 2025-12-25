import { useEffect, useState } from "react";
import { sanityClient } from "../../../../SanityClient";
import "./GeneticServices.css";

const GeneticServices = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        sanityClient
            .fetch(`
                *[_type == "services" && _id == "services"][0]{
                    services
                }
            `)
            .then((data) => {
                setServices(data?.services || []);
            })
            .catch((error) => {
                console.error("Sanity fetch error:", error);
            });
    }, []);

    return (
        <div className="genetic-services">
            <h2 className="services-title">Genetic Services</h2>
            <div className="services-grid">
                {services.map((service, index) => (
                    <div className="service-card" key={index}>
                        {service}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GeneticServices;
