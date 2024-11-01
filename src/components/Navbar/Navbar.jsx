import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./navbar.css";
import { logout } from "../../utils/logout.js";
import { isAuthenticated } from "../../auth/auth.js";
import { UserName } from "../UserName/UserName.jsx";

export const Navbar = () => {
    const email = localStorage.getItem("email");
    const [click, setClick] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 960);
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 960);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleClick = () => {
        setClick(!click);
        document.body.classList.toggle("menu-open", !click);
    };

    const closeDropdownMenu = () => {
        setClick(false);
        document.body.classList.remove("menu-open");
    };

    const getNavLinkClass = (path) => {
        return location.pathname === path ? "nav-links active-link" : "nav-links";
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/home" className="navbar-logo" onClick={closeDropdownMenu}>
                    <img className="logo" src={logo} alt="event schedule app main logo" />
                </Link>

                <ul className={`nav-menu ${click ? "active" : ""}`}>
                    <li className="nav-item">
                        <Link to="/home" className={getNavLinkClass("/home")} onClick={closeDropdownMenu}>
                            Home
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/events" className={getNavLinkClass("/events")} onClick={closeDropdownMenu}>
                            Events
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/contact" className={getNavLinkClass("/contact")} onClick={closeDropdownMenu}>
                            Contact
                        </Link>
                    </li>
                    <li className="nav-item">
                        {isAuthenticated() ? (
                            <UserName username={email} onClick={closeDropdownMenu} />
                        ) : (
                            <Link to="/login" className={getNavLinkClass("/login")} onClick={closeDropdownMenu}>
                                Login
                            </Link>
                        )}
                    </li>
                </ul>

                <div className="menu-icon" onClick={handleClick}>
                    <i className={click ? "fas fa-times" : "fas fa-bars"}></i>
                </div>
            </div>
            {click && <div className="menu-overlay" onClick={closeDropdownMenu}></div>}
        </nav>
    );
};
