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
      <Link to="/quizResources" style={{ textDecoration: "none" }}>
      <button className="clientButton">Resources</button>
      </Link>

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
      <Link to="/quizClientSettings" style={{ textDecoration: "none" }}>
      <button className="clientButton">Settings</button>
      </Link>
    </div>
  );
}

export default ClientDashboard;
