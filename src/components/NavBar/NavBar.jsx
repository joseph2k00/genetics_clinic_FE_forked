import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./NavBar.css";

function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar">

            {/* Hamburger / Close Button */}
            <div
                className="hamburger"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle navigation"
            >
                {menuOpen ? "✕" : "☰"}
            </div>

            {/* Fullscreen Menu */}
            <ul className={`navbar-list fullscreen ${menuOpen ? "show" : ""}`}>
                <li>
                    <NavLink to="/" onClick={closeMenu}
                        className={({ isActive }) =>
                            isActive ? "active-link" : "inactive-link"
                        }>
                        Home
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/certificates-membership" onClick={closeMenu}
                        className={({ isActive }) =>
                            isActive ? "active-link" : "inactive-link"
                        }>
                        Certificates & Memberships
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/education-experience" onClick={closeMenu}
                        className={({ isActive }) =>
                            isActive ? "active-link" : "inactive-link"
                        }>
                        Education & Work Experience
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/awards" onClick={closeMenu}
                        className={({ isActive }) =>
                            isActive ? "active-link" : "inactive-link"
                        }>
                        Awards
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/research-publications" onClick={closeMenu}
                        className={({ isActive }) =>
                            isActive ? "active-link" : "inactive-link"
                        }>
                        Research & Publications
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/events" onClick={closeMenu}
                        className={({ isActive }) =>
                            isActive ? "active-link" : "inactive-link"
                        }>
                        Events
                    </NavLink>
                </li>
            </ul>

        </nav>
    );
}

export default NavBar;
