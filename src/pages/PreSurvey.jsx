import "./PreSurvey.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Presurvey() {
  // Function implementatio
  return (
    <>
      <div class="split-survey left-survey">
        <div class="centered-survey">
          <p>Please fill out the pre-training survey before continuing.</p>
          <p>If you've already filled in the pre-training quiz click here.</p>
          <p>
            By filling out this survey you will be able to come back to the quiz
            at any time to continue where you left off.
          </p>
        </div>
      </div>

      <div className="container-survey split-survey right-survey">
        <div className="box-survey">
          <div className="box-survey-details" id="login">
            <div className="top-header">
              <h3>Pre-Training Survey</h3>
              <div className="divider"></div>
            </div>
            <div className="input-group">
              <div className="input-field next-to">
                <input
                  type="text"
                  className="input-box"
                  id="lastName"
                  required
                />
                <label htmlFor="lastName">Last Name</label>
              </div>
              <div className="input-field next-to">
                <input
                  type="text"
                  className="input-box"
                  id="firstName"
                  required
                />
                <label htmlFor="firstName">First Name</label>
              </div>
              <div className="input-field">
                <input
                  type="text"
                  className="input-box"
                  id="logEmail"
                  required
                />
                <label htmlFor="logEmail">Email address</label>
              </div>
              <div className="input-field">
                <input type="text" list="position" className="input-box" />
                <datalist id="position">
                  <option value="volvo">Nurse</option>
                  <option value="saab">Doctor</option>
                  <option value="opel">Student</option>
                  <option value="audi">Supervisor</option>
                </datalist>

                <label htmlFor="position">Position</label>
              </div>

              <div className="input-field">
                <select name="Organisation" id="position" className="input-box">
                  <option value="volvo">Auckland City Hospital</option>
                  <option value="saab">University of Auckland</option>
                  <option value="opel">Medicare</option>
                  <option value="audi">Other</option>
                </select>
                <label htmlFor="position">Organisation</label>
              </div>
              <div className="input-field">
                <input
                  type="submit"
                  className="input-submit"
                  value="Submit"
                  required
                />
              </div>
              <div className="forgot">
                <Link to="/cliniciansign">
                  Already did the survey? continue here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Presurvey;
