import React, { useState, useEffect } from "react";
import AdminDashboard from "../components/Dashboards/ADashboard";
import { Link, useNavigate } from "react-router-dom";
import redaxios from 'redaxios';
import "./CreatingQuestions.css";

export default function CreatingQuiz() {
  const navigate = useNavigate();
  const adminToken = sessionStorage.getItem("adminToken");
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([{ answerText: "", feedback: "" }]); // Initialize with one empty answer
  const [correctAnswerIndices, setCorrectAnswerIndices] = useState([]); // Indices of the correct answers

  const handleAddAnswer = () => {
    setAnswers([...answers, { answerText: "", feedback: "" }]); // Add a new empty answer to the list
  };

  const handleAnswerChange = (index, event) => {
    const { name, value } = event.target;
    const newAnswers = [...answers];
    newAnswers[index][name] = value;
    setAnswers(newAnswers);
  };

  const handleRemoveAnswer = (index) => {
    const newAnswers = [...answers];
    newAnswers.splice(index, 1);
    setAnswers(newAnswers);

    // If the removed answer was correct, update correctAnswerIndices
    const newCorrectAnswerIndices = correctAnswerIndices
      .filter((i) => i !== index)
      .map((i) => (i > index ? i - 1 : i)); // Adjust remaining indices
    setCorrectAnswerIndices(newCorrectAnswerIndices);
  };

  const handleToggleCorrectAnswer = (index) => {
    const newCorrectAnswerIndices = correctAnswerIndices.includes(index)
      ? correctAnswerIndices.filter((i) => i !== index)
      : [...correctAnswerIndices, index];
    setCorrectAnswerIndices(newCorrectAnswerIndices);
  };

  const handlePublishQuestion = async () => {
    const newQuestion = {
      modID: 0, // Update this value accordingly
      title: question,
      description: "",
      imageURL: "",
      questionType: 0,
      stage: "",
      answers: answers.map((answer, index) => ({
        answerType: 0, // Update this value accordingly
        answerText: answer.answerText,
        answerCoordinates: "", // Add appropriate value if needed
        correctAnswer: correctAnswerIndices.includes(index),
        feedback: answer.feedback,
      })),
    };

    try {
      const adminToken = sessionStorage.getItem("adminToken");
    
      const response = await redaxios.post(
        "https://api.tmstrainingquizzes.com/webapi/AddQuestion",
        newQuestion,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`, // Include token in headers
          },
        }
      );
    
      console.log("Question published successfully", response.data);
    
      // Reset state after publishing
      setQuestion("");
      setAnswers([{ answerText: "", feedback: "" }]);
      setCorrectAnswerIndices([]);
    } catch (error) {
      console.error("Error publishing question", error);
    }
  };

  return (
    <div className="flex-questions">
      <div className="dashboard-container">
        <AdminDashboard />
      </div>
      <div className="make-a-new-question-container">
        <div className="new-question"></div>
        <input
          type="text"
          name="Question"
          placeholder="Add a Question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
        <div className="new-answers">
          {answers.map((answer, index) => (
            <div key={index} className="answer-container">
              <input
                type="text"
                name="answerText"
                placeholder="Add an Answer"
                value={answer.answerText}
                onChange={(event) => handleAnswerChange(index, event)}
                className={
                  correctAnswerIndices.includes(index) ? "correct-answer" : ""
                }
              />
              <input
                type="text"
                name="feedback"
                placeholder="Add Feedback (optional)"
                value={answer.feedback}
                onChange={(event) => handleAnswerChange(index, event)}
              />
              <button
                className="answer-button"
                onClick={() => handleToggleCorrectAnswer(index)}
              >
                {correctAnswerIndices.includes(index)
                  ? "Correct Answer"
                  : "Select"}
              </button>
              <button
                className="remove-answer-button"
                onClick={() => handleRemoveAnswer(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button className="add-answer" onClick={handleAddAnswer}>
          Add Another Answer
        </button>
        <button className="publish-question" onClick={handlePublishQuestion}>
          Publish Question
        </button>
      </div>
    </div>
  );
}
