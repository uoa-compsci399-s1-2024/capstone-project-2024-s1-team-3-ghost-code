import "./CreatingQuiz.css";
import redaxios from "redaxios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminDashboard from "../components/Dashboards/ADashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export function QuestionsDisplay() {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("");
  const { moduleID } = useParams();
  const adminToken = sessionStorage.getItem("adminToken");
  const navigate = useNavigate();

  const handleErrorResponse = (status) => {
    if (status === 401) {
      if (sessionStorage.getItem('adminToken')) {
        sessionStorage.removeItem('adminToken');
        console.log('Token found and removed due to 401 Unauthorized status.');
      } else {
        console.log('No token found when handling 401 status.');
      }
      navigate('/adminlogin');
    } else if (status === 403) {
      navigate('/quizDashboard');
    }
  };
  

  useEffect(() => {
    if (moduleID) {
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
          console.log(data);
          const sortedData = data.sort((a, b) => a.topic - b.topic);

          setQuestions(sortedData);
          setSearchResults(sortedData);
        })
        .catch((error) => {
          handleErrorResponse(error.status);
          console.error("Error fetching questions:", error);
        });
    }
  }, [moduleID, adminToken, navigate]);

  console.log(questions);

  const handleSearchInputChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
  };

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
  };

  useEffect(() => {
    let filteredResults = questions;

    if (searchTerm.trim() !== "") {
      filteredResults = filteredResults.filter((question) =>
        question.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTopic !== "") {
      filteredResults = filteredResults.filter(
        (question) => question.topic === parseInt(selectedTopic)
      );
    }

    setSearchResults(filteredResults);
  }, [searchTerm, selectedTopic, questions]);

  const handleEditQuestion = (questionID) => {
    navigate(`/createquestion/${moduleID}/${questionID}`);
  };

  const handleDeleteQuestion = (questionID) => {
    console.log("Delete button clicked for question ID:", questionID);
    setQuestionToDelete(questionID);
    setShowDeleteModal(true);
  };

  const handleAddQuestion = () => {
    navigate(`/createquestion/${moduleID}`);
  }

  const confirmDeleteQuestion = async () => {
    try {
      console.log("Confirm delete for question ID:", questionToDelete);
      const response = await redaxios.delete(
        `https://api.tmstrainingquizzes.com/webapi/DeleteQuestion/${questionToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },  
        }
      );
  
      // Log the response to see if the deletion was successful
      console.log("Delete response:", response);
  
      if (response.status === 200 || response.status === 204) {
        // Assuming 200 or 204 means the deletion was successful
        setQuestions(questions.filter((q) => q.questionID !== questionToDelete));
        setSearchResults(searchResults.filter((q) => q.questionID !== questionToDelete));
        setShowDeleteModal(false);
        setQuestionToDelete(null);
        console.log("Question deleted successfully");
        alert("Question deleted successfully");
      } else {
        console.error("Failed to delete question:", response);
        alert("Failed to delete question");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Error deleting question");
    }
  };
  
  const closeDeleteModal = () => {
    console.log("Closing delete modal");
    setShowDeleteModal(false);
    setQuestionToDelete(null);
  };

  console.log("showDeleteModal:", showDeleteModal);

  return (
    <>
      <div className="flex">
        <div className="dashboard-container">
          <AdminDashboard />
        </div>
        <div className="AdminClientSearchContainerQuiz">
        <div className="side-by-side">

          <div className="AdminClientSearchInputQuiz">
            <FontAwesomeIcon icon={faSearch} className="search-iconQuiz" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchInputChange}
              placeholder="Search..."
            />
          </div>

          <div className="CreateQuizFilter">
            <select value={selectedTopic} onChange={handleTopicChange} className="AEditDropdown" style={{fontSize:"1.3rem"}}>
              <option value="">All Topics</option>
              <option value="1">Topic 1</option>
              <option value="2">Topic 2</option>
              <option value="3">Topic 3</option>
            </select>
          </div>

          </div>


          <button className="add-question" onClick={handleAddQuestion}> + </button>
          <div className="AdminClientSearchResultsQuiz">
            {searchResults.map((result) => (
              <div key={result.questionID} className="AdminClientSearchResultsItemQuiz">
                <div className="titleandtopic">
                  <div className="AdminClientSearchResultName">{result.title}</div>
                  <div className="AdminClientSearchResultTopic">Topic: {result.topic}</div>
                </div>
                <div className="buttons">
                  <button className="edit-button" onClick={() => handleEditQuestion(result.questionID)}>
                    Edit Question
                  </button>
                  <button className="delete-button" onClick={() => handleDeleteQuestion(result.questionID)}>
                    Delete Question
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this question?</p>
            <button className="confirm-button" onClick={confirmDeleteQuestion}>Yes, delete</button>
            <button className="cancel-button" onClick={closeDeleteModal}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}

export default function QuizCreation() {
  return (
    <>
      <QuestionsDisplay />
      <AdminDashboard />
    </>
  );
}