import React, { useState, useEffect, useRef } from "react";
import "./AClinicianSearch.css";
import { Link } from "react-router-dom";
import AdminDashboard from "../components/Dashboards/ADashboard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function AClinicianSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [adminName, setAdminName] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null); // Reference to the admin info box

  const adminToken = sessionStorage.getItem('adminToken');

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
}, [searchQuery, adminToken]);

  // Function to fetch admin information from backend API
  useEffect(() => {
    fetch('http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/auth/GetCurrentAdmin', {
      headers: {
        "Authorization": `Bearer ${adminToken}` // Include token in headers

      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setAdminName(data.firstName + " " + data.lastName);
    
      })
      .catch(error => {
        console.error("Error fetching admin information:", error);
      });
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };


  //function to check if someone clicked outside the admin info box
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    }

    // Adding click event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleSignOut = () => {
    sessionStorage.removeItem('adminToken');
  }



  return (
    <div className="flex">
      <div className="dashboard-container">
        <AdminDashboard />
      </div>
      <div className="AdminClientSearchContainer">
        <div className="admin-info" ref={dropdownRef} onClick={toggleDropdown}>
          <span className="admin-name">{adminName}</span>
          {isDropdownVisible && (
            <div className="admin-dropdown">
              <Link to="/adminlogin" className="Admindropdown-item" onClick={handleSignOut}>
                Sign Out
              </Link>
            </div>
          )}
        </div>
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