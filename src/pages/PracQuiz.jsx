import React, { useState, useEffect } from 'react';
import './PracQuiz.css';
import redaxios from 'redaxios';
import {Link, useNavigate, useParams } from 'react-router-dom';

const PracQuiz = () => {
  const { quizID, moduleID } = useParams();

  
  const [questions, setQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswerIndexes, setSelectedAnswerIndexes] = useState([]);
  const cliniciantoken = sessionStorage.getItem('cliniciantoken');
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });
  const [attemptID, setattemptID] = useState()
  
  const [selectedAnswersList, setSelectedAnswersList] = useState([]);
  const [questionIDs, setQuestionIDs] = useState([]);
  const [sequence, setSequence] = useState([]);

  
  const [moduleName, setmoduleName] = useState("");


  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const fetchModuleID = async(moduleID) => {
      try {
        const response = await axios.get(`https://api.tmstrainingquizzes.com/webapi/GetQuizzesByModID/${moduleID}`, {
            headers: {
                "Authorization": `Bearer ${clinicianToken}` // Include token in headers
            }
        });
        const moduleNamefind = response.data.name;
        if (moduleNamefind) {
            setModuleName(moduleNamefind);
        } else {
            console.error("Module name not found.");
        }
    } catch (error) {
        console.error('Error fetching practice quiz ID:', error);
    }
  };

    fetchModuleID();
  }, []);


  
  useEffect(() => {
    const fetchClinicianData = async () => {
      try {
        const clinicianResponse = await redaxios.get('https://api.tmstrainingquizzes.com/auth/GetCurrentClinician', {
          headers: {
            "Authorization": `Bearer ${cliniciantoken}` // Include token in headers
          }
        });
        const { userID } = clinicianResponse.data;
        setUserID(userID);
      } catch (error) {
        console.error('Error fetching current clinician data:', error);
      }
    };

    fetchClinicianData();
  }, []);


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await redaxios.post('https://api.tmstrainingquizzes.com/webapi/GetQuizQs', {
          quizID: quizID,
          userID: userID,
          moduleID: moduleID,
        }, {
          headers: {
            "Authorization": `Bearer ${cliniciantoken}` // Include token in headers
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = response.data;
        console.log(response.data)


         // Extract question IDs from the response data
        const IDs = data.map(question => question.questionID);
        setQuestionIDs(IDs);
       
        setQuestions(data);
        setattemptID(data[0].attemptID)
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };


    
    if (userID !== null) {  
      fetchQuestions();
    }
  }, [userID,quizID,moduleID]);


  useEffect(() => {
    // Generate sequence array based on the length of questionIDs
    const generateSequence = () => {
      const sequenceArray = Array.from({ length: questionIDs.length }, (_, index) => index + 1);
      setSequence(sequenceArray);
    };
  
    generateSequence();
  }, [questionIDs]);



const [selectedAnswersLists, setSelectedAnswersLists] = useState(Array.from({ length: questions.length }, () => []));

