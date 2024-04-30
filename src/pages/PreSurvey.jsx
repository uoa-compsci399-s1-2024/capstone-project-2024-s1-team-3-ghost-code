import "./PreSurvey.css";
import React, {
  useState,
  useEffect,
  useContext,
  useLocation,
  useNavigate,
} from "react";
import { Link } from "react-router-dom";

function Presurvey() {
  // const [loggedIn, setLoggedIn] = useContext(LoginContext);
  // const [firstname, setfirstname] = useState();
  // const [lastname, setlastname] = useState();
  // const [email, setemail] = useState();
  // const [position, setposition] = useState();
  // const [organisation, setorgnisation] = useState();

  // const location = useLocation();
  // const navigate = useNavigate();

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
          <div className="box-survey-details" id="register-form">
            <div className="top-header">
              <h3>Pre-Training Survey</h3>
              <div className="divider"></div>
            </div>
            <div className="input-group">
              <div className="input-field next-to">
                <input
                  type="text"
                  className="input-box"
                  id="survey-lastName"
                  required
                />
                <label htmlFor="lastName">Last Name</label>
              </div>
              <div className="input-field next-to">
                <input
                  type="text"
                  className="input-box"
                  id="survey-firstName"
                  required
                />
                <label htmlFor="firstName">First Name</label>
              </div>
              <div className="input-field">
                <input
                  type="text"
                  className="input-box"
                  id="survey-email"
                  required
                />
                <label htmlFor="logEmail">Email address</label>
              </div>
              <div className="input-field">
                <input type="text" list="position" className="input-box" />
                <datalist id="position">
                  <option>Nurse</option>
                  <option>Doctor</option>
                  <option>Student</option>
                  <option>Supervisor</option>
                </datalist>

                <label htmlFor="position">Position</label>
              </div>

              <div className="input-field">
                <select name="Organisation" id="position" className="input-box">
                  <option>Auckland City Hospital</option>
                  <option>University of Auckland</option>
                  <option>Medicare</option>
                  <option>Other</option>
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
