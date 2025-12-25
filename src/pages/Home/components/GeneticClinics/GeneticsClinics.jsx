import { useEffect, useRef, useState } from "react";
import { sanityClient } from "../../../../SanityClient";
import "./GeneticsClinics.css";

const GeneticsClinics = () => {
    const [clinics, setClinics] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        sanityClient
            .fetch(`
                *[_type == "clinics" && _id == "clinics"][0]{
                    title,
                    clinics[]->{
                        _id,
                        name,
                        city,
                        url
                    }
                }
            `)
            .then((data) => {
                setClinics(data?.clinics || []);
            })
            .catch(console.error);
    }, []);

    const scroll = (direction) => {
        const amount = 360;
        scrollRef.current.scrollBy({
            left: direction === "left" ? -amount : amount,
            behavior: "smooth",
        });
    };

    return (
        <section className="genetics-clinics">
            <h2 className="clinics-title">Genetics Clinics</h2>

            <div className="clinics-wrapper">
                {clinics.length > 3 && (
                    <button className="scroll-btn left" onClick={() => scroll("left")}>
                        ‹
                    </button>
                )}

                <div className="clinics-track" ref={scrollRef}>
                    {clinics.map((clinic) => (
                        <a className="clinic-card" key={clinic._id} href={clinic.url} target="_blank">
                            <iframe
                                src={clinic.url}
                                title={clinic.name}
                                loading="lazy"
                            />

                            <div className="clinic-overlay">
                                <h3>{clinic.name}</h3>
                                <p>{clinic.city}</p>
                            </div>
                        </a>
                    ))}
                </div>

                {clinics.length > 3 && (
                    <button className="scroll-btn right" onClick={() => scroll("right")}>
                        ›
                    </button>
                )}
            </div>
        </section>
    );
};

export default GeneticsClinics;
