import { useState } from "react";
import {
    FaWhatsapp,
    FaEnvelope,
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaChevronUp,
} from "react-icons/fa";
import "./Socials.css";

const Socials = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="floating-contact">
            {/* Expanded icons */}
            <div className={`floating-icons ${open ? "show" : ""}`}>
                <a href="mailto:info@example.com" aria-label="Email">
                    <FaEnvelope />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                    <FaFacebookF />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                    <FaInstagram />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                    <FaLinkedinIn />
                </a>
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
            <a
                href="https://wa.me/971987654321"
                className="whatsapp-btn"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
            >
                <FaWhatsapp />
            </a>
        </div>
    );
};

export default Socials;
