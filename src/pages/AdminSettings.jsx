import "./AdminSetting.css";
import AdminDashboard from "../components/Dashboards/ADashboard";
import AdminInfo from "../components/AdminComponent/adminInfo";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "redaxios";

export function AdminName() {
  return (
    <>
      <div className="admin">
        <div className="admin-image"></div>
        <div className="admin-name">John Smith</div>
      </div>
    </>
  );
}

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
  const [adminfirstName, setAdminFirstName] = useState("");
  const [adminlastName, setAdminLastName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        adminID: adminID,
        firstName: adminfirstName,
        lastName: adminlastName,
        email: adminEmail,
      };

      console.log("Payload being sent:", payload);

      const response = await axios.put(
        "https://api.tmstrainingquizzes.com/webapi/EditAdmin",
        payload,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Admin details updated successfully");
      } else {
        console.error("Unexpected response status:", response.status);
        alert("Failed to update admin details");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Failed to update admin details. Check console for more information."
      );
    }
  };

  return (
    <>
      <div className="admin-body"></div>
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
                <button type="submit" className="btn-settings">
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
                <p>
                  Once you submit this information the recipient will be
                  notified with their login information and set a password
                </p>
              </div>
              <div className="information">
                <input
                  type="text"
                  className="input-box-settings"
                  id="firstname"
                  placeholder="First Name"
                  required
                ></input>
                <input
                  type="text"
                  className="input-box-settings"
                  id="lastname"
                  placeholder="Last Name"
                  required
                ></input>
                <input
                  type="text"
                  className="input-box-settings"
                  id="email"
                  placeholder="Email"
                  required
                ></input>
                <button className="btn-settings">Submit</button>
              </div>
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
                      onClick={() =>
                        navigate(
                          `https://api.tmstrainingquizzes.com/webapi/GetAdminByID/${adminSearchs.sequence}`
                        )
                      }
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
                  required
                ></input>
                <input
                  type="text"
                  className="input-box-settings"
                  id="lastname"
                  placeholder="Add New Site"
                  required
                ></input>
                <button className="btn-settings">Submit</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
