import { useEffect, useRef, useState } from "react";
import {
    FaWhatsapp,
    FaEnvelope,
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaChevronUp,
    FaYoutube,
    FaPhoneAlt,
} from "react-icons/fa";
import { sanityClient } from "../../SanityClient";
import "./Socials.css";

const Socials = () => {
    const [open, setOpen] = useState(false);
    const [contact, setContact] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        sanityClient
            .fetch(`
                *[_type == "contact" && _id == "contact"][0]{
                    email,
                    phone,
                    whatsapp,
                    facebook,
                    instagram,
                    linkedin,
                    youtube
                }
            `)
            .then(setContact)
            .catch(console.error);
    }, []);

    /* ✅ Auto-close when clicking outside */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!contact) return null;

    return (
        <div className="floating-contact" ref={containerRef}>
            {/* Expanded icons */}
            <div className={`floating-icons ${open ? "show" : ""}`}>

                {contact.phone && (
                    <a href={`tel:${contact.phone}`} data-tooltip="Call">
                        <FaPhoneAlt />
                    </a>
                )}

                {contact.email && (
                    <a href={`mailto:${contact.email}`} data-tooltip="Email">
                        <FaEnvelope />
                    </a>
                )}

                {contact.facebook && (
                    <a
                        href={contact.facebook}
                        target="_blank"
                        rel="noreferrer"
                        data-tooltip="Facebook"
                    >
                        <FaFacebookF />
                    </a>
                )}

                {contact.instagram && (
                    <a
                        href={contact.instagram}
                        target="_blank"
                        rel="noreferrer"
                        data-tooltip="Instagram"
                    >
                        <FaInstagram />
                    </a>
                )}

                {contact.linkedin && (
                    <a
                        href={contact.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        data-tooltip="LinkedIn"
                    >
                        <FaLinkedinIn />
                    </a>
                )}

                {contact.youtube && (
                    <a
                        href={contact.youtube}
                        target="_blank"
                        rel="noreferrer"
                        data-tooltip="YouTube"
                    >
                        <FaYoutube />
                    </a>
                )}
            </div>

            {/* Toggle Arrow */}
            <button
                className={`toggle-btn ${open ? "open" : ""}`}
                onClick={() => setOpen(!open)}
                aria-label="Toggle contact options"
            >
                <FaChevronUp />
            </button>

            {/* WhatsApp Button */}
            {contact.whatsapp && (
                <a
                    href={contact.whatsapp}
                    className="whatsapp-btn"
                    target="_blank"
                    rel="noreferrer"
                    data-tooltip="WhatsApp"
                >
                    <FaWhatsapp />
                </a>
            )}
        </div>
    );
};

export default Socials;
