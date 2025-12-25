import WorkInProgress from "../WorkInProgress/WorkInProgress";
import "./Home.css";
import { sanityClient, urlFor } from "../../SanityClient";
import { useEffect, useState } from "react";
import GeneticServices from "./components/GeneticServices/GeneticServices";
import GeneticsClinics from "./components/GeneticClinics/GeneticsClinics";
import Videos from "./components/Videos/Videos";
import Loader from "../../components/Loader/Loader";

const Home = () => {
    const [hero, setHero] = useState(null);
    const [heroImgUrl, setHeroImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        sanityClient
            .fetch(`
                *[_type == "hero" && _id == "hero"][0]{
                    name,
                    title,
                    bio,
                    image
                }
            `)
            .then((data) => {
                const imgUrl = urlFor(data.image)
                    .width(800)        // slightly higher for retina
                    .quality(75)       // 🔑 reduce size
                    .format("webp")    // 🔑 faster
                    .url();

                const img = new Image();
                img.src = imgUrl;

                img.onload = () => {
                    setHeroImageUrl(imgUrl);
                    setHero(data);
                    setLoading(false);
                };
            })
            .catch((error) => {
                console.error("Sanity fetch error:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <Loader/>;
    if (!hero) return <p>No hero data found</p>;

    return (
        <>
        
            <div className="hero">
                <div className="hero-img">
                    <img src={heroImgUrl}/>
                </div>
                <div className="hero-desc">
                    <div className="hero-title">
                        {hero.name}
                    </div>
                    <div className="hero-subtitle">
                        {hero.title.split("\n").map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                    </div>
                    <div className="request-appointment">
                        <a href="#" className="request-appointment-btn">
                            Request an Appointment  
                        </a>
                    </div>
                </div>
            </div>
            <div className="section">
                <div className="section-title">
                    Overview
                </div>
                <div className="section-text">
                    {hero.bio.split("\n").map((line, i) => (
                        <p key={i}>{line}</p>
                    ))}
                    {hero.bio}
                </div>
            </div>
            <GeneticServices/>
            <GeneticsClinics/>
            <Videos/>
        </>
    )
}

export default Home;