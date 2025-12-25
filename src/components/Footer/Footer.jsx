import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <p className="footer-text">For more information</p>

            <div className="footer-icons">
                <a href="https://wa.me/971987654321" aria-label="WhatsApp">
                    <i className="icon whatsapp"></i>
                </a>
                <a href="mailto:info@example.com" aria-label="Email">
                    <i className="icon email"></i>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                    <i className="icon facebook"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                    <i className="icon instagram"></i>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <i className="icon linkedin"></i>
                </a>
            </div>

            <div className="footer-phone">
                <span>📞</span>
                <a href="tel:+971987654321">+971 98 765 4321</a>
            </div>
        </footer>
    );
};

export default Footer;
