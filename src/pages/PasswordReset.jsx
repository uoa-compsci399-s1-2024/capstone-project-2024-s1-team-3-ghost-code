import "./AdminLogin.css";
import "./PasswordReset.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function PasswordResetForm() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handlePasswordReset = async (event) => {
    event.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    };

    try {
      await fetch("https://api.tmstrainingquizzes.com/auth/ResetPassword", requestOptions);
    } catch (error) {
      console.error("Password Reset Error:", error);
    } finally {
      navigate("/passwordcode", { state: { email } });
    }
  };

  return (
    <>
      <div className="back-to-home">
        <i className="fa-solid fa-arrow-left" id="back-arrow"></i>
        <Link style={{ textDecoration: "none" }} to="/home">
          <div className="back-to-home-text">Back to Home</div>
        </Link>
      </div>

      <form onSubmit={handlePasswordReset}>
        <div className="container-password split left">
          <div className="box-password">
            <div className="box-password-details" id="password-reset-form">
              <div className="top-header">
                <h3>Password Reset</h3>
                <div className="divider"></div>
              </div>
              <div className="input-group">
                <div className="input-field">
                  <input
                    type="email"
                    className="input-box"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    required
                  />
                  <label htmlFor="email">Email Address</label>
                </div>
                <div className="input-field">
                  <input
                    type="submit"
                    className="input-submit"
                    value="Send Code"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div className="admin-login-info split right">
        <div className="info-content">
          <p className="info-text">
            Forgot password? If the email address you enter is valid, a 6 digit code will be sent.
            <br />
            <br />
            <br />
            <br />
            If you have trouble logging in, please contact <a
                style={{ textDecoration: "none", color: "white" }}
                href="mailto:verify.study.tms@gmail.com"
              >
                <b>verify.study.tms@gmail.com</b>
              </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default PasswordResetForm;