import { useEffect, useRef, useState } from "react";
import { sanityClient, urlFor } from "../../SanityClient";
import Loader from "../../components/Loader/Loader";
import "./Events.css";

const Events = () => {
    const [events, setEvents] = useState([]);
    const [activeMedia, setActiveMedia] = useState({});
    const [canScroll, setCanScroll] = useState({});
    const scrollRefs = useRef({});
    const [isLoading, setIsLoading] = useState(true);
    const isMobile = window.innerWidth <= 600;
    const [modalImage, setModalImage] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") setModalImage(null);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);
    useEffect(() => {
        sanityClient
            .fetch(`
                *[_type == "events" && _id == "events"][0]{
                    events[]{
                        _key,
                        title,
                        date,
                        body[]{
                            children[]{ text }
                        },
                        images[]{
                            _key,
                            asset
                        }
                    }
                }
            `)
            .then((data) => {
                const evs = data?.events || [];
                setEvents(evs);

                const initialActive = {};
                const scrollable = {};

                evs.forEach(event => {
                    if (event.images?.length) {
                        initialActive[event._key] = event.images[0];

                        // 🔑 MOBILE = >3, DESKTOP = >6
                        scrollable[event._key] = isMobile
                            ? event.images.length > 3
                            : event.images.length > 6;
                    }
                });

                setActiveMedia(initialActive);
                setCanScroll(scrollable);
                setIsLoading(false);
            })
            .catch(console.error);
    }, []);

    const scroll = (key, direction) => {
        const ref = scrollRefs.current[key];
        if (!ref) return;

        ref.scrollBy({
            left: direction === "left" ? -240 : 240,
            behavior: "smooth",
        });
    };

    return isLoading ? <Loader /> :(
        <div className="section">
            <div className="section-title">Events</div>

            <div className="events-container">
                {events.map((event) => (
                    <div className="event" key={event._key}>

                        {/* MEDIA */}
                        <div className="event-medias">
                            <div className="active-event-media">
                                {activeMedia[event._key] && (
                                    <>
                                        <img
                                            src={urlFor(activeMedia[event._key])
                                                .width(1400)
                                                .quality(75)
                                                .format("webp")
                                                .url()}
                                            alt="event"
                                        />

                                        {/* Fullscreen button */}
                                        <button
                                            className="fullscreen-btn"
                                            onClick={() => {
                                                setModalLoading(true);
                                                setModalImage(activeMedia[event._key])
                                            }}
                                            aria-label="View fullscreen"
                                        >
                                            ⤢
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="event-medias-scroll-list">
                                {canScroll[event._key] && (
                                    <div
                                        className="media-arrow left"
                                        onClick={() => scroll(event._key, "left")}
                                    >
                                        ‹
                                    </div>
                                )}

                                <div
                                    className="media-list"
                                    ref={(el) =>
                                        (scrollRefs.current[event._key] = el)
                                    }
                                >
                                    {event.images.map((media) => (
                                        <div
                                            key={media._key}
                                            className={`media-thumb ${
                                                activeMedia[event._key]?._key === media._key
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setActiveMedia({
                                                    ...activeMedia,
                                                    [event._key]: media,
                                                })
                                            }
                                        >
                                            <img
                                                src={urlFor(media)
                                                    .width(220)
                                                    .quality(60)
                                                    .format("webp")
                                                    .url()}
                                                alt="thumb"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {canScroll[event._key] && (
                                    <div
                                        className="media-arrow right"
                                        onClick={() => scroll(event._key, "right")}
                                    >
                                        ›
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* DETAILS */}
                        <div className="event-details">
                            <h3>{event.title}</h3>
                            {event.date && (
                                <p className="event-date">{event.date}</p>
                            )}
                            {event.body?.[0]?.children?.[0]?.text && (
                                <p className="event-description">
                                    {event.body[0].children[0].text}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {modalImage && (
                <div
                    className="image-modal-overlay"
                    onClick={() => setModalImage(null)}
                >
                    <div
                        className="image-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Loader */}
                        {modalLoading && (
                            <div className="modal-loader">
                                <Loader />
                            </div>
                        )}

                        {/* Image */}
                        <img
                            src={urlFor(modalImage)
                                .width(2000)
                                .quality(85)
                                .format("webp")
                                .url()}
                            alt="fullscreen"
                            onLoad={() => setModalLoading(false)}
                            style={{
                                opacity: modalLoading ? 0 : 1,
                            }}
                        />

                        {/* Close */}
                        <button
                            className="modal-close"
                            onClick={() => setModalImage(null)}
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Events;
