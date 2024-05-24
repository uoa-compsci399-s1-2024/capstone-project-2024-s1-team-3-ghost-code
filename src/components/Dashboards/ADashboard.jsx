import React from "react";
import "./ADashboard.css";
import { Link } from "react-router-dom";
import logo from "../VERIFYLogo.jpg";

function AdminDashboard() {
  return (
    <div className="Admindashboard-container">
      <div className="Adminlogo-container">
      <a href="/home">
        <img
          className="Adminlogo"
          loading="lazy"
          src={logo}
          alt="DashboardLogo"
        />
      </a>
      </div>
      <Link style={{ textDecoration: "none", color: "white" }} to="/EditQuiz">
        <button className="Adminbutton">Edit Quiz</button>
      </Link>

      <Link
        style={{ textDecoration: "none", color: "white" }}
        to="/adminsearch"
      >
        <button className="Adminbutton">Clinicians</button>
      </Link>

      <Link style={{ textDecoration: "none", color: "white" }} to="/adminStats">
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
