import React, { useState, useEffect } from 'react';
import './PracQuiz.css';
import redaxios from 'redaxios';
import {Link, useNavigate, useParams } from 'react-router-dom';

const PracQuiz = () => {
  const { quizID, moduleID } = useParams();
  const [questions, setQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const cliniciantoken = sessionStorage.getItem('cliniciantoken');
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });

  const [userID, setUserID] = useState(null);

  
  useEffect(() => {
    const fetchClinicianData = async () => {
      try {
        const clinicianResponse = await redaxios.get('http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/auth/GetCurrentClinician', {
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
        const response = await redaxios.post('http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/GetQuizQs', {
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
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    
    if (userID !== null) {  
      fetchQuestions();
    }
  }, [userID,quizID,moduleID]);


  const onClickNext = () => {
    const currentQuestion = questions[activeQuestion];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    setResult((prev) => ({
      ...prev,
      score: isCorrect ? prev.score + 5 : prev.score,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      wrongAnswers: !isCorrect ? prev.wrongAnswers + 1 : prev.wrongAnswers
    }));

    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const onAnswerSelected = (answer, index) => {
    setSelectedAnswer(answer);
    setSelectedAnswerIndex(index);
  };

  const addLeadingZero = (number) => (number > 9 ? number : `0${number}`);

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }
 
  const { title, answers } = questions[activeQuestion];

  return (
    <div className="quiz-container">
      {!showResult ? (
        <div>
          <div>

          <div className="cont-return-but">
          <Link to="/quizDashboard" style={{ textDecoration: "none" }}>
          <button className="btn return-button">Back to Modules</button>
          </Link>
          </div>
            
          <h2>Module 1: TMS Overview</h2>
          
          <div className='cont-question'>
          <div className="button-container">
            {activeQuestion !== 0 && (
              <button onClick={() => setActiveQuestion((prev) => prev - 1)} className="btn prev-ques">Previous</button>
            )}



            <button onClick={onClickNext} disabled={selectedAnswerIndex === null} className="btn next-ques">
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
                onClick={() => onAnswerSelected(answer.answerText, index)}
                key={answer.answerID}
                className={selectedAnswerIndex === index ? 'selected-answer' : null}>
                {answer.answerText}
              </li>
            ))}
          </ul>
          </div>
          </div>
          </div>

        </div>
      ) : (
        <div className='cont-feedback'>
          <div className="cont-return-but">
            <button className="btn return-button">Back to Modules</button>
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

          <div className='feeback-qs'>
            {/*individual questions here for feedback, along with blurb at the bottom of each*/}
          </div>

        </div>


      )}
    </div>
  );
};

export default PracQuiz;