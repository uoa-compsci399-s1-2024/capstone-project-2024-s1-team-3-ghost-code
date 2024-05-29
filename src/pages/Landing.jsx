import "./Landing.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <>
      <div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      <div className="to-admin-login">
        <i className="fa-solid fa-arrow-right" id="forward-arrow"></i>
        <Link
          style={{ textDecoration: "none", color: "white" }}
          to="/adminlogin"
        >
          <div className="admin-login-text">Admin Login</div>
        </Link>
      </div>
      <div className="welcome-page">
        <h2>VERIFY TMS Quizzes</h2>
        <p>
          Here you will find the quizzes for TMS modules 1-6 to help you get
          certified to use TMS in your workplace. If you are new please click
          Start Quizzes and if you have already started the quizzes please click
          the Continue Quizzes button.
        </p>
        <div className="button-next-to">
          <Link to="/registration">
            <button className="start-quiz">Start Quizzes</button>
          </Link>
          <Link to="/cliniciansign">
            <button className="start-quiz">Continue Quizzes </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Landing;
