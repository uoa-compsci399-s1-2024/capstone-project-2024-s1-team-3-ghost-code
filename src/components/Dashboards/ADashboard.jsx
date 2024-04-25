import React from "react";
import "./ADashboard.css";

function AdminDashboard() {
  return (
    <div className="Adashboard-container">
      <div className="Alogo-container">
        <img
          className="Alogo"
          loading="lazy"
          src="src/components/VERIFYLogo.jpg"
          alt="DashboardLogo" 
        />
      </div>
      <button className="Abutton">Dashboard</button>
      <button className="Abutton">Edit Quiz</button>
      <button className="Abutton">Clinicians</button>
      <button className="Abutton">Statistics</button>
      <br></br>
      
      <button className="Abutton">Settings</button>
    </div>
  );
}

export default AdminDashboard;
