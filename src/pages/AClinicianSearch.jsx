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
  const [allClinicians, setAllClinicians] = useState([]);
  const [adminName, setAdminName] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const adminToken = sessionStorage.getItem("adminToken");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllClinicians();
  }, []);

  const fetchAllClinicians = async () => {
    try {
      const response = await fetch(
        "https://api.tmstrainingquizzes.com/webapi/ClinicianSearch",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      const data = await response.json();
      setAllClinicians(data);
    } catch (error) {
      console.error("Error fetching all clinicians:", error);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const filteredResults = allClinicians.filter(
        (clinician) =>
          clinician.firstName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          clinician.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults(allClinicians);
    }
  }, [searchQuery, allClinicians]);

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
              style={{ textDecoration: "none" }}
              key={result.userID}
              to={`/clinician/${result.userEmail}`}
              className="link"
            >
              <div className="adminClientSearchResultItem">
                <div className="AdminClientSearchResultName">
                  {result.firstName}
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
