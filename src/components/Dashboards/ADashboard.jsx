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
      <Link to="/adminDashboard" style={{ textDecoration: "none" }}>
        <button className="Adminbutton">Dashboard</button>
      </Link>
      <Link to="/editQuiz" style={{ textDecoration: "none" }}>
        <button className="Adminbutton">Edit Quiz</button>
      </Link>
      <Link to="/adminsearch" style={{ textDecoration: "none" }}>
        <button className="Adminbutton">Clinicians</button>
      </Link>
      <Link to="/statistics" style={{ textDecoration: "none" }}>
        <button className="Adminbutton">Statistics</button>
      </Link>
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
