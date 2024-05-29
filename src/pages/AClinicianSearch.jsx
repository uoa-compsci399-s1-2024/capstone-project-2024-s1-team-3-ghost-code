import React, { useState, useEffect, useRef } from "react";
import "./AClinicianSearch.css";
import { Link, useNavigate } from "react-router-dom";
import AdminDashboard from "../components/Dashboards/ADashboard";
import AdminInfo from "../components/AdminComponent/adminInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function AClinicianSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [adminName, setAdminName] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null); // Reference to the admin info box

  const adminToken = sessionStorage.getItem("adminToken");
  const navigate = useNavigate();

  const handleErrorResponse = (status) => {
    if (status === 401) {
      if (sessionStorage.getItem("adminToken")) {
        sessionStorage.removeItem("adminToken");
        console.log("Token found and removed due to 401 Unauthorized status.");
      } else {
        console.log("No token found when handling 401 status.");
      }
      navigate("/adminlogin");
    } else if (status === 403) {
      navigate("/quizDashboard");
    }
  };

  // Function to fetch search results from backend API
  useEffect(() => {
    const url = searchQuery.trim()
    ? `https://api.tmstrainingquizzes.com/webapi/ClinicianSearch?term=${searchQuery}`
    : 'https://api.tmstrainingquizzes.com/webapi/ClinicianSearch'; // Endpoint to fetch all clinicians if no query
  
  fetch(url, {
    headers: {
      "Authorization": `Bearer ${adminToken}`
    }
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 401) {
        sessionStorage.removeItem('adminToken');
        navigate('/adminlogin');
      }
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    setSearchResults(data);
  })
  .catch(error => {
    console.error("Error fetching search results:", error);
  });
  }, [searchQuery, adminToken, navigate]);
   
  

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="flex">
      <div className="dashboard-container">
        <AdminDashboard />
      </div>
      <div className="AdminClientSearchContainer">
        <AdminInfo />

        <div className="AdminClientSearchInput">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Search..."
          />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>
        <div className="AdminClientSearchResults">
          {searchResults.map((result) => (
            <Link
              style={{ textDecoration: "none", color: "black" }}
              key={result.userID}
              to={`/clinician/${result.userEmail}`}
              className="link"
            >
              <div className="adminClientSearchResultItem">
                <div className="AdminClientSearchResultName">
                  {result.firstName} {result.lastName}
                </div>
                <div className="AdminClientSearchResultEmail">
                  {result.userEmail}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AClinicianSearch;
