import { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import "./BackToTop.css";

const BackToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > 300);
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            className={`back-to-top ${visible ? "show" : ""}`}
            onClick={scrollToTop}
            aria-label="Back to top"
        >
            <FaChevronUp />
            <span>Back to top</span>
        </button>
    );
};

export default BackToTop;
