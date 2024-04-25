import React from "react";
import "./CDashboard.css";

function ClientDashboard() {
  return (
    <div className="dashboard-container">
      <div className="logo-container">
        <img
          className="logo"
          loading="lazy"
          src="src/components/VERIFYLogo.jpg"
          alt="DashboardLogo" 
        />
      </div>
      <button className="button">Resources</button>
      <button className="button">Dashboard</button>

      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <button className="button">Settings</button>
    </div>
  );
}

export default ClientDashboard;
