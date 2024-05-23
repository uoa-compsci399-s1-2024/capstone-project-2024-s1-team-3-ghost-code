import "./AdminLogin.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function BackToHomeLink() {
  return (
    <>
      <div className="back-to-home">
        <i className="fa-solid fa-arrow-left" id="back-arrow"></i>
        <Link style={{ textDecoration: "none", color: "black" }} to="/home">
          <div className="back-to-home-text">Back to Home</div>
        </Link>
      </div>
    </>
  );
}

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate(); // Use the useNavigate hook for redirection

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevVisible) => !prevVisible);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    };

    try {
      const response = await fetch(
        "https://api.tmstrainingquizzes.com/auth/Login",
        requestOptions
      );
      const text = await response.text(); // Get response as text

      // Example handling of the response text
      if (!text.includes("Email or Password invalid.")) {
        sessionStorage.setItem("adminToken", text); // Store token (or whatever the response indicates)
        navigate("/adminsearch"); // Redirect using navigate instead of updating state
      } else {
        alert("Login failed!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("An error occurred during login.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="container split left">
        <div className="box">
          <div className="box-login" id="login">
            <div className="top-header">
              <h3>Admin Login</h3>
              <div className="divider"></div>
            </div>
            <div className="input-group">
              <div className="input-field">
                <input
                  type="text"
                  className="input-box"
                  id="logEmail"
                  // placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="logEmail">Email Address</label>
              </div>
              <div className="input-field">
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="input-box"
                  id="logPassword"
                  // placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="logEmail">Password</label>
                <div className="eye-area" onClick={togglePasswordVisibility}>
                  {passwordVisible ? (
                    <i className="fa-regular fa-eye-slash" id="eye-slash"></i>
                  ) : (
                    <i className="fa-regular fa-eye" id="eye"></i>
                  )}
                </div>
              </div>
              <div className="input-field">
                <input type="submit" className="input-submit" value="Sign In" />
              </div>
              <div className="forgot">
                <a href="/passwordreset">Forgot password?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

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
            <BackToHomeLink />
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
