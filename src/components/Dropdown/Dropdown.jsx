
import { Link } from "react-router-dom";
import "./dropdown.css";

export const Dropdown = ({ toggleDropdown }) => {
  return (
    <ul className="dropdown-menu">
      <li>
        <Link to="/login" className="dropdown-link" onClick={toggleDropdown}>
          Login
        </Link>
      </li>
      <li>
        <Link to="/register" className="dropdown-link" onClick={toggleDropdown}>
          Register
        </Link>
      </li>
      <li>
        <Link to="/logout" className="dropdown-link" onClick={toggleDropdown}>
          Logout
        </Link>
      </li>
    </ul>
  );
};


