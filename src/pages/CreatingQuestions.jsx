import React, { useState, useEffect } from "react";
import AdminDashboard from "../components/Dashboards/ADashboard";
import { useParams } from "react-router-dom";
import redaxios from 'redaxios';
import "./CreatingQuestions.css";
import { Link, useNavigate} from "react-router-dom";

export default function CreatingQuiz() {
  const { moduleID, questionID } = useParams();
  const adminToken = sessionStorage.getItem("adminToken");
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([{ answerText: "", feedback: "" }]);
  const [correctAnswerIndices, setCorrectAnswerIndices] = useState([]);
  const [stage, setStage] = useState(""); // Define the stage state variable
  const [questionToEdit, setQuestionToEdit] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [fileLabel, setFileLabel] = useState("No file chosen"); // State to manage the display text for file input
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
    if (questionID) {
      // Fetch question details for editing
      fetchQuestionDetails();
    }
  }, [questionID]);

  const fetchQuestionDetails = async () => {
    try {
      const response = await redaxios.get(
        `https://api.tmstrainingquizzes.com/webapi/GetQuestions/${moduleID}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
  
      const questions = response.data;

      const questionToEdit = questions.find((q) => q.questionID === parseInt(questionID));
      console.log(questionToEdit)

      if (questionToEdit) {
        // Populate state with question details for editing
        setQuestionToEdit(questionToEdit);
        setQuestion(questionToEdit.title || "");
        setStage(questionToEdit.topic || "");
        setAnswers(questionToEdit.answers);
        const correctIndices = questionToEdit.answers.reduce(
          (indices, answer, index) => {
            if (answer.correctAnswer) indices.push(index);
            return indices;
          },
          []
        );
        setCorrectAnswerIndices(correctIndices);
        if (questionToEdit.imageURL) {
          const imageUrlSegments = questionToEdit.imageURL.split('-');
          console.log(imageUrlSegments)
          const imageName = imageUrlSegments[imageUrlSegments.length - 1];
          setFileLabel(imageName);
          console.log(imageName)
        }

      } else {
        console.error("Question not found");
      }
    } catch (error) {
      console.error("Error fetching questions for module", error);
      handleErrorResponse(error.status);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setFileLabel(file.name);
    }
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, { answerText: "", feedback: "" }]);
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

    const newCorrectAnswerIndices = correctAnswerIndices
      .filter((i) => i !== index)
      .map((i) => (i > index ? i - 1 : i));
    setCorrectAnswerIndices(newCorrectAnswerIndices);
  };

  const handleToggleCorrectAnswer = (index) => {
    const newCorrectAnswerIndices = correctAnswerIndices.includes(index)
      ? correctAnswerIndices.filter((i) => i !== index)
      : [...correctAnswerIndices, index];
    setCorrectAnswerIndices(newCorrectAnswerIndices);
  };



  const handleImageUpload = async (imageFile) => {
    try {
      // Check if an image file is selected
      if (!imageFile) {
        return;
      }
  
      // Check file extension and size
      const fileName = imageFile.name;
      const fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
      const allowedExtensions = ["jpg", "jpeg", "png"];
      const maxFileSize = 1024 * 1024; // 1MB
  
      if (!allowedExtensions.includes(fileExtension)) {
        alert("Only JPG, JPEG, and PNG files are allowed.");
        return;
      }
  
      if (imageFile.size > maxFileSize) {
        alert("Image size exceeds 1MB.");
        return;
      }
  
      // Upload image
      const formData = new FormData();
     
      formData.append("file", imageFile);
     
  
      const response = await redaxios.post(
        `https://api.tmstrainingquizzes.com/webapi/QuestionImageUpload/${questionID}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            
          },
        }
      );
  
      // Optionally, handle response
      console.log("Image uploaded successfully", response.data);
    } catch (error) {
      console.error("Error uploading image", error);
      // Optionally, handle error
    }
  };

  const handleImageUploadNewQ= async (imageFile, ID) => {
    try {
      // Check if an image file is selected
      if (!imageFile) {
        return;
      }
  
      // Check file extension and size
      const fileName = imageFile.name;
      const fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
      const allowedExtensions = ["jpg", "jpeg", "png"];
      const maxFileSize = 1024 * 1024; // 1MB
  
      if (!allowedExtensions.includes(fileExtension)) {
        alert("Only JPG, JPEG, and PNG files are allowed.");
        return;
      }
  
      if (imageFile.size > maxFileSize) {
        alert("Image size exceeds 1MB.");
        return;
      }
  
      // Upload image
      const formData = new FormData();
     
      formData.append("file", imageFile);
     
  
      const response = await redaxios.post(
        `https://api.tmstrainingquizzes.com/webapi/QuestionImageUpload/${ID}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            
          },
        }
      );
  
      // Optionally, handle response
      console.log("Image uploaded successfully", response.data);
    } catch (error) {
      console.error("Error uploading image", error);
      // Optionally, handle error
    }
  };
  

  const handlePublishQuestion = async () => {
      // Check if question title is provided
  if (!question.trim()) {
    alert("Please enter a question title.");
    return;
  }

   // Check if stage is selected
   if (!stage.trim()) {
    alert("Please select a stage.");
    return;
  }

  // Check if at least one answer is provided
  if (answers.length === 0 || answers.every(answer => !answer.answerText.trim())) {
    alert("Please provide at least one answer.");
    return;
  }

  // Check if at least one correct answer is selected
  if (correctAnswerIndices.length === 0) {
    alert("Please select at least one correct answer.");
    return;
  }




    // Count the number of correct answers
    const numCorrectAnswers = correctAnswerIndices.length;



    const correctAnswers = answers.map((answer, index) =>
        correctAnswerIndices.includes(index)
      );
    
      if (questionID) {   
        const questionType = questionToEdit.questionType;
        console.log(questionType)

        if (questionType == 1 && correctAnswerIndices.length > 1) {
        alert("This question is only single correct answer")
        return;
        }

        if (questionType == 2 && correctAnswerIndices.length < 2) {
        alert("This question is only MCQ, please add another correct answer.")
        return;
        }
      }

      
  
    const newQuestion = {
      questionID: questionID,
      title: question,
      description: "",
      //imageURL: "",
      //questionType: questionType,
      topic: parseInt(stage),
      answers: answers.map((answer, index) => ({
        //answerID: answer.answerID, // Include answer ID for editing
        answerText: answer.answerText,
        //answerCoordinates: "",
        correctAnswer: correctAnswers[index],
        feedback: answer.feedback,
      })),
    };
    console.log(newQuestion)
  
    try {
      let response;
      if (questionID) {
        if (imageFile) {
            await handleImageUpload(imageFile);
        }
        // Editing an existing question
        response = await redaxios.put(
          `https://api.tmstrainingquizzes.com/webapi/EditQuestion/`,
          newQuestion,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );


      } else {

        // Determine the question type based on the number of correct answers
        const questionTypeV = numCorrectAnswers > 1 ? 2 : 1;

        const newQuestion = {
            modID: moduleID,
            title: question,
            description: "",
            questionType: questionTypeV,
            topic: parseInt(stage),
            answers: answers.map((answer, index) => ({
              answerType: questionTypeV,
              answerText: answer.answerText,
              //answerCoordinates: "",
              correctAnswer: correctAnswers[index],
              feedback: answer.feedback,
            })),
          };
        // Adding a new question
        response = await redaxios.post(
          "https://api.tmstrainingquizzes.com/webapi/AddQuestion",
          newQuestion,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );
        if (imageFile) {
            const fetchResponse = await redaxios.get(
                `https://api.tmstrainingquizzes.com/webapi/GetQuestions/${moduleID}`,
                {
                  headers: {
                    Authorization: `Bearer ${adminToken}`,
                  },
                }
              );
            const questions = fetchResponse.data;
            const newQuestionFromList = questions.find((q) => q.title === newQuestion.title);
            if (newQuestionFromList) {
                await handleImageUploadNewQ(imageFile, newQuestionFromList.questionID);
              }
      }
    }
      
      alert("Question uploaded!");
      navigate(`/createquiz/${moduleID}`);
      console.log("Question published successfully", response.data);

  
      // Reset state after publishing
     // setQuestion("");
      //setAnswers([{ answerText: "", feedback: "" }]);
      //setCorrectAnswerIndices([]);
      //setStage("");
    
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
        {fileLabel}
        <input
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={handleImageChange}
             // Hide default input
        />   {/* Display custom label */} <br></br>
        <select
          value={stage}
          onChange={(event) => setStage(event.target.value)}
        >
          <option value="">Select Topic</option>
          <option value="1">Topic One</option>
          <option value="2">Topic Two</option>
          <option value="3">Topic Three</option>
        </select>
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
          {questionID ? "Update Question" : "Publish Question"}
        </button>
      </div>
    </div>
  );
};
