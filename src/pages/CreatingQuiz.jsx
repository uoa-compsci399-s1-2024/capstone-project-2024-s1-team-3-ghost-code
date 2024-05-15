import "./CreatingQuiz.css";
import axios from "redaxios";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminDashboard from "../components/Dashboards/ADashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export function QuestionSearch() {}

export function Modules() {
  const navigate = useNavigate();
  const adminToken = sessionStorage.getItem("adminToken");

  const [modules, setModules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.tmstrainingquizzes.com/webapi/GetModules",
          {
            headers: {
              Authorization: `Bearer ${adminToken}`, // Include token in headers
            },
          }
        );
        setModules(response.data);
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
          console.error("Error fetching modules:", error);
        }
      }
    };

    fetchData();
  }, [adminToken, navigate]);

  return (
    <div className="flex">
      <div className="dashboard-container"></div>
      <div className="quizModuleContainer">
        <div className="quizModuleresults">
          {modules.map((module) => (
            <div
              key={module.moduleID}
              className="module-item"
              onClick={() =>
                navigate(
                  `https://api.tmstrainingquizzes.com/webapi/GetModuleByID/${module.sequence}`
                )
              }
            >
              <div className="moduleId">{"Module " + module.sequence}</div>
              <div className="moduleName">{module.name}</div>
              <div className="moduleDescription">{module.description}</div>
              <FontAwesomeIcon
                icon={faCircleCheck}
                style={{
                  color: module.completion === 100 ? "#4CAF50" : "#ccc",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function QuestionsDisplay() {
  const [questions, setQuestions] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [adminName, setAdminName] = useState("");
  const dropdownRef = useRef(null); // Reference to the admin info box

  const adminToken = sessionStorage.getItem("adminToken");
  const navigate = useNavigate();

  // This useEffect fetches modules initially to display, and then for each module, it fetches questions
  useEffect(() => {
    if (questions.trim() !== "") {
      // Make HTTP request to backend API with search query
      fetch(
        `https://api.tmstrainingquizzes.com/webapi/GetQuestions/${questions}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`, // Include token in headers
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401) {
              // Token is invalid or expired, log the admin out
              sessionStorage.removeItem("adminToken");
              navigate("/adminlogin"); // Redirect to admin login page
            }
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setSearchResults(data);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        });
    } else {
      setSearchResults([]);
    }
  }, [questions, adminToken, navigate]);

  const handleSearchInputChange = (event) => {
    setQuestions(event.target.value);
  };

  // Now you have questions grouped by modules in the 'questions' state

  return (
    <>
      <div className="flex">
        <div className="dashboard-container"></div>
        <div className="AdminClientSearchContainer">
          <div className="AdminClientSearchInput">
            <input
              type="text"
              value={questions}
              onChange={handleSearchInputChange}
              placeholder="Search..."
            />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </div>
          <div className="AdminClientSearchResults">
            {searchResults.map((result) => (
              <Link
                key={result.questionID}
                to={`/clinician/${result.userEmail}`} //change to link to editting quiz
                className="link"
              >
                <div className="adminClientSearchResultItem">
                  <div className="AdminClientSearchResultName">
                    {result.title}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function QuizCreation() {
  return (
    <>
      <QuestionsDisplay />
      {/* <Modules /> */}
      <AdminDashboard />
    </>
  );
}
