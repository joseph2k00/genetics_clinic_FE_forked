import { useEffect, useState } from "react";
import { sanityClient } from "../../SanityClient";
import "./Education.css"

const Education = () => {
    const [experiences, setExperiences] = useState([]);

    useEffect(() => {
        sanityClient
            .fetch(`
                *[_type == "exps" && _id == "exps"][0]{
                    title,
                    exps[]{
                        _key,
                        date,
                        title
                    }
                }
            `)
            .then((data) => {
                setExperiences(data?.exps || []);
            })
            .catch(console.error);
    }, []);

    return (
        <div className="section">
            <div className="section-title">Education & Work Experience</div>

            <div className="experience-container">
                {experiences.map((item) => (
                    <div className="experience-card" key={item._key}>
                        <div className="experience-date">{item.date}</div>
                        <div className="experience-title">{item.title}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Education;