const storeSelectedAnswersForQuestion = (selectedAnswers, questionIndex) => {
  const updatedSelectedAnswersLists = [...selectedAnswersLists];
  updatedSelectedAnswersLists[questionIndex] = selectedAnswers;
  setSelectedAnswersLists(updatedSelectedAnswersLists);
};

  



  const onAnswerSelected = (answer, index) => {
    const currentQuestion = questions[activeQuestion];
    const updatedSelectedAnswersList = [...selectedAnswersList]; // Create a copy of selectedAnswersList
    
    if (currentQuestion.questionType === 1) {
      // Single selection question
      updatedSelectedAnswersList[activeQuestion] = [answer.answerID || answer]; // Store the answer ID if available, otherwise fallback to the answer itself
      setSelectedAnswersList(updatedSelectedAnswersList); // Update selectedAnswersList state
  
      // Clear the selectedAnswerIndexes state to prevent multiple highlights
      setSelectedAnswerIndexes([index]);
    } else if (currentQuestion.questionType === 2) {
      // Multiple selection question
      const selectedAnswersForQuestion = updatedSelectedAnswersList[activeQuestion] || []; // Retrieve previously selected answers for the question
      
      if (selectedAnswersForQuestion.includes(answer)) {
        // Remove the answer ID from the array if it's already selected
        const updatedAnswers = selectedAnswersForQuestion.filter(id => id !== answer);
        updatedSelectedAnswersList[activeQuestion] = updatedAnswers;
        setSelectedAnswersList(updatedSelectedAnswersList); // Update selectedAnswersList state
      } else {
        // Add the answer ID to the array if it's not selected
        updatedSelectedAnswersList[activeQuestion] = [...selectedAnswersForQuestion, answer.answerID || answer];
        setSelectedAnswersList(updatedSelectedAnswersList); // Update selectedAnswersList state
      }
  
      // Toggle the index in selectedAnswerIndexes state
      setSelectedAnswerIndexes(prev => {
        if (prev.includes(index)) {
          return prev.filter(idx => idx !== index);
        } else {
          return [...prev, index];
        }
      });
    }
    storeSelectedAnswersForQuestion(updatedSelectedAnswersList[activeQuestion], activeQuestion);
  };
  
  
  
  
  console.log(selectedAnswersList)
  

  const onClickNext = async () => {

    console.log(selectedAnswersList)
    console.log(sequence)
    console.log(questionIDs)
    console.log(userID)
    console.log(attemptID)
    const currentQuestion = questions[activeQuestion];
    
    if (activeQuestion !== questions.length - 1) {
      const nextQuestionIndex = activeQuestion + 1;
      setActiveQuestion(nextQuestionIndex);
      const nextSelectedIndexes = selectedAnswersLists[nextQuestionIndex] || [];
      setSelectedAnswerIndexes(nextSelectedIndexes);
    } else {
      try { 
  
        // Call the QuizSubmission API
        const submissionResponse = await redaxios.post(
          'https://api.tmstrainingquizzes.com/webapi/QuizSubmission',
          {
            answerID: selectedAnswersList,
            sequence: sequence,
            questionID: questionIDs,
            userID: userID,
            attemptID: attemptID,
          },
          {
            headers: {
              Authorization: `Bearer ${cliniciantoken}`,
            },
          }
        );
    
  
        // Process the submission response
        const submissionResult = submissionResponse.data;
        console.log(submissionResult);
  
        // Calculate score based on submission result
        const score = submissionResult.score;
        const correctAnswers = submissionResult.correct.filter(answer => answer[0] === true).length;
        const wrongAnswers = submissionResult.correct.filter(answer => answer[0] === false).length;

        console.log(correctAnswers)

        
  
        // Show result with score
        setResult((prev) => ({
          ...prev,
          score: score,
          correctAnswers: correctAnswers, // Reset correct answers count
          wrongAnswers: wrongAnswers, // Reset wrong answers count
        }));
  
        setShowResult(true);
      } catch (error) {
        console.error('Error submitting quiz:', error);
      }
    }
  };
  
  
 

  const addLeadingZero = (number) => (number > 9 ? number : `0${number}`);

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

 
 
  const { title, answers } = questions[activeQuestion];

  const onClickPrevious = () => {
    if (activeQuestion !== 0) {
        setActiveQuestion(prev => prev - 1);
        // Update selected answer indexes
        const prevSelectedIndexes = selectedAnswersLists[activeQuestion - 1] || [];
        setSelectedAnswerIndexes(prevSelectedIndexes);
        console.log(activeQuestion)
    }
};


return (
  <div className='quiz-body'>
      <div className="quiz-container">
          {!showResult ? (

              <div className="cont-main-quiz">

                  <div className="cont-return-but">

                      <Link to="/quizDashboard" style={{ textDecoration: "none" }}>
                          <button className="btn return-button">Back to Modules</button>
                      </Link>
                  </div>

                  <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: `${(activeQuestion) / questions.length * 100}%` }}></div>
                  </div>

                  {/*Need api or something*/}
                  <h2>{moduleID}: {moduleName}</h2>

                  <div className='cont-question'>
                      <div className="button-container">
                          {activeQuestion !== 0 && (
                              <button onClick={onClickPrevious} className="btn prev-ques">Previous</button>
                          )}

                          <button onClick={onClickNext} disabled={selectedAnswerIndexes.length === 0} className="btn next-ques">
                              {activeQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                          </button>
                      </div>

                      <div className='question-body'>

                          <div className='question-stage'>
                              <span className="active-question-no">{addLeadingZero(activeQuestion + 1)}</span>
                              <span className="total-question">/{addLeadingZero(questions.length)}</span>
                          </div>

                          <h2>{title}</h2>
                          <ul>
                              {answers.map((answer, index) => (
                                  <li
                                      onClick={() => onAnswerSelected(answer.answerID, index)}
                                      key={answer.answerID}
                                      className={selectedAnswersLists[activeQuestion]?.includes(answer.answerID) ? 'selected-answer' : null}>
                                      {answer.answerText}
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </div>

              </div>
          ) : (
              <div className='cont-feedback'>
                  <div className="cont-return-but">
                      <Link to="/quizDashboard" style={{ textDecoration: "none" }}>
                          <button className="btn return-button">Back to Modules</button>
                      </Link>
                  </div>

                  <div className="result">
                      <h3>Result</h3>
                      <p>
                          Total Questions: <span>{questions.length}</span>
                      </p>
                      <p>
                          Total Score:<span> {result.score}</span>
                      </p>
                      <p>
                          Correct Answers:<span> {result.correctAnswers}</span>
                      </p>
                      <p>
                          Wrong Answers:<span> {result.wrongAnswers}</span>
                      </p>
                  </div>

                  <div className='feedback-qs'>
                      {/*individual questions here for feedback, along with blurb at the bottom of each. APIS: */}
                  </div>

              </div>


          )}
      </div>
  </div>
);
};

export default PracQuiz;