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
          "http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/GetAdmins",
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

  const [adminfirstName, setAdminFirstName] = useState("");
  const [adminlastName, setAdminLastName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null); // Reference to the admin info box

  // Function to fetch admin information from backend API
  useEffect(() => {
    fetch(
      "http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/auth/GetCurrentAdmin",
      {
        headers: {
          Authorization: `Bearer ${adminToken}`, // Include token in headers
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
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
              <div className="information">
                <input
                  type="text"
                  className="input-box-settings"
                  id="firstname"
                  placeholder={adminfirstName}
                  required
                ></input>
                <input
                  type="text"
                  className="input-box-settings"
                  id="lastname"
                  placeholder={adminlastName}
                  required
                ></input>
                <input
                  type="text"
                  className="input-box-settings"
                  id="email"
                  placeholder={adminEmail}
                  required
                ></input>
                <button className="btn-settings">Save Changes</button>
              </div>
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
                          `http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/GetAdminByID/${adminSearchs.sequence}`
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
          </div>
        </div>
      </section>
    </>
  );
}
