import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "./NavBar.css";

function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);
    useEffect(() => {
        document.body.classList.toggle("menu-open", menuOpen);
        return () => document.body.classList.remove("menu-open");
    }, [menuOpen]);
    return (
        <nav className="navbar">

            {/* Hamburger / Close Button */}
            <div
                className="hamburger"
                aria-label="Toggle navigation"
            >
                <NavLink to="/appointment" onClick={closeMenu}
                    className={({ isActive }) =>
                        `appointment-btn ${menuOpen ? "hide": ""} ` + (isActive ? "active-link" : "inactive-link")
                    }>
                    Request Appointment
                </NavLink>
                <div onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? "✕" : "☰"}
                </div>
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

                <li>
                    <NavLink to="/appointment" onClick={closeMenu}
                        className={({ isActive }) =>
                            "appointment-btn appointment-btn-web " + (isActive ? "active-link" : "inactive-link")
                        }>
                        Request Appointment
                    </NavLink>
                </li>
            </ul>

        </nav>
    );
}

export default NavBar;
