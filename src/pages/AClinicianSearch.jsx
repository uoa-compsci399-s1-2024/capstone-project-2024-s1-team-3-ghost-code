import React, { useState, useEffect, useRef } from "react";
import "./AClinicianSearch.css";
import { Link, useNavigate } from "react-router-dom";
import AdminDashboard from "../components/Dashboards/ADashboard";
import AdminInfo from "../components/AdminComponent/adminInfo";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function AClinicianSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [adminName, setAdminName] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null); // Reference to the admin info box

  const adminToken = sessionStorage.getItem('adminToken');
  const navigate = useNavigate();

// Function to fetch search results from backend API
useEffect(() => {
  if (searchQuery.trim() !== "") {
    // Make HTTP request to backend API with search query
    fetch(`http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/ClinicianSearch/${searchQuery}`, {
      headers: {
        "Authorization": `Bearer ${adminToken}` // Include token in headers
      }
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid or expired, log the admin out
          sessionStorage.removeItem('adminToken');
          navigate('/adminlogin'); // Redirect to admin login page
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
  } else {
    setSearchResults([]);
  }
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
          {searchResults.map(result => (
            <Link key={result.userID} to={`/clinician/${result.userEmail}`} className="link">
              <div className="adminClientSearchResultItem">
                <div className="AdminClientSearchResultName">{result.firstName}</div>
                <div className="AdminClientSearchResultEmail">{result.userEmail}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AClinicianSearch;