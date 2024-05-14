import React, { useState, useEffect } from 'react';
import './PracQuiz.css';
import redaxios from 'redaxios';

const PracQuiz = () => {
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


  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await redaxios.post('http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/GetQuizQs', {
          quizID: 1, // Replace with the actual quizID
          userID: 1, // Replace with the actual userID
          moduleID: 1, // Replace with the actual moduleID
        }, {
          headers: {
            "Authorization": `Bearer ${cliniciantoken}` // Include token in headers
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = response.data; // Assuming response is in the format { data: [...] }
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  const onAnswerSelected = (answer, index) => {
    const currentQuestion = questions[activeQuestion];
    if (currentQuestion.questionType === 1) {
      // Single selection question
      setSelectedAnswers([answer]);
      setSelectedAnswerIndexes([index]);
    } else if (currentQuestion.questionType === 2) {
      // Multiple selection question
      if (selectedAnswerIndexes.includes(index)) {
        setSelectedAnswers((prev) => prev.filter((ans) => ans !== answer));
        setSelectedAnswerIndexes((prev) => prev.filter((idx) => idx !== index));
      } else {
        setSelectedAnswers((prev) => [...prev, answer]);
        setSelectedAnswerIndexes((prev) => [...prev, index]);
      }
    }
  };

  const onClickNext = () => {
    const currentQuestion = questions[activeQuestion];
    const isCorrect = selectedAnswers.includes(currentQuestion.correctAnswer);
    
    setResult((prev) => ({
      ...prev,
      score: isCorrect ? prev.score + 5 : prev.score,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      wrongAnswers: !isCorrect ? prev.wrongAnswers + 1 : prev.wrongAnswers
    }));

    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
      setSelectedAnswers([]);
      setSelectedAnswerIndexes([]);
    } else {
      setShowResult(true);
    }
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
            <span className="active-question-no">{addLeadingZero(activeQuestion + 1)}</span>
            <span className="total-question">/{addLeadingZero(questions.length)}</span>
          </div>
          <h2>{title}</h2>
          <ul>
            {answers.map((answer, index) => (
              <li
                onClick={() => onAnswerSelected(answer.answerText, index)}
                key={answer.answerID}
                className={selectedAnswerIndexes.includes(index) ? 'selected-answer' : null}>
                {answer.answerText}
              </li>
            ))}
          </ul>
          <div className="button-container">
            {activeQuestion !== 0 && (
              <button onClick={() => setActiveQuestion((prev) => prev - 1)}>Previous</button>
            )}
            <button onClick={onClickNext} disabled={selectedAnswerIndexes.length === 0}>
              {activeQuestion === questions.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      ) : (
        <div className="result">
          <h3>Result</h3>
          <p>
            Total Question: <span>{questions.length}</span>
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
      )}
    </div>
  );
};

export default PracQuiz;