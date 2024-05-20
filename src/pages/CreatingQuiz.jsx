import "./CreatingQuiz.css";
import axios from "redaxios";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminDashboard from "../components/Dashboards/ADashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export function QuestionSearch() {}

export function QuestionsDisplay() {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Add searchTerm state
  const [searchResults, setSearchResults] = useState([]);
  const { moduleID } = useParams(); // Get the module ID from the URL params
  const adminToken = sessionStorage.getItem("adminToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (moduleID) { // Ensure moduleID exists before making the API call
      fetch(
        `https://api.tmstrainingquizzes.com/webapi/GetQuestions/${moduleID}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401) {
              sessionStorage.removeItem("adminToken");
              navigate("/adminlogin");
            }
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setQuestions(data);
          console.log(questions)
          setSearchResults(data); // Initialize searchResults with all questions
        })
        .catch((error) => {
          console.error("Error fetching questions:", error);
        });
    }
  }, [moduleID, adminToken, navigate]);


   const handleSearchInputChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
  };



  useEffect(() => {
    if (searchTerm.trim() !== "") {
      const filteredResults = questions.filter((question) =>
        question.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults(questions); // Reset searchResults to all questions if searchTerm is empty
    }
  }, [searchTerm, questions]);
  

  return (
    <>
      <div className="flex">
        <div className="dashboard-container"></div>
        <div className="AdminClientSearchContainer">
          <div className="AdminClientSearchInput">
            <input
              type="text"
              value={searchTerm} //{/* Change value to searchTerm */}
              onChange={handleSearchInputChange}
              placeholder="Search..."
            />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </div>
          <Link to="/createquestion">
            <button className="add-question"> + </button>
          </Link>

          <div className="AdminClientSearchResults">
            {searchResults.map((result) => (
              <Link
                key={result.questionID}
                to={`/clinician/${result.questionID}`}
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