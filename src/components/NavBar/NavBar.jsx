import { NavLink } from "react-router-dom";

function NavBar() {
    return (
        <nav>
            <ul>
                <li>
                    <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/certificates-membership" className={({ isActive }) => isActive ? "active-link" : ""}>
                        Certificates & Memberships
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/education-experience" className={({ isActive }) => isActive ? "active-link" : ""}>
                        Education & Work Experience
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/awards" className={({ isActive }) => isActive ? "active-link" : ""}>
                        Awards
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/research-publications" className={({ isActive }) => isActive ? "active-link" : ""}>
                        Research & Publications
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/events" className={({ isActive }) => isActive ? "active-link" : ""}>
                        Events
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;