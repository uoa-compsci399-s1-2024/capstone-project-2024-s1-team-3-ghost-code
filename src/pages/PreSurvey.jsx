import "./PreSurvey.css";
import "./AdminLogin.css";
import React, { useState, useEffect, useContext, useLocation } from "react";

import { Link, useNavigate } from "react-router-dom";
function TermsandConditions() {
  return (
    <>
      <section id="terms-popup">
        <h2 className="terms-heading">Privacy Disclosure</h2>
        <div className="terms-container">
          <div className="terms">
            <p>
              By providing your email address, you expressly consent to the
              collection and use of your personal information by [Your App
              Name]. This may include disclosing your full name, organization
              details, and quiz progress to other users who hold just your email
              address within the [Your App Name] platform. We prioritize the
              protection and privacy of your data and will only disclose it for
              legitimate purposes consistent with our Privacy Policy. You have
              the right to withdraw your consent or update your preferences at
              any time. For more information, please review our Privacy Policy.
            </p>
          </div>
          <div className="btn-terms-container">
            <button className="btn-terms-accept">I agree!</button>
            <div className="btn-terms-message">
              Please read before agreeing.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
function Presurvey() {
  function myFunction() {
    var popup = document.getElementById("terms-popup");
    popup.classList.toggle("show");
  }
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [positions, setPositions] = useState([]); // Array of positions from API
  const [organisations, setOrganisations] = useState([]); // Array of organisations from API
  const [orgIDs, setOrgsID] = useState([]);
  const [roleIDs, setRolesID] = useState([]);

  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  function validateEmail(email) {
    return emailRegex.test(email);
  }

  // Fetch positions
  useEffect(() => {
    async function fetchPositions() {
      try {
        const response = await fetch(
          "http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/GetRoles"
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        const roleName = data.map((role) => role.roleName);
        const roleID = data.map((role) => role.roleID);
        setPositions(roleName || []); // Ensure your API returns an object with a 'positions' key
        setPosition("Doctor"); // Set default position

        setRolesID(roleID);
      } catch (error) {
        console.error("Failed to fetch positions:", error);
      }
    }

    fetchPositions();
  }, []);

  // Fetch organisations
  useEffect(() => {
    async function fetchOrganisations() {
      try {
        const response = await fetch(
          "http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/GetOrganizations"
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        const orgNames = data.map((org) => org.orgName); // Extract orgName from each organisation object
        const orgIDs = data.map((org) => org.orgID);
        setOrganisations(orgNames || []); // Set organisations state to an array of orgName strings
        setOrganisation("University of Auckland"); // Set default organisation (if needed)

        setOrgsID(orgIDs);
      } catch (error) {
        console.error("Failed to fetch organisations:", error);
      }
    }

    fetchOrganisations();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return; // Stop the submission
    }

    // Get the index of the selected position and organization
    const positionIndex = positions.findIndex((pos) => pos === position);
    const organisationIndex = organisations.findIndex(
      (org) => org === organisation
    );

    // Retrieve the corresponding IDs using the indexes
    const roleID = positionIndex !== -1 ? roleIDs[positionIndex] : null;
    const organisationID =
      organisationIndex !== -1 ? orgIDs[organisationIndex] : null;

    const clinicianData = {
      userEmail: email,
      firstName: firstName,
      lastName: lastName,
      roleID: roleID,
      organizationID: organisationID,
    };

    console.log(clinicianData);

    try {
      const registrationResponse = await fetch(
        "https://api.tmstrainingquizzes.com/webapi/AddClinician",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clinicianData),
        }
      );

      if (registrationResponse.ok) {
        // Attempt to log in the user after successful registration
        const loginResponse = await fetch(
          "https://api.tmstrainingquizzes.com/auth/ClinicianLogin",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email }),
          }
        );

        const text = await loginResponse.text(); // First get the response as text to check for errors

        if (loginResponse.ok && !text.includes("Login failed")) {
          localStorage.setItem("userToken", text); // Store the token
          navigate("/quizDashboard"); // Redirect to quizDashboard
        } else {
          throw new Error("Login failed after registration");
        }
      } else if (registrationResponse.status === 409) {
        alert("An account with this email already exists.");
        navigate("/cliniciansign");
      } else {
        throw new Error("Failed to register clinician");
      }
    } catch (error) {
      console.error("Error during registration or login:", error);
      alert("Error submitting the form. Please try again.");
    }
  };

  return (
    <>
      {/* <TermsandConditions /> */}
      <form onSubmit={handleSubmit}>
        <div className="split-survey left-survey">
          <div className="centered-survey">
            <p>Please fill out the pre-training survey before continuing.</p>
            <p></p>
            <p>
              By filling out this survey you will be able to come back to the
              quiz at any time to continue where you left off.
            </p>
          </div>
        </div>

        <div className="container-survey split-survey right-survey">
          <div className="box-survey">
            <div className="box-survey-details" id="register-form">
              <div className="top-header">
                <h3>Registration</h3>
                <div className="divider"></div>
              </div>
              <div className="input-group">
                <div className="input-field next-to">
                  <input
                    type="text"
                    className="input-box"
                    id="survey-lastName"
                    // placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                  <label htmlFor="logEmail">Last Name</label>
                </div>
                <div className="input-field next-to">
                  <input
                    type="text"
                    className="input-box"
                    id="survey-firstName"
                    // placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <label htmlFor="logEmail">First Name</label>
                </div>
                <div className="input-field">
                  <input
                    type="text"
                    className="input-box"
                    id="survey-email"
                    // placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="logEmail">Email Address</label>
                </div>
                <div className="input-field">
                  <select
                    className="input-box"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                  >
                    {positions.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-field">
                  <select
                    className="input-box"
                    value={organisation}
                    onChange={(e) => setOrganisation(e.target.value)}
                    required
                  >
                    {organisations.map((org) => (
                      <option key={org} value={org}>
                        {org}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-field">
                  <input
                    type="submit"
                    className="input-submit"
                    value="Submit"
                    required
                  />
                </div>
                <div className="tc ">
                  <input type="checkbox" className="cb" required />
                  By ticking the box, you agree to the&nbsp;
                  <Link onClick="popupFunction()">Privacy Disclosure</Link> of
                  the Verify Quiz Platform.
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
      </form>
    </>
  );
}

export default Presurvey;
