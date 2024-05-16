import "./AdminLogin.css";
import "./ClinicianSign.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function BackToHomeLink() {
  return (
    <>
      <div className="back-to-home">
        <i className="fa-solid fa-arrow-left" id="back-arrow"></i>
        <Link style={{ textDecoration: "none" }} to="/home">
          <div className="back-to-home-text">Back to Home</div>
        </Link>
      </div>
    </>
  );
}

export function ClinicianLoginForm() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    };
    try {
      const response = await fetch(
        "https://api.tmstrainingquizzes.com/auth/ClinicianLogin",
        requestOptions
      );
      const text = await response.text(); // Get response as text

      // Example handling of the response text
      if (!text.includes("Email does not exist")) {
        sessionStorage.setItem("cliniciantoken", text); // Store token (or whatever the response indicates)
        //console.log(cliniciantoken)
        navigate("/quizDashboard"); // Redirect using navigate instead of updating state
      } else {
        alert("Login failed!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("An error occurred during login.");
    }
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <div className="container-clincian split left">
          <div className="box-clinician">
            <div className="box-clincian-details" id="clinician-login-form">
              <div className="top-header">
                <h3>Welcome Back!</h3>
                <div className="divider"></div>
              </div>
              <div className="input-group">
                <div className="input-field">
                  <input
                    type="text"
                    className="input-box"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    id="logEmail"
                    required
                  />
                  <label htmlFor="logEmail">Email Address</label>
                </div>
                <div className="input-field">
                  <input
                    type="submit"
                    className="input-submit"
                    value="Continue"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function ClinicianLoginInfo() {
  return (
    <>
      <div className="admin-login-info split right">
        <div className="info-content">
          <img
            loading="lazy"
            // src="src/components/VERIFYLogo.jpg"
            // alt="DashboardLogo"
            className="verify-logo"
          />
          <p className="info-text">
            Welcome Back! Please provide your email before continueing.
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

export function ClinicianSignComponents() {
  return (
    <>
      <div className="container">
        <div className="login-wrapper">
          <div className="login-column">
            <BackToHomeLink />
            <ClinicianLoginForm />
          </div>
          <div className="info-column">
            <ClinicianLoginInfo />
          </div>
        </div>
      </div>
    </>
  );
}
