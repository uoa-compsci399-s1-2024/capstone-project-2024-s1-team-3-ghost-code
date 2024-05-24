import React from "react";
import "./CDashboard.css";
import { Link } from "react-router-dom";
import logo from "../VERIFYLogo.jpg";

function ClientDashboard() {
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
      <a
        href="https://www.verifytraining.auckland.ac.nz/s"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "white" }} // Apply any additional styles here
      >
        <button className="clientButton">Verify Training</button>
      </a>
      <br></br>
      <br></br>

      <Link to="/quizDashboard" style={{ textDecoration: "none" }}>
        <button className="clientButton">Dashboard</button>
      </Link>

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
