import "./CreatingQuiz.css";
import redaxios from "redaxios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminDashboard from "../components/Dashboards/ADashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import AdminInfo from "../components/AdminComponent/adminInfo";

export function QuestionsDisplay() {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
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
          setQuestions(data);
          setSearchResults(data);
        })
        .catch((error) => {
          handleErrorResponse(error.status);
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
      setSearchResults(questions);
    }
  }, [searchTerm, questions]);

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
          <div className="AdminClientSearchInputQuiz">
          <FontAwesomeIcon icon={faSearch} className="search-iconQuiz" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchInputChange}
              placeholder="Search..."
              
            />
          </div>
        
            <button className="add-question" onClick={() => handleAddQuestion()}> + </button>
          
          <div className="AdminClientSearchResultsQuiz">
            {searchResults.map((result) => (
              <div key={result.questionID} className="AdminClientSearchResultsItemQuiz">
                <div className="AdminClientSearchResultName">{result.title}</div>
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
      <AdminInfo />
    </>
  );
}
