import React, { useState, useEffect } from 'react';
import './PracQuiz.css';
import redaxios from 'redaxios';

const PracQuiz = () => {
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

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await redaxios.post('http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/GetQuizQs', {
          quizID: 1, // Replace with the actual quizID
          userID: 1, // Replace with the actual userID
          moduleID: 1 // Replace with the actual moduleID
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
          <div className="flex-right">
            <button onClick={onClickNext} disabled={selectedAnswerIndex === null}>
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
