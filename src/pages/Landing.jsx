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
        <h2>Welcome To The Verify Study</h2>
        <p>
          Here you will find the module quizzes to give you a step forward in
          being certified to use TMS in your workplace, click the button below
          to begin the quiz.
        </p>
        <Link to="/presurvey">
          <button className="start-quiz">Start The Quiz</button>
        </Link>
      </div>
    </>
  );
}

export default Landing;
