import {useState, useEffect, useRef} from "react";
import {Link, useLocation} from "react-router-dom";
import logo from "../../assets/logo.png";
import "./navbar.css";
import {logout} from "../../utils/logout.js";
import {isAuthenticated} from "../../auth/auth.js";
import {UserName} from "../UserName/UserName.jsx";

export const Navbar = () => {
    const email = localStorage.getItem("email");
    const [click, setClick] = useState(false);
    const [eventsDropdown, setEventsDropdown] = useState(false);
    const [accountDropdown, setAccountDropdown] = useState(false);
    const location = useLocation();
    const eventsDropdownRef = useRef(null);
    const accountDropdownRef = useRef(null);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 960);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 960);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (eventsDropdownRef.current && !eventsDropdownRef.current.contains(event.target)) {
                setEventsDropdown(false);
            }
            if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
                setAccountDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClick = () => {
        setClick(!click);
        document.body.classList.toggle('menu-open', !click);  // Toggle body class
    };

    const toggleEventsDropdown = () => {
        setEventsDropdown(!eventsDropdown);
    };

    const toggleAccountDropdown = () => {
        setAccountDropdown(!accountDropdown);
    };

    const closeDropdownMenu = () => {
        setClick(false);
        setEventsDropdown(false);
        setAccountDropdown(false);
        document.body.classList.remove('menu-open');  // Remove body class when menu is closed
    };

    const getNavLinkClass = (path) => {
        return location.pathname === path ? "nav-links active-link" : "nav-links";
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={closeDropdownMenu}>
                    <img className="logo" src={logo} alt="event schedule app main logo"/>
                </Link>
                <div className="menu-icon" onClick={handleClick}>
                    <i className={click ? "fas fa-times" : "fas fa-bars"}></i>
                </div>
                <ul className={click ? "nav-menu active" : "nav-menu"}>
                    <li className="nav-item">
                        <Link
                            to="/"
                            className={getNavLinkClass("/")}
                            onClick={closeDropdownMenu}
                        >
                            Home
                        </Link>
                    </li>
                    <li
                        className="nav-item"
                        onMouseEnter={() => setEventsDropdown(true)}
                        onMouseLeave={() => setEventsDropdown(false)}
                        ref={eventsDropdownRef}
                    >
                        <div className="nav-links" onClick={toggleEventsDropdown}>
                            Events &nbsp; <i className="fas fa-caret-down"/>
                        </div>
                        {(eventsDropdown || isMobile) && (
                            <ul className="dropdown-menu">
                                <li>
                                    <Link
                                        to="/events/create-events"
                                        className="dropdown-link"
                                        onClick={closeDropdownMenu}
                                    >
                                        Create Event
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/events/my-invitations"
                                        className="dropdown-link"
                                        onClick={closeDropdownMenu}
                                    >
                                        My Invitations
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className="nav-item">
                        <Link
                            to="/contact"
                            className={getNavLinkClass("/contact")}
                            onClick={closeDropdownMenu}
                        >
                            Contact
                        </Link>
                    </li>
                    <li
                        className="nav-item"
                        onMouseEnter={() => setAccountDropdown(true)}
                        onMouseLeave={() => setAccountDropdown(false)}
                        ref={accountDropdownRef}
                    >
                        <div
                            style={isAuthenticated() ? {marginBottom: "20px"} : {marginBottom: "0px"}}
                            className={`nav-links ${isAuthenticated() ? "" : "nav-links-border"}`}
                            onClick={toggleAccountDropdown}
                        >
                            {isAuthenticated() ? (
                                <UserName username={email}/>
                            ) : (
                                <Link onClick={closeDropdownMenu} to="/login">
                                    Login
                                </Link>
                            )}
                        </div>
                        {(accountDropdown || isMobile) && isAuthenticated() && (
                            <ul className="dropdown-menu">
                                <li onClick={() => logout()}>
                                    <Link
                                        to="/"
                                        className="dropdown-link"
                                        onClick={closeDropdownMenu}
                                    >
                                        Logout
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
};
