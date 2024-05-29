import "./Landing.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  const handleClickToAdminLogin = () => {
    navigate("/adminlogin");
  };
  return (
    <>
      <div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      <div className="to-admin-login">
        <button
          className="to-admin-login-btn"
          onClick={handleClickToAdminLogin}
          style={{ textDecoration: "none", color: "white" }}
        >
          <div className="admin-login-text">Admin Login</div>
          <i className="fa-solid fa-arrow-right" id="forward-arrow"></i>
        </button>
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
