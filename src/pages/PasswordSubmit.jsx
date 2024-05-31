import "./AdminLogin.css";
import "./PasswordReset.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BackToHomeLink } from "./ClinicianSign";

export function PasswordSubmit() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible1, setPasswordVisible1] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

  function validatePassword(password) {
    return passwordRegex.test(password);
  }

  const navigate = useNavigate();

  const togglePasswordVisibility1 = () => {
    setPasswordVisible1((prevVisible) => !prevVisible);
  };
  const togglePasswordVisibility2 = () => {
    setPasswordVisible2((prevVisible) => !prevVisible);
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    } else {
      setErrorMessage(""); // Clear the error message if passwords match
    }

    if (!validatePassword(newPassword)) {
      alert("Please Ensure your password follows the guidlines");
      return;
    }

    const code = sessionStorage.getItem("resetCode"); // Retrieve the code from sessionStorage
    console.log(code);

    if (!code) {
      setErrorMessage("Verification code not found. Please retry the process.");
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: code, password: newPassword }), // Include the code and newPassword in the request body
    };

    try {
      const response = await fetch(
        "https://api.tmstrainingquizzes.com/auth/SubmitPasswordReset",
        requestOptions
      );

      if (response.status === 200) {
        navigate("/adminlogin"); // Navigate to the login page on success
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Password Reset Error:", error);
      setErrorMessage("An error occurred during password reset.");
    }
  };

  return (
    <>
      <BackToHomeLink />

      <form onSubmit={handlePasswordReset}>
        <div className="container-password split left">
          <div className="box-password-larger">
            <div className="box-password-details" id="clinician-login-form">
              <div className="top-header">
                <h3>Enter a new password</h3>
                <div className="divider"></div>
              </div>
              <div className="input-group">
                <div className="input-field">
                  <input
                    type={passwordVisible1 ? "text" : "password"}
                    className="input-box"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    id="newPassword"
                    required
                  />
                  <label htmlFor="newPassword">New password</label>

                  <div className="eye-area" onClick={togglePasswordVisibility1}>
                    {passwordVisible1 ? (
                      <i className="fa-regular fa-eye-slash" id="eye-slash"></i>
                    ) : (
                      <i className="fa-regular fa-eye" id="eye"></i>
                    )}
                  </div>
                </div>
                <div className="input-field">
                  <input
                    type={passwordVisible2 ? "text" : "password"}
                    className="input-box"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    id="confirmPassword"
                    required
                  />
                  <label htmlFor="confirmPassword">Re-enter new password</label>

                  <div className="eye-area" onClick={togglePasswordVisibility2}>
                    {passwordVisible2 ? (
                      <i className="fa-regular fa-eye-slash" id="eye-slash"></i>
                    ) : (
                      <i className="fa-regular fa-eye" id="eye"></i>
                    )}
                  </div>
                </div>
                {errorMessage && (
                  <div className="error-message" style={{ color: "red" }}>
                    {errorMessage}
                  </div>
                )}
                <div className="input-field">
                  <input
                    type="submit"
                    className="input-submit"
                    value="Submit"
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
<<<<<<< HEAD
            Make sure your password is strong and matches each other! You will be redirected to the login page on success.
            <br />
            <br />
                Please Ensure the following is inclded in your password: <br />
                Has minimum 8 characters in length. <br />
                At least one uppercase English letter. <br />
                At least one lowercase English letter. <br />
                At least one digit. <br />
=======
            Make sure your password is strong and matches each other! You will
            be redirected to the login page on success. <br />
            <br />
            Please Ensure the following is inclded in your password: <br />
            Has minimum 8 characters in length. <br />
            At least one uppercase English letter. <br />
            At least one lowercase English letter. <br />
            At least one digit. <br />
>>>>>>> main
            <br />
            If you have trouble logging in, please contact
            <a
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

export default PasswordSubmit;
