import "./AdminLogin.css";
import React, { useState } from "react";
import { Link, BrowserRouter, Router, Route, Routes } from "react-router-dom";
import PropTypes from "prop-types";

async function loginUser(credentials) {
  return fetch(
    "http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/auth/Login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }
  ).then((data) => data.json());
}

export function AdminLoginForm({ setToken }) {
  const [passwordVisible, setPasswordVisible] = useState(false); // Set initial state to true

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevVisible) => !prevVisible);
  };

  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password,
    });
    setToken(token);
  };

  return (
    <>
      <div className="back-to-home">
        <i className="fa-solid fa-arrow-left" id="back-arrow"></i>
        <Link style={{ textDecoration: "none" }} to="/home">
          <div
            className="back-to-home-text"
            style={{ textDecoration: "none", color: "black" }}
          >
            Back to Home
          </div>
        </Link>
      </div>
      <div className="container split left">
        <div className="box">
          <form onSubmit={handleSubmit} className="box-login" id="login-form">
            <div className="top-header">
              <h3>Admin Login</h3>
              <div className="divider"></div>
            </div>
            <div className="input-group">
              <div className="input-field">
                <input
                  type="text"
                  onChange={(e) => setUserName(e.target.value)}
                  className="input-box"
                  id="logEmail"
                  required
                />
                <label htmlFor="logEmail">Email address</label>
              </div>
              <div className="input-field">
                <input
                  type={passwordVisible ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-box"
                  id="logPassword"
                  required
                />
                <label htmlFor="logPassword">Password</label>
                <div className="eye-area">
                  <div className="eye-box" onClick={togglePasswordVisibility}>
                    {passwordVisible ? (
                      <i className="fa-regular fa-eye-slash" id="eye-slash"></i> //show when false
                    ) : (
                      <i className="fa-regular fa-eye" id="eye"></i> //show when true
                    )}
                  </div>
                </div>
              </div>
              <div className="input-field">
                <input
                  type="submit"
                  className="input-submit"
                  value="Sign In"
                  required
                />
              </div>
              <div className="forgot">
                <a href="#">Forgot password?</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
AdminLoginForm.propTypes = {
  setToken: PropTypes.func,
};

export function AdminLoginInfo() {
  return (
    <>
      <div className="admin-login-info split right">
        <div className="info-content">
          <img src="#" alt="" className="verify-logo" />
          <p className="info-text">
            This is the login for admins only. Please return to the home page if
            you are not a staff member.
            <br />
            <br />
            <br />
            <br />
            If you have trouble logging in, please contact
            techsupportverify@gmail.com
          </p>
        </div>
      </div>
    </>
  );
}

export function AdminLoginComponents() {
  return (
    <>
      <div className="container">
        <div className="login-wrapper">
          <div className="login-column">
            <AdminLoginForm />
          </div>
          <div className="info-column">
            <AdminLoginInfo />
          </div>
        </div>
      </div>
    </>
  );
}
