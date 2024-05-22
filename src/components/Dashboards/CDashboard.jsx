import React from "react";
import "./CDashboard.css";
import { Link } from "react-router-dom";
import logo from "../VERIFYLogo.jpg";

function ClientDashboard() {
  return (
    <div className="clientDashboardContainer">
      <div className="clientLogoContainer">
        <img
          className="clientLogo"
          loading="lazy"
          src={logo}
          alt="DashboardLogo"
        />
      </div>
      <Link
        to="https://www.verifytraining.auckland.ac.nz/s"
        style={{ textDecoration: "none" }}
      >
        <button className="clientButton">Verify Training</button>
      </Link>
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

      <Link to="/quizClientSettings" style={{ textDecoration: "none" }}>
        <button className="clientButton">Settings</button>
      </Link>
    </div>
  );
}

export default ClientDashboard;
