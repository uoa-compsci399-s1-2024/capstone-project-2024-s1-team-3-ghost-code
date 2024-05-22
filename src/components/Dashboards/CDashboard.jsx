import React from "react";
import "./CDashboard.css";
import { Link } from "react-router-dom";

function ClientDashboard() {
  return (
    <div className="clientDashboardContainer">
      <div className="clientLogoContainer">
        <img
          className="clientLogo"
          loading="lazy"
          src="src/components/VERIFYLogo.jpg"
          alt="DashboardLogo"
        />
      </div>
      <a
        href="https://www.verifytraining.auckland.ac.nz/s"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
        <button className="clientButton">Verify Training</button>
      </a>

      <Link to="/quizDashboard" style={{ textDecoration: "none" }}>
        <button className="clientButton">Dashboard</button>
      </Link>

      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Link to="/clinicianProfile" style={{ textDecoration: "none" }}>
        <button className="clientButton">My Profile</button>
      </Link>
    </div>
  );
}

export default ClientDashboard;
