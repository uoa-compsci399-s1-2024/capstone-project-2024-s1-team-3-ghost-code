import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import ClientDashboard from "../components/Dashboards/CDashboard";
import "./ClinicianMyProfile.css";
import ClientInfo from "../components/ClientComponent/clientInfo";

function AClinicianMyProfile() {
  const navigate = useNavigate();
  const userToken = sessionStorage.getItem("cliniciantoken");

  //FOR GETTING ADMINS NAME
  const [userID, setUserID] = useState(0);
  const [userdetails, setUserdetails] = useState("");
  const [userfirstName, setUserFirstName] = useState("");
  const [userlastName, setUserLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userSite, setUserSite] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null); // Reference to the admin info box

  const handleErrorResponse = (status) => {
    if (status === 401) {
      if (sessionStorage.getItem('cliniciantoken')) {
        sessionStorage.removeItem('cliniciantoken');
        console.log('Token found and removed due to 401 Unauthorized status.');
      } else {
        console.log('No token found when handling 401 status.');
      }
      navigate('/cliniciansign');
    } else if (status === 403) {
      navigate('/quizDashboard');
    }
  };

  // Function to fetch admin information from backend API
  useEffect(() => {
    fetch("https://api.tmstrainingquizzes.com/auth/GetCurrentClinician", {
      headers: {
        Authorization: `Bearer ${userToken}`, // Include token in headers
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setUserID(data.userID);
        setUserFirstName(data.firstName);
        setUserLastName(data.lastName);
        setUserEmail(data.userEmail);
        // Accessing role and organization properties
        setUserRole(data.role.roleName); // Correctly accessing roleName
        setUserSite(data.organization.orgName); // Assuming orgName is the correct property
      })
      .catch((error) => {
        if (error.status){
          handleErrorResponse(error.status);
        }
        console.error("Error fetching user information:", error);
      });
  }, [userToken, navigate]);

  return (
    <div className="flex-profile">
      <div className="my-profile-container">
        <div className="dashboard-container">
          <ClientDashboard />
        </div>
        <div className="client-profile-contianer">
        <ClientInfo />
          <div className="client-profile">
            <div className="client-details">
              <div className="client-label">First Name:</div>
              <div className="clientFN">{userfirstName}</div>
            </div>
            <div className="client-details">
              <div className="client-label">Last Name:</div>
              <div className="clientLN">{userlastName}</div>
            </div>{" "}
            <div className="client-details">
              <div className="client-label">Email:</div>
              <div className="clientEM">{userEmail}</div>
            </div>{" "}
            <div className="client-details"></div>{" "}
            <div className="client-details">
              <div className="client-label">Site:</div>
              <div className="clientsite">{userSite}</div>
            </div>
            <div className="client-details">
              <div className="client-label">Discipline:</div>
              <div className="clientrole">{userRole}</div>
            </div>
            <p>
              Please contact <b>verify.study.tms@gmail.com</b> if you would like
              to make changes to your profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AClinicianMyProfile;
