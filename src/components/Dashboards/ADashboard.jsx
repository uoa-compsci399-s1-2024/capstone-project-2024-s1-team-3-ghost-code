import React from "react";
import "./ADashboard.css";

function AdminDashboard() {
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
      <button className="button">Dashboard</button>
      <button className="button">Edit Quiz</button>
      <button className="button">Clinicians</button>
      <button className="button">Statistics</button>
      <br></br>
      
      <button className="button">Settings</button>
    </div>
  );
}

export default AdminDashboard;
