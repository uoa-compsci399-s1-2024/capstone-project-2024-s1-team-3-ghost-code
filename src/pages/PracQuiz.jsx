import React, { useState, useEffect } from 'react';
import './Quiz.css';
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

  const [submissionResult, setSubmissionResult] = useState([]);


  const [userID, setUserID] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchModuleAccessStatus = async () => {
      try {
        const response = await redaxios.get(`https://api.tmstrainingquizzes.com/webapi/CheckAccess/${moduleID}`, {
          headers: {
            "Authorization": `Bearer ${cliniciantoken}`
          }
        });
      
        const finalPassed = response.data.finalPassed;
        const practicePassed = response.data.practicePassed;
        if (quizID % 2 == 0) {
          if (!practicePassed || finalPassed) {
            navigate('/quizDashboard'); // Redirect to quiz dashboard if practice quiz is not passed or final exam is already completed
          }

        }

      } catch (error) {
        console.error('Error fetching module access status:', error);
        // Handle error
      }
    };

    fetchModuleAccessStatus();
  }, [moduleID, cliniciantoken, navigate]);

  

  useEffect(() => {
    const fetchModuleID = async() => {
      try {
        const response = await redaxios.get(`https://api.tmstrainingquizzes.com/webapi/GetModuleByID/${moduleID}`, {
            headers: {
                "Authorization": `Bearer ${cliniciantoken}` // Include token in headers
            }
        });
        const moduleNamefind = response.data.name;
        if (moduleNamefind) {
          setmoduleName(moduleNamefind);
        } else {
            console.error("Module name not found.");
        }
    } catch (error) {
      if (error.status) {
        handleErrorResponse(error.status);
      } else {
         console.error('Error fetching practice quiz ID:', error);
         console.log(error.status)
      }
        
    }
  };

    fetchModuleID();
  }, [moduleID, cliniciantoken, navigate]);


  
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
        if (error.status) {
          handleErrorResponse(error.status);
        } else {
          console.error('Error fetching current clinician data:', error);
        }
      }
    };

    fetchClinicianData();
  }, [cliniciantoken, navigate]);


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
        if (error.status) {
          handleErrorResponse(error.status);

        } else {
          console.error('Error fetching questions:', error);
        }
      }
    };


    
    if (userID !== null) {  
      fetchQuestions();
    }
  }, [userID,quizID,moduleID, cliniciantoken, navigate]);


  useEffect(() => {
    // Generate sequence array based on the length of questionIDs
    const generateSequence = () => {
      const sequenceArray = Array.from({ length: questionIDs.length }, (_, index) => index + 1);
      setSequence(sequenceArray);
    };
  
    generateSequence();
  }, [questionIDs]);

  const handleErrorResponse = (status) => {
    if (status === 401) {
      if (sessionStorage.getItem('cliniciantoken')) {
        sessionStorage.removeItem('cliniciantoken');
        console.log('Token found and removed due to 401 Unauthorized status.');
      } else {
        console.log('No token found when handling 401 status.');
      }
      navigate('/cliniciansign');
    } else if (status === 403) {
      navigate('/quizDashboard');
    }
  };
  


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
        setSubmissionResult(submissionResponse.data);
        
        const submissionResult = submissionResponse.data;
        // Calculate score based on submission result
        const score = submissionResult.score;
        //const correctAnswers = submissionResult.missedCorrectAID.filter(answer => answer.length === 0).length;
        //const wrongAnswers = submissionResult.missedCorrectAID.filter(answer => answer.length > 0).length;
        console.log(submissionResult)

        let correctCount = 0;
        let wrongCount = 0;
        submissionResult.selectedCorrect.forEach((questionResults, index) => {
          const allCorrect = questionResults.every(result => result === true);
          const noMissedAnswers = submissionResult.missedCorrectAID[index].length === 0;
      
          if (allCorrect && noMissedAnswers) {
            correctCount++;
          } else {
            wrongCount++;
          }
        });

        const correctAnswers = correctCount;
        const wrongAnswers = wrongCount;
      
       
        
  
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
    return (<div className='loadingpage'>
      <head><title>404 - Page Not Found</title></head>
      <body>
        <div className='loadingbody'>
          <div className='loadingtextcont'>
            <h1 className='loadingh1'>404 - Page Not Found</h1>
            <p className='loadingp'>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>

              <div className="cont-return-but">
                <Link to="/quizDashboard" style={{ textDecoration: "none" }}>
                  <button className="btn return-button">Back to Modules</button>
                </Link>
              </div>

          </div>
        </div>
      </body>
    </div>);
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
console.log(moduleName)


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
            <div className='cont-results'>
              <div className="cont-return-but">
                <Link to="/quizDashboard" style={{ textDecoration: "none" }}>
                  <button className="btn return-button">Back to Modules</button>
                </Link>
              </div>
            <div className='right-side'>

              <div className="result">
                <h3>Result</h3>
                <p>Total Questions: <span>{questions.length}</span></p>
                <p>Total Score: <span>{result.score}</span></p>
                <p>Correct Answers: <span>{result.correctAnswers}</span></p>
              <p>Wrong Answers: <span>{result.wrongAnswers}</span></p>
              
            </div>
            <div className='button-alignment'>
                <div className="button-container">
                  <button onClick={onClickPrevious} disabled={activeQuestion === 0} className="btn feedback-prev-ques">Previous</button>
                  <button onClick={onClickNext} disabled={activeQuestion === questions.length - 1} className="btn feedback-next-ques">Next</button>
                </div>
              </div>
              
              <div className='button-alignment'>
                <div className="button-container">
                  <button onClick={onClickPrevious} disabled={activeQuestion === 0} className="btn feedback-prev-ques">&#60;</button>
                  <button onClick={onClickNext} disabled={activeQuestion === questions.length - 1} className="btn feedback-next-ques">&#62;</button>
                </div>
              </div>

              </div>
    
              <div className='feedback-qs'>

                  <div key={questions[activeQuestion].questionID} className="question-answer-container">
                  <div className="question-answer-wrapper">
                  <div className='sep-qs'>
                    <h2>{questions[activeQuestion].title}</h2>

                   {/* This changing colour section changes the colour of the selected question, but idk how to change it to red if it was wrong*/}
                    <ul className='feedback-options'>
                      {questions[activeQuestion].answers.map(answer => (
                        <li 
                          key={answer.answerID} 
                          style={{ 
                            color: selectedAnswersLists[activeQuestion]?.includes(answer.answerID) ? 



                              submissionResult.selectedCorrect[activeQuestion].every(val => val) && submissionResult.missedCorrectAID[activeQuestion].length === 0 ? 'green' : 'red'
                              : 
                              (submissionResult.missedCorrectAID[activeQuestion].includes(answer.answerID) ? '' : '') 
                          }}
                        >
                          {answer.answerText}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                </div>


                  {/*IDK which part of the code is displaying the answered question, I want to remove it and ONLY show the feedback, but I think they depend on each other? I'm not too sure about what I can remove.*/}
                <div className="cont-feedback">
                  <div className="cont-feedback-writing">


                  <ul>
                    {selectedAnswersLists[activeQuestion]?.map((selectedAnswerID, index) => (
                    <li key={selectedAnswerID} style={{ color: '#808080' }}>
                      {questions[activeQuestion].answers.find(answer => answer.answerID === selectedAnswerID)?.answerText}
                      {Array.isArray(submissionResult.selectedFeedback[activeQuestion]?.[index]) && (
                        <ul>
                          {submissionResult.selectedFeedback[activeQuestion]?.[index]?.map((feedback, feedbackIndex) => (
                            <li key={feedbackIndex}>{feedback}</li>
                          ))}
                        </ul>
                      )}
                      {typeof submissionResult.selectedFeedback[activeQuestion]?.[index] === 'string' && (
                        <div>{submissionResult.selectedFeedback[activeQuestion]?.[index]}</div>
                      )}
                    </li>
                  ))}

                  </ul>


                    
                  </div>
                </div>



              </div>
            </div>
          )}
        </div>
      </div>
    );
};

export default PracQuiz;