import "./Landing.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <>
      <div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
      </div>
      <div className="to-admin-login">
        <Link
          style={{ textDecoration: "none", color: "white" }}
          to="/adminlogin"
        >
          <div className="admin-login-text">Admin Login</div>
        </Link>
        <i className="fa-solid fa-arrow-right" id="forward-arrow"></i>
      </div>
      <div className="welcome-page">
        <h2>Welcome To The Verify Study</h2>
        <p>
          Here you will find the module quizzes to give you a step forward in
          being certified to use TMS in your workplace, click the button below
          to begin the quiz.
        </p>
        <button className="start-quiz">Start The Quiz</button>
      </div>
    </>
  );
}

export default Landing;
