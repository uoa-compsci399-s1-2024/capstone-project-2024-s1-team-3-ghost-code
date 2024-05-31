import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminDashboard from "../components/Dashboards/ADashboard";
import AdminInfo from "../components/AdminComponent/adminInfo";
import { Link, useNavigate } from "react-router-dom";
import "./AClinicianProfile.css";

function AClinicianProfile() {
  const { clinicianId } = useParams();
  const [clinicianDetails, setClinicianDetails] = useState(null);
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [position, setPosition] = useState("");

  const [status, setStatus] = useState();
  const [initialStatus, setInitialStatus] = useState();

  const [organizations, setOrganizations] = useState([]);
  const [positions, setPositions] = useState([]);

  const [modules, setModules] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [quizType, setQuizType] = useState("");
  const [completionStatus, setCompletionStatus] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [filteredAttempts, setFilteredAttempts] = useState([]);

  const [certifications, setCertifications] = useState([]);
  const [showStats, setShowStats] = useState(true);

  const [surveyComplete, setSurveyComplete] = useState(false);

  const adminToken = sessionStorage.getItem("adminToken");
  const navigate = useNavigate();

  const handleErrorResponse = (status) => {
    if (status === 401) {
      if (sessionStorage.getItem("cliniciantoken")) {
        sessionStorage.removeItem("cliniciantoken");
        console.log("Token found and removed due to 401 Unauthorized status.");
      } else {
        console.log("No token found when handling 401 status.");
      }
      navigate("/cliniciansign");
    } else if (status === 403) {
      navigate("/quizDashboard");
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      };
      try {
        const response = await fetch(
          `https://api.tmstrainingquizzes.com/webapi/ClinicianSearch?term=${clinicianId}`,
          requestOptions
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setClinicianDetails(data[0]);
          setEmail(data[0].userEmail || "");
          setOrganization(data[0].organization.orgName);
          setPosition(data[0].role.roleName);
          setSurveyComplete(data[0].surveyComplete);
          console.log(surveyComplete);
        } else if (response.status === 401) { 
          sessionStorage.removeItem("adminToken");
          navigate("/adminlogin");
        }
      } catch (error) {
        if (error.status) {
          handleErrorResponse(error.status);
        }
        console.error("Failed to fetch clinician details:", error);
      }

      // Fetch organizations
      const orgsResponse = await fetch(
        "https://api.tmstrainingquizzes.com/webapi/GetOrganizations"
      );
      const orgsData = await orgsResponse.json();
      setOrganizations(
        orgsData.map((org) => ({ name: org.orgName, id: org.orgID }))
      );

      // Fetch roles
      const rolesResponse = await fetch(
        "https://api.tmstrainingquizzes.com/webapi/GetRoles"
      );
      const rolesData = await rolesResponse.json();
      setPositions(
        rolesData.map((role) => ({ name: role.roleName, id: role.roleID }))
      );

      // Fetch modules
      const modulesResponse = await fetch(
        "https://api.tmstrainingquizzes.com/webapi/GetModules",
        requestOptions
      );
      const modulesData = await modulesResponse.json();
      setModules(
        modulesData.map((module) => ({
          id: module.moduleID,
          name: module.name,
          description: module.description,
          sequence: module.sequence,
        }))
      );
    };

    fetchDetails();
  }, [clinicianId, adminToken, navigate]);

  useEffect(() => {
    if (clinicianDetails) {
      const fetchCertificationStatus = async () => {
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        };

        try {
          const certResponse = await fetch(
            `https://api.tmstrainingquizzes.com/webapi/GetClinicianCertificationStatus/${clinicianDetails.userID}`,
            requestOptions
          );
          if (certResponse.ok) {
            const certData = await certResponse.json();
            console.log(certData);

            // Check if certification has expired
            const expiryDateTime = new Date(
              certData[certData.length - 1].expiryDateTime
            );

            const currentDateTime = new Date();

            if (currentDateTime > expiryDateTime) {
              // If certification has expired, set status to Not Certified
              setStatus("Not Certified");
              setInitialStatus("Not Certified");
            } else {
              setStatus("Certified");
              setInitialStatus("Certified");
            }
          } else if (certResponse.status === 404) {
            setStatus("Not Certified");
            setInitialStatus("Not Certified");
          }
        } catch (error) {
          console.error("Failed to fetch certification status:", error);
        }
      };
      fetchCertificationStatus();
    }
  }, [clinicianDetails, adminToken]);

  async function setClinicianCertificationStatus() {
    const url =
      "https://api.tmstrainingquizzes.com/webapi/SetClinicianCertificationStatus";
    const data = {
      UserID: clinicianDetails.userID,
      Type: "InitCertification",
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok)
        throw new Error("Failed to update certification status");

      const result = await response.json();

      setStatus("Certified");
      setInitialStatus("Certified");
    } catch (error) {
      console.error("Error updating certification status:", error);
    }
  }

  const handleSaveChanges = async () => {
    // Find the selected role and organization IDs
    const selectedRole = positions.find((role) => role.name === position);
    const selectedOrg = organizations.find((org) => org.name === organization);

    const requestBody = {
      userID: clinicianDetails.userID,
      userEmail: email,
      firstName: clinicianDetails.firstName,
      lastName: clinicianDetails.lastName,
      roleID: selectedRole.id,
      organizationID: selectedOrg.id,
    };

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`, // Include token in headers
      },
      body: JSON.stringify(requestBody),
    };

    try {
      const response = await fetch(
        "https://api.tmstrainingquizzes.com/webapi/EditClinician",
        requestOptions
      );
      if (response.ok) {
        alert("Clinician updated successfully!");
      } else if (response.status === 409) {
        throw new Error("A user with this email already exists.");
      } else {
        throw new Error("Failed to update clinician");
      }
    } catch (error) {
      console.error("Error updating clinician:", error);
      alert(error.message);
    }

    if (initialStatus === "Not Certified" && status === "Certified") {
      await setClinicianCertificationStatus();
    }
  };

  const handleGetStats = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }


    const formattedStartDate = new Date(startDate);
    const formattedEndDate = new Date(endDate);

    formattedStartDate.setHours(0);
    formattedStartDate.setMinutes(0);
    formattedStartDate.setSeconds(0);

    formattedEndDate.setHours(23);
    formattedEndDate.setMinutes(59);
    formattedEndDate.setSeconds(59);

    const UTCStartDate = formattedStartDate.toISOString();
    const UTCEndDate = formattedEndDate.toISOString();



    const url = "https://api.tmstrainingquizzes.com/webapi/GetStats";
    const params = {
      searchStart: UTCStartDate,
      searchEnd: UTCEndDate,
      quizID: null, // Assuming that this logic will be handled elsewhere or isn't needed as per your current setup
      userID: clinicianDetails.userID,
      complete: null,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(params),
    };

    try {
      const response = await fetch(url, requestOptions);
      if (response.ok) {
        const statsData = await response.json();
        setAttempts(statsData); // This now only sets the fetched attempts
      } else if (response.status === 400) {
        alert(
          "Start or end date is not valid. Please double-check your dates."
        );
        throw new Error(
          "Start or end date is not valid. Please double-check your dates."
        );
      } else {
        throw new Error("Failed to fetch stats");
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    const filtered = attempts.filter((attempt) => {
      return (
        (!selectedModule ||
          attempt.quiz.module.moduleID === parseInt(selectedModule)) &&
        (!quizType ||
          attempt.quiz.stage.toLowerCase() === quizType.toLowerCase()) &&
        (!completionStatus || attempt.completed === completionStatus)
      );
    });
    setFilteredAttempts(filtered); // Update the state with filtered results
  }, [attempts, selectedModule, quizType, completionStatus]);

  useEffect(() => {
    const fetchCertifications = async () => {
      if (clinicianDetails) {
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        };
        try {
          const response = await fetch(
            `https://api.tmstrainingquizzes.com/webapi/GetClinicianAllCertifications/${clinicianDetails.userID}`,
            requestOptions
          );
          if (response.ok) {
            const certsData = await response.json();
            console.log(certsData);
            setCertifications(certsData);
          } else {
            console.error(
              "Failed to fetch certifications:",
              response.statusText
            );
          }
        } catch (error) {
          console.error("Failed to fetch certifications:", error);
        }
      }
    };
    fetchCertifications();
  }, [clinicianDetails, adminToken]);

  const handleOverrideClick = async () => {
    const userConfirmed = window.confirm("Are you sure you want to bypass the pre-survey?");

    if (userConfirmed) {
      // Call the ClincianSurveyCompletion API
      const url = "https://api.tmstrainingquizzes.com/webapi/ClinicianSurveyCompletion";
      const requestBody = {
        email: clinicianId,
      };
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      };

      try {
        const response = await fetch(url, requestOptions);
        if (response.ok) {
          // Update the surveyComplete status to true
          setSurveyComplete(true);
          alert("Survey completion status overridden successfully!");
        } else {
          throw new Error("Failed to override survey completion status");
        }
      } catch (error) {
        console.error("Error overriding survey completion status:", error);
        alert(error.message);
      }
    }
  };



  return (
    <div className="flex">
      <div className="dashboard-container">
        <AdminDashboard />
      </div>
      <div className="AdminClientSearchContainer">
        <AdminInfo />
        <div className="clinician-profile-container">
          {clinicianDetails && (
            <div className="clinician-details">
              <h2>
                {clinicianDetails.firstName} {clinicianDetails.lastName}
              </h2>
              <div className="personal-details-container">
                <div className="personal-details-box">
                  <h3>Personal Details</h3>
                  <div className="each-detail">
                    <label className="details-title">Email:</label>
                    <input
                      className="input-box-profile"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="each-detail">
                    <label className="details-title">Organization:</label>
                    <select
                      className="input-box-profile"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                    >
                      {organizations.map((org) => (
                        <option key={org.id} value={org.name}>
                          {org.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="each-detail">
                    <label className="details-title">Position:</label>
                    <select
                      className="input-box-profile"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                    >
                      {positions.map((pos) => (
                        <option key={pos.id} value={pos.name}>
                          {pos.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="each-detail">
                    {" "}
                    <label className="details-title">
                      TMS Training Status:
                    </label>
                    <button
                      className={`status-button ${status === "Certified" ? "certified" : "not-certified"}`}
                      onClick={async () => {
                        if (status === "Not Certified") {
                          const confirmCertification = window.confirm(
                            "Are you sure you wish to certify this clinician? This should only be completed following practical TMS training. The clinician will be sent a certificate valid for 1 year."
                          );
                          if (confirmCertification) {
                            await setClinicianCertificationStatus();
                          }
                        }
                      }}
                      disabled={status === "Certified"}
                    >
                      {status === "Certified" ? "Certified" : "Not Certified"}
                   </button>
                  </div>
                  
                  {!surveyComplete && (
                    <div className="each-detail">
                      <label className="details-title"  style={{ color: "red" }}>
                      Pre-training survey not completed.
                      </label>
                      <button onClick={handleOverrideClick}>Override</button>
                    </div>
                  )}


                  

                  <button onClick={handleSaveChanges}>Save Changes</button>
                </div>
              </div>
              <div className="togglebuttons-container">
                <button
                  className={`togglebuttons ${showStats ? "active" : ""}`}
                  onClick={() => setShowStats(true)}
                >
                  Show Stats
                </button>
                <button
                  className={`togglebuttons ${!showStats ? "active" : ""}`}
                  onClick={() => setShowStats(false)}
                >
                  Show Certifications
                </button>
              </div>

              {showStats ? (
                <div className="stats-container">
                  <h3>User Results</h3>
                  <div className="date-filter-container">
                    <div className="date-filter">
                      <label>Start Date:</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="date-filter">
                      {" "}
                      <label>End Date:</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    <button className="get-stats-btn" onClick={handleGetStats}>
                      Get Stats
                    </button>
                  </div>
                  <br></br>
                  <div className="filters-container">
                    <div className="stats-filter">
                      <label>Module:</label>
                      <select
                        value={selectedModule}
                        onChange={(e) => setSelectedModule(e.target.value)}
                      >
                        <option value="">All Modules</option>
                        {modules.map((module) => (
                          <option key={module.id} value={module.id}>
                            {module.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="stats-filter">
                      <label>Quiz Type:</label>
                      <select
                        value={quizType}
                        onChange={(e) => setQuizType(e.target.value)}
                      >
                        <option value="">All Types</option>
                        <option value="final">Final</option>
                        <option value="practice">Practice</option>
                      </select>
                    </div>
                    <div className="stats-filter">
                      <label>Completion Status:</label>
                      <select
                        value={completionStatus}
                        onChange={(e) => setCompletionStatus(e.target.value)}
                      >
                        <option value="">All Statuses</option>
                        <option value="PASS">PASS</option>
                        <option value="FAIL">FAIL</option>
                      </select>
                    </div>
                  </div>
                  <br></br>

                  <br></br>
                  <br></br>

                  {filteredAttempts.map((attempt) => (
                    <div
                      key={attempt.attemptID}
                      className={`stats-result ${
                        attempt.completed === "PASS" ? "pass" : "fail"
                      }`}
                    >
                      <h4>
                        {attempt.quiz.module.name} {attempt.quiz.stage} -{" "}
                        {attempt.completed}
                      </h4>
                      <p>Date: {new Date(attempt.dateTime).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="certifications-container">
                  <h3>Certifications</h3>
                  <p className="click-on-cert-text">
                    click on a certificate to view
                  </p>
                  {certifications.length > 0 ? (
                    <ul>
                      {certifications.map((cert, index) => (
                        <li key={index}>
                          <a
                            href={cert.certificateURL}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                           <p>
                            Certification Name: {cert.type === "InitCertification" ? "Complete TMS Training Certification" : cert.type}
                          </p>

                            <p>
                              Date Issued:{" "}
                              {new Date(cert.dateTime).toLocaleDateString()}
                            </p>
                            {!cert.type.toLowerCase().includes("module") && ( 
                            <p>

                              Expiry Date:{" "}
                              {new Date(
                                cert.expiryDateTime
                              ).toLocaleDateString()}
                            </p>
                            )}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No certifications found for this clinician.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AClinicianProfile;
