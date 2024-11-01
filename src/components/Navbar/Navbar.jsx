import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./navbar.css";
import { isAuthenticated } from "../../auth/auth.js";
import { UserName } from "../UserName/UserName.jsx";

export const Navbar = () => {
    const email = localStorage.getItem("email");
    const [click, setClick] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 960);
    const [eventsDropdown, setEventsDropdown] = useState(false); // State for dropdown
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
        setEventsDropdown(false); // Close dropdown when main menu is closed
        document.body.classList.remove("menu-open");
    };

    const toggleEventsDropdown = () => {
        setEventsDropdown(!eventsDropdown); // Toggle dropdown on click
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

                    {/* Events with dropdown menu */}
                    <li className="nav-item dropdown">
                        <div 
                            className={`nav-links ${eventsDropdown ? "active" : ""}`}
                            onClick={toggleEventsDropdown}
                        >
                            Events <i className="fas fa-caret-down"></i>
                        </div>
                        {eventsDropdown && (
                            <ul className="dropdown-menu">
                                <li>
                                    <Link to="/events/my-invitations" onClick={closeDropdownMenu}>
                                        My Invitations
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/events/create-events" onClick={closeDropdownMenu}>
                                        Create Events
                                    </Link>
                                </li>
                            </ul>
                        )}
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
