import React from "react";
import "./ADashboard.css";
import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="Admindashboard-container">
      <div className="Adminlogo-container">
        <img
          className="Adminlogo"
          loading="lazy"
          src="src/components/VERIFYLogo.jpg"
          alt="DashboardLogo"
        />
      </div>
      <button className="Adminbutton">Dashboard</button>
      <button className="Adminbutton">Edit Quiz</button>
      <button className="Adminbutton">Clinicians</button>
      <button className="Adminbutton">Statistics</button>
      <br></br>
      <Link
        style={{ textDecoration: "none", color: "white" }}
        to="/adminSettings"
      >
        <button className="Adminbutton">Settings</button>
      </Link>
    </div>
  );
}

export default AdminDashboard;
