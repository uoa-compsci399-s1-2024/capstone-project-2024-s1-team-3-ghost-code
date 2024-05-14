import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./adminInfo.css";

function AdminInfo() {
  const [adminName, setAdminName] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null); // Reference to the admin info box
  const adminToken = sessionStorage.getItem("adminToken");

   // Function to fetch admin information from backend API
   useEffect(() => {
    fetch('https://api.tmstrainingquizzes.com/auth/GetCurrentAdmin', {
      headers: {
        Authorization: `Bearer ${adminToken}`, // Include token in headers
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAdminName(data.firstName + " " + data.lastName);
      })
      .catch((error) => {
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
    sessionStorage.removeItem("adminToken");
    // Optionally, you can redirect the user to the sign-in page or perform any other necessary actions
  };

  return (
    <div className="admin-info" ref={dropdownRef} onClick={toggleDropdown}>
      <span className="admin-name">{adminName}</span>
      {isDropdownVisible && (
        <div className="admin-dropdown">
          <Link
            to="/adminlogin"
            className="Admindropdown-item"
            onClick={handleSignOut}
          >
            Sign Out
          </Link>
        </div>
      )}
    </div>
  );
}

export default AdminInfo;
