import React, { useState, useEffect } from "react";
import { fetchQuizQuestions } from "./API";
// Components
import QuestionCart from "./components/QuestionCart";
// types
import { QuestionsState, Difficulty } from "./API";

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const TOTAL_QUESTIONS = 3;

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionsState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [timer, setTimer] = useState(20); // Timer set to 60 seconds
  const [timerRunning, setTimerRunning] = useState(false);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);
    setTimerRunning(true);
    setTimer(20);
    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );
    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: any) => {
    if (!gameOver) {
      const answer = e.currentTarget.value;
      const correct = questions[number].correct_answer === answer;
      if (correct) setScore((prev) => prev + 1);
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    const nextQ = number + 1;
    if (nextQ === TOTAL_QUESTIONS) {
      setGameOver(true);
      setTimerRunning(false);
    } else {
      setNumber(nextQ);
    }
  };

  useEffect(() => {
    let countdown = 0;

    if (timerRunning) {
      countdown = setTimeout(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    if (timer === 0 || userAnswers.length === TOTAL_QUESTIONS) {
      clearTimeout(countdown);
      setTimerRunning(false);
      setGameOver(true);
    }

    return () => clearTimeout(countdown);
  }, [timer, timerRunning, userAnswers.length]);

  return (
    <>
      <h1>QUIZ</h1>

      {(gameOver || userAnswers.length === TOTAL_QUESTIONS) && (
        <button className="start" onClick={startTrivia}>
          Start
        </button>
      )}
      {gameOver && !loading && <p className="score">Final Score: {score}</p>}

      {loading && <p>Loading Questions...</p>}
      {!loading && !gameOver && timerRunning ? (
        <p>Time remaining: {timer} seconds</p>
      ) : null}
      {!(userAnswers.length === TOTAL_QUESTIONS) && !loading && !gameOver && (
        <QuestionCart
          questionNr={number + 1}
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        />
      )}
      {!gameOver &&
        !loading &&
        userAnswers.length === number + 1 &&
        number !== TOTAL_QUESTIONS - 1 && (
          <button className="next" onClick={nextQuestion}>
            Next Question
          </button>
        )}
    </>
  );
};

export default App;
