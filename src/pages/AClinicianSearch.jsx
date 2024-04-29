import React, { useState, useEffect } from "react";
import "./AClinicianSearch.css";
import { Link } from "react-router-dom";
import AdminDashboard from "../components/Dashboards/ADashboard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function AClinicianSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [adminName, setAdminName] = useState("");

// Function to fetch search results from backend API
useEffect(() => {
  if (searchQuery.trim() !== "") {
    // Make HTTP request to backend API with search query
    fetch(`http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/ClinicianSearch/${searchQuery}`, {
      headers: {
        "Authorization": "Basic " + btoa("sahil:sahil24") // Encoding username and password
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
}, [searchQuery]);

  // Function to fetch admin information from backend API
  useEffect(() => {
    fetch('/api/admin/details')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setAdminName(data.name);
      })
      .catch(error => {
        console.error("Error fetching admin information:", error);
      });
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="flex">
      <div className="dashboard-container">
        <AdminDashboard />
      </div>
      <div className="AdminClientSearchContainer">
        <div className="admin-info">
          <span className="admin-name">{adminName}</span>
          <div className="admin-icon"></div>
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
