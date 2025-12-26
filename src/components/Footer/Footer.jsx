import { useEffect, useState } from "react";
import { sanityClient } from "../../SanityClient";
import "./Footer.css";
import {
    FaWhatsapp,
    FaEnvelope,
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaPhoneAlt
} from "react-icons/fa";

const Footer = () => {
    const [contact, setContact] = useState(null);

    useEffect(() => {
        sanityClient
            .fetch(`
                *[_type == "contact" && _id == "contact"][0]{
                    title,
                    phone,
                    email,
                    whatsapp,
                    facebook,
                    instagram,
                    linkedin
                }
            `)
            .then(setContact)
            .catch(console.error);
    }, []);

    if (!contact) return null;

    return (
        <footer className="footer">
            <p className="footer-text">
                {contact.title || "For more information"}
            </p>
            <div className="footer-icons">
                {contact.whatsapp && (
                    <a
                        href={contact.whatsapp}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="WhatsApp"
                    >
                        <span className="icon">
                            <FaWhatsapp />
                        </span>
                    </a>
                )}

                {contact.email && (
                    <a href={`mailto:${contact.email}`} aria-label="Email">
                        <span className="icon">
                            <FaEnvelope />
                        </span>
                    </a>
                )}

                {contact.facebook && (
                    <a
                        href={contact.facebook}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Facebook"
                    >
                        <span className="icon">
                            <FaFacebookF />
                        </span>
                    </a>
                )}

                {contact.instagram && (
                    <a
                        href={contact.instagram}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Instagram"
                    >
                        <span className="icon">
                            <FaInstagram />
                        </span>
                    </a>
                )}

                {contact.linkedin && (
                    <a
                        href={contact.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="LinkedIn"
                    >
                        <span className="icon">
                            <FaLinkedinIn />
                        </span>
                    </a>
                )}
            </div>
            {contact.phone && (
                <div className="footer-phone">
                    <span><FaPhoneAlt /></span>
                    <a href={`tel:${contact.phone}`}>
                        {contact.phone}
                    </a>
                </div>
            )}
        </footer>
    );
};

export default Footer;
