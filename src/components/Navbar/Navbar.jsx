import { useState, useEffect, useRef } from "react"; 
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./navbar.css";
import { isAuthenticated } from "../../auth/auth.js";
import { UserName } from "../UserName/UserName.jsx";

export const Navbar = () => {
    const email = localStorage.getItem("email");
    const [click, setClick] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 960);
    const [eventsDropdown, setEventsDropdown] = useState(false);
    const location = useLocation();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 960);
        window.addEventListener("resize", handleResize);

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setEventsDropdown(false);
            }
        };

        if (isMobile) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMobile]);

    const handleClick = () => {
        setClick(!click);
        document.body.classList.toggle("menu-open", !click);
    };

    const closeDropdownMenu = () => {
        setClick(false);
        setEventsDropdown(false);
        document.body.classList.remove("menu-open");
    };

    const toggleEventsDropdown = () => {
        setEventsDropdown(!eventsDropdown);
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
                    <li
                        className={`nav-item dropdown ${eventsDropdown ? "active" : ""}`}
                        onMouseEnter={!isMobile ? toggleEventsDropdown : null}
                        onMouseLeave={!isMobile ? toggleEventsDropdown : null}
                        onClick={isMobile ? toggleEventsDropdown : null}
                        ref={dropdownRef}
                    >
                        <div className={`nav-links ${eventsDropdown ? "active" : ""}`}>
                            Events <i className="fas fa-caret-down"></i>
                        </div>
                        {eventsDropdown && (
                            <ul className="dropdown-menu">
                                <li>
                                    <Link to="/my-invitations" className={getNavLinkClass("/my-invitations")} onClick={closeDropdownMenu}>
                                        My Invitations
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/create" className={getNavLinkClass("/create")} onClick={closeDropdownMenu}>
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
        </nav>
    );
};
