import "./AdminSetting.css";
import AdminDashboard from "../components/Dashboards/ADashboard";
import AdminInfo from "../components/AdminComponent/adminInfo";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "redaxios";

export default function AdminSetting() {
  const navigate = useNavigate();
  const adminToken = sessionStorage.getItem("adminToken");

  const [adminSearch, setAdminSearch] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.tmstrainingquizzes.com/webapi/GetAdmins",
          {
            headers: {
              Authorization: `Bearer ${adminToken}`, // Include token in headers
            },
          }
        );
        setAdminSearch(response.data);
      } catch (error) {
        if (error.response) {
          const { status } = error.response;
          if (status === 401) {
            // Token is invalid or expired, log the user out
            sessionStorage.removeItem("adminLogin");
            navigate("/adminlogin"); // Redirect to login page
          } else if (status === 403) {
            // Not authorized to access resource, redirect to appropriate dashboard
            navigate("/adminlogin"); // Redirect to appropriate dashboard
          }
        } else {
          console.error("Error fetching admins:", error);
        }
      }
    };

    fetchData();
  }, [adminToken, navigate]);

  //FOR GETTING ADMINS NAME
  const [adminID, setAdminID] = useState(0);
  const [admindetails, setAdmindetails] = useState("");
  const [adminfirstName, setAdminFirstName] = useState("");
  const [adminlastName, setAdminLastName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null); // Reference to the admin info box

  // Function to fetch admin information from backend API
  useEffect(() => {
    fetch("https://api.tmstrainingquizzes.com/auth/GetCurrentAdmin", {
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
        setAdminID(data.adminID); // Set adminID
        setAdminFirstName(data.firstName);
        setAdminLastName(data.lastName);
        setAdminEmail(data.email);
        setAdminPassword(data.password);
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
  }, [adminToken, navigate]);

  //TO UPDATE ADMIN INFORMATION currently not working
  const handleSubmit = async () => {
    const requestBody = {
      adminID: adminID,
      firstName: adminfirstName,
      lastName: adminlastName,
      email: adminEmail,
      password: adminPassword, // You may need to handle password update separately if needed
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
        "https://api.tmstrainingquizzes.com/webapi/EditAdmin",
        requestOptions
      );
      if (response.ok) {
        // Update admin details state with the new values
        setAdmindetails(requestBody);
        alert("Admin updated successfully!");
      } else if (response.status === 409) {
        throw new Error("A user with this email already exists.");
      } else {
        throw new Error("Failed to update admin");
      }
    } catch (error) {
      console.error("Error updating admin:", error);
      alert(error.message);
    }
  };

  //FUNCTION TO MAKE A NEW ADMIN -works
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmitNewAdmin = async (event) => {
    event.preventDefault();

    const data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };

    try {
      const response = await fetch(
        "https://api.tmstrainingquizzes.com/webapi/AddAdmin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        setMessage("Admin user created successfully.");
        // Optionally, reset form fields
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword(""); //THOUGHT THIS WAS THE ISSUE
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  //ADDING A NEW ROLE AND ORGANISATION - working
  const [newRoleName, setNewRoleName] = useState("");
  const [newOrgName, setNewOrgName] = useState("");
  const [roleMessage, setRoleMessage] = useState("");
  const [organizationMessage, setOrganizationMessage] = useState("");

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    // replace with actual admin token retrieval method
    const roleApiUrl = "https://api.tmstrainingquizzes.com/auth/Login"; // replace with your role API endpoint

    try {
      const response = await fetch(roleApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ role: newRoleName }),
      });

      if (response.ok) {
        setRoleMessage("Role added successfully!");
        setNewRoleName("");
      } else {
        const errorData = await response.json();
        setRoleMessage(`Error adding role: ${errorData.message}`);
      }
    } catch (error) {
      setRoleMessage(`Error adding role: ${error.message}`);
    }
  };

  const handleOrgSubmit = async (e) => {
    e.preventDefault();
    const organizationApiUrl = "https://api.tmstrainingquizzes.com/auth/Login";

    try {
      const response = await fetch(organizationApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ organization: newOrgName }),
      });

      if (response.ok) {
        setOrganizationMessage("Organization added successfully!");
        setNewOrgName("");
      } else {
        const errorData = await response.json();
        setOrganizationMessage(
          `Error adding organization: ${errorData.message}`
        );
      }
    } catch (error) {
      setOrganizationMessage(`Error adding organization: ${error.message}`);
    }
  };
  return (
    <>
      <div className="admin-body-settings"></div>
      <AdminInfo />
      <div className="dashboard-container">
        <AdminDashboard />
      </div>
      <section className="settings">
        <div className="container-settings">
          <div className="accordion">
            <div className="accordion-item" id="adminprofile">
              <a className="accordion-link" href="#adminprofile">
                Profile <i className="fa-solid fa-caret-down"></i>
                <i className="fa-solid fa-caret-up"></i>
              </a>
              <div className="information-text">
                <p>Edit your details</p>
              </div>
              <form className="information" onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="input-box-settings"
                  id="firstname"
                  value={adminfirstName}
                  placeholder="First Name"
                  onChange={(e) => setAdminFirstName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="input-box-settings"
                  id="lastname"
                  value={adminlastName}
                  placeholder="Last Name"
                  onChange={(e) => setAdminLastName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  className="input-box-settings"
                  id="email"
                  value={adminEmail}
                  placeholder="Email"
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                />
                <input //this is for testing purposes
                  type="text"
                  className="input-box-settings"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
                <button onSubmit={handleSubmit} className="btn-settings">
                  Save Changes
                </button>
              </form>
            </div>
            <div className="accordion-item" id="addnewadmin">
              <a className="accordion-link" href="#addnewadmin">
                Add New Admin <i className="fa-solid fa-caret-down"></i>
                <i className="fa-solid fa-caret-up"></i>
              </a>
              <div className="information-text">
                {/* <p>
                  Once you submit this information the recipient will be
                  notified with their login information.
                </p> */}
              </div>
              <form onSubmit={handleSubmitNewAdmin} className="information">
                <input
                  type="text"
                  className="input-box-settings"
                  id="firstname"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="input-box-settings"
                  id="lastname"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="input-box-settings"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="input-box-settings"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="submit" className="btn-settings">
                  Submit
                </button>
              </form>
              {message && <p>{message}</p>}
            </div>
            <div className="accordion-item" id="admins">
              <a className="accordion-link" href="#admins">
                Admins <i className="fa-solid fa-caret-down"></i>
                <i className="fa-solid fa-caret-up"></i>
              </a>

              <div className="admin-search-Container">
                <div className="quizModuleresults">
                  {adminSearch.map((adminSearchs) => (
                    <div
                      key={adminSearchs.adminID}
                      className="admin-search-item"
                    >
                      <div className="adminName">
                        {adminSearchs.firstName} {adminSearchs.lastName}
                      </div>
                      <div className="adminEmail">{adminSearchs.email}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="accordion-item" id="changeRegistration">
              <a className="accordion-link" href="#changeRegistration">
                Clinician Registration
                <i className="fa-solid fa-caret-down"></i>
                <i className="fa-solid fa-caret-up"></i>
              </a>
              <div className="information-text">
                <p>
                  You may add new Sites and Disciplines by entering relevant
                  information in the boxes below and submitting it.
                </p>
              </div>
              <div className="information">
                <input
                  type="text"
                  className="input-box-settings"
                  id="firstname"
                  placeholder="Add New Discipline"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                />
                <button className="btn-settings" onClick={handleRoleSubmit}>
                  Add New Discipline
                </button>
                {roleMessage && <p>{roleMessage}</p>}

                <input
                  type="text"
                  className="input-box-settings"
                  id="lastname"
                  placeholder="Add New Site"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                />
                <button className="btn-settings" onClick={handleOrgSubmit}>
                  Add New Site
                </button>
                {organizationMessage && <p>{organizationMessage}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
