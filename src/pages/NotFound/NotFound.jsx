import { Link } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";
import "./NotFound.css";

const NotFound = () => {
    return (
        <main className="not-found">
            <div className="not-found-card">

                <FiAlertCircle className="not-found-icon" />

                <h2>Page Not Found</h2>

                <p>
                    The page you’re looking for doesn’t exist
                    <br />
                    or has been moved.
                </p>

                <Link to="/" className="home-btn">
                    Go to Home
                </Link>
            </div>
        </main>
    );
};

export default NotFound;
