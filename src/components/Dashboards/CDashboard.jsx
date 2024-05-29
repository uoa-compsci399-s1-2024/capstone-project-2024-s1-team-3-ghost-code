import React from "react";
import "./CDashboard.css";
import { Link, useLocation } from "react-router-dom";
import logo from "../VERIFYLogo.jpg";

function ClientDashboard() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <div className="clientDashboardContainer">
      <div className="clientLogoContainer">
        <a href="/quizDashboard ">
          <img
            className="clientLogo"
            loading="lazy"
            src={logo}
            alt="DashboardLogo"
          />
        </a>
      </div>
      <div className="CDashButtons">
        <Link className="ClientLink" to="/quizDashboard">
          <button className={`clientButton ${isActive("/quizDashboard")}`}>
            Home
          </button>
        </Link>

        <Link className="ClientLink" to="/clinicianProfile">
          <button className={`clientButton ${isActive("/clinicianProfile")}`}>
            My Profile
          </button>
        </Link>

        <a
          href="https://www.verifytraining.auckland.ac.nz/s"
          target="_blank"
          rel="noopener noreferrer"
          className="ClientLink"
          style={{ marginTop: "50%" }}
        >
          <button className="clientButton">TMS Training Website </button>
        </a>
      </div>
    </div>
  );
}

export default ClientDashboard;
