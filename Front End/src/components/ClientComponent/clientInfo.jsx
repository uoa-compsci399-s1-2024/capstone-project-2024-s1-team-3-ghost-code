import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import "./clientInfo.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

function ClientInfo() {
const [clientName, setClientName] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null); // Reference to the admin info box
  const cliniciantoken = sessionStorage.getItem('cliniciantoken');

   // Function to fetch admin information from backend API
   useEffect(() => {
    fetch('https://api.tmstrainingquizzes.com/auth/GetCurrentClinician', {
      headers: {
        "Authorization": `Bearer ${cliniciantoken}` // Include token in headers

      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setClientName(data.firstName + " " + data.lastName);
    
      })
      .catch(error => {
        console.error("Error fetching admin information:", error);
      });
  }, []);

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
    sessionStorage.removeItem('cliniciantoken');
    // Optionally, you can redirect the user to the sign-in page or perform any other necessary actions
  };

  return (
    <div className="client-info" ref={dropdownRef} onClick={toggleDropdown}>
    <span className="client-name">{clientName}</span>
    <FontAwesomeIcon icon={faCaretDown} className="info-dropdown" style={{margin:0}}/>
    {isDropdownVisible && (
    <div className="client-dropdown">
        <Link to="/cliniciansign" className="clientdropdown-item" onClick={handleSignOut}>
        Sign Out
        </Link>
    </div>
    )}
    </div>
  );
}



export default ClientInfo;