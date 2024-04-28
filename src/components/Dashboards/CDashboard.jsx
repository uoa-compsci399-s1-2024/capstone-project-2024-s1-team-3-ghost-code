import React from "react";
import "./CDashboard.css";

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
      <button className="clientButton">Resources</button>
      <button className="clientButton">Dashboard</button>

      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <button className="clientButton">Settings</button>
    </div>
  );
}

export default ClientDashboard;
