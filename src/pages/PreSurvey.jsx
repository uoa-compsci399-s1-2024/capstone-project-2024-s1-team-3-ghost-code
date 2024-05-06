import "./PreSurvey.css";
import React, {
  useState,
  useEffect,
  useContext,
  useLocation, 
} from "react";

import { Link, useNavigate} from "react-router-dom";

function Presurvey() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [positions, setPositions] = useState([]); // Array of positions from API
  const [organisations, setOrganisations] = useState([]); // Array of organisations from API

  const navigate = useNavigate();

  // Fetch positions
  useEffect(() => {
    async function fetchPositions() {
      try {
        const response = await fetch('http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/GetRoles');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setPositions(data.roleName || []); // Ensure your API returns an object with a 'positions' key
        //setPosition(data.roleName["Doctor"]); // Set default position
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
        const response = await fetch('http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/GetOrganizations');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setOrganisations(data.orgName || [] ); // Ensure your API returns an object with an 'organisations' key
        //setOrganisation(data.orgName["University of Auckland"]); // Set default organisation
      } catch (error) {
        console.error("Failed to fetch organisations:", error);
      }
    }

    fetchOrganisations();
  }, []);






  const handleSubmit = async (event) => {
    event.preventDefault();

    const clinicianData = {
      userEmail: email,
      firstName: firstName,
      lastName: lastName,
      position: position,
      organisation: organisation
    };

    try {
      const response = await fetch('http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/AddClinician', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clinicianData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Clinician added:', data);
        // Redirect or show success message
        navigate('quizDashboard');  // or wherever you want to redirect
      } else {
        throw new Error('Failed to register clinician');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting the form. Please try again.');
    }
  };




  return (
    <form onSubmit={handleSubmit}>
      <div className="split-survey left-survey">
        <div className="centered-survey">
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
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
        
              </div>
              <div className="input-field next-to">
                <input
                  type="text"
                  className="input-box"
                  id="survey-firstName"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
               
              </div>
              <div className="input-field">
                <input
                  type="text"
                  className="input-box"
                  id="survey-email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                
              </div>
              <div className="input-field">
              <select
                  className="input-box"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                >
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
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
                  {organisations.map(org => (
                    <option key={org} value={org}>{org}</option>
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
                <input type="checkbox" className="cb" />
                By ticking the box, you agree to the
                <Link to="/home">Terms and Conditions</Link> of the Verify Quiz
                Platform.
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
  );
}

export default Presurvey;
