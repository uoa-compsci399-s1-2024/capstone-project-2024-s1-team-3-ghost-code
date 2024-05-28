import React from "react";
import "./ADashboard.css";
import { Link, useLocation} from "react-router-dom";
import logo from "../VERIFYLogo.jpg";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";

function AdminDashboard() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <div className="Admindashboard-container">
      <div className="Adminlogo-container">
        <a href="/adminsearch">
          <img
            className="Adminlogo"
            loading="lazy"
            src={logo}
            alt="DashboardLogo"
          />
        </a>
      </div>
      <div className="ADashButtons">
        <Link className="AdminLink" to="/EditQuiz">
          <button className={`Adminbutton ${isActive("/EditQuiz")}`}>Edit Quiz</button>
        </Link>
        <Link className="AdminLink" to="/adminsearch">
          <button className={`Adminbutton ${isActive("/adminsearch")}`}>Clinicians</button>
        </Link>
        <Link className="AdminLink" to="/adminStats">
          <button className={`Adminbutton ${isActive("/adminStats")}`}>Statistics</button>
        </Link>
        <Link className="AdminLink" to="/adminSettings">
          <button className={`Adminbutton ${isActive("/adminSettings")}`}>Settings</button>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
