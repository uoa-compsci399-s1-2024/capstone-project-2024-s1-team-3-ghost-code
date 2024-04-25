import React, { useState, useEffect } from "react";
import axios from 'redaxios';
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
      axios.get(`/api/search?query=${searchQuery}`)
        .then(response => {
          setSearchResults(response.data);
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
    axios.get('/api/admin/details') /* May have to replace this to suit Back-end */
      .then(response => {
        setAdminName(response.data.name);
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
      <div className="search-container">
        <div className="admin-info">
          <span className="admin-name">{adminName}</span>
          <div className="admin-icon"></div>
        </div>
        <div className="search-input">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Search..."
          />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>
        <div className="search-results">
          {searchResults.map(result => (
            <div key={result.id} className="result-item">
              <div className="result-name">{result.name}</div>
              <div className="result-email">{result.email}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AClinicianSearch;
