import "./AdminLogin.css";
import React, { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import bcrypt from 'bcryptjs';

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

export function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate(); // Use the useNavigate hook for redirection
  const saltRounds = 10;


  const togglePasswordVisibility = () => {
    setPasswordVisible(prevVisible => !prevVisible);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    //Bcrypting the password
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        alert('Failed to hash the password.');
        return;
      }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: hash })
    };

    try {
      const response = await fetch('http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/auth/Login', requestOptions);
      const text = await response.text();  // Get response as text
    
      
      // Example handling of the response text
      if (!text.includes('Email or Password invalid.')) {
        sessionStorage.setItem('adminToken', text); // Store token (or whatever the response indicates)
        navigate('/adminsearch'); // Redirect using navigate instead of updating state
      } else {
        alert('Login failed!');
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('An error occurred during login.');
    }
  });
    
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
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-field">
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="input-box"
                  id="logPassword"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="eye-area" onClick={togglePasswordVisibility}>
                  {passwordVisible ? (
                    <i className="fa-regular fa-eye-slash" id="eye-slash"></i>
                  ) : (
                    <i className="fa-regular fa-eye" id="eye"></i>
                  )}
                </div>
              </div>
              <div className="input-field">
                <input
                  type="submit"
                  className="input-submit"
                  value="Sign In"
                />
              </div>
              <div className="forgot">
                <a href="#">Forgot password?</a>
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
