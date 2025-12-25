import { useEffect, useRef, useState } from "react";
import { sanityClient } from "../../../../SanityClient";
import "./Videos.css";

const getEmbedUrl = (url) => {
    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const match = url.match(/(v=|\/)([0-9A-Za-z_-]{11})/);
        return match
            ? `https://www.youtube.com/embed/${match[2]}`
            : url;
    }

    // Facebook
    if (url.includes("facebook.com")) {
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
            url
        )}&show_text=false`;
    }

    return url;
};

const Videos = () => {
    const [videos, setVideos] = useState([]);
    const videosRef = useRef(null);

    useEffect(() => {
        sanityClient
            .fetch(`
                *[_type == "videos" && _id == "videos"][0]{
                    videos[]{
                        _key,
                        title,
                        description,
                        video_url
                    }
                }
            `)
            .then((data) => {
                setVideos(data?.videos || []);
            })
            .catch(console.error);
    }, []);

    const scroll = (direction) => {
        const container = videosRef.current;
        const scrollAmount = container.offsetWidth;
        container.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <div className="section">
            <div className="section-title">Videos</div>

            <div className="section-content">
                <div className="left-arrow" onClick={() => scroll("left")}>
                    ‹
                </div>

                <div className="videos" ref={videosRef}>
                    {videos.map((video) => (
                        <div className="video-card" key={video._key}>
                            <div className="video-frame">
                                <iframe
                                    src={getEmbedUrl(video.video_url)}
                                    title={video.title}
                                    loading="lazy"
                                    allowFullScreen
                                />
                            </div>
                            <h3>{video.title}</h3>
                            <p>{video.description}</p>
                        </div>
                    ))}
                </div>

                <div className="right-arrow" onClick={() => scroll("right")}>
                    ›
                </div>
            </div>
        </div>
    );
};

export default Videos;
