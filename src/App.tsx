import React, { useState, useEffect } from "react";
import { fetchQuizQuestions } from "./API";
import QuestionCart from "./components/QuestionCart";
import { QuestionsState, Difficulty } from "./API";
import { Player } from "@lottiefiles/react-lottie-player";

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
  const [timer, setTimer] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [quizOver, setQuizOver] = useState(false);
  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);
    setTimerRunning(true);
    setTimer(60);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setQuizOver(false);
    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );
    setQuestions(newQuestions);
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
    if (nextQ === TOTAL_QUESTIONS || timer === 0) {
      setGameOver(true);
      setTimerRunning(false);
      setQuizOver(true);
      if (userAnswers.length === TOTAL_QUESTIONS) {
        setAllQuestionsAnswered(true);
      }
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
      setQuizOver(true);
      if (userAnswers.length === TOTAL_QUESTIONS) {
        setAllQuestionsAnswered(true);
      }
    }

    return () => clearTimeout(countdown);
  }, [timer, timerRunning, userAnswers.length]);

  const startOver = () => {
    setQuizOver(false);
  };

  return (
    <main className=" w-screen h-screen overflow-x-hidden overflow-y-scroll flex justify-center items-center flex-col bg-gray-100 ">
      <header className="text-2xl font-bold my-6 sm:text-5xl md:text-6xl xl:text-7xl">
        <h1 className=" text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
          #QUIZ
        </h1>
      </header>
      <section className="w-[90%] sm:w-[80%] md:w-[75%] lg:w-[65%] bg-white p-5  sm:p-8 lg:p-12 rounded-md shadow-xl flex flex-col justify-center sm:gap-2 md:gap-4 lg:gap-6 ">
        {(gameOver || userAnswers.length === TOTAL_QUESTIONS) && !quizOver && (
          <>
            <h3 className="text-base font-medium underline text-center my-2 sm:text-lg md:text-xl lg:text-2xl">
              Welcome to the Quiz Demo!
            </h3>
            <ul className="text-sm list-disc md:text-lg lg:text-xl">
              <li>
                Read each question carefully and choose the correct answer by
                clicking on the corresponding option. You have a total of 1
                minute to complete the quiz.
              </li>
              <li>
                The timer will be displayed on the screen, indicating the time
                remaining. If you do not submit all the answers within 1 minute,
                the quiz will be automatically submitted.
              </li>
              <li>At the end of the quiz, your final score will be shown.</li>
              <li>To start the quiz, Hit that "Start" button.</li>
            </ul>
            <button
              className="bg-black text-white px-5 py-1 rounded-md hover:bg-gray-900 font-thin transition-all duration-300 mx-auto md:text-xl lg:text-2xl"
              onClick={startTrivia}
            >
              Start
            </button>
          </>
        )}

        {allQuestionsAnswered && !timerRunning && quizOver && (
          <>
            <Player
              src="https://assets6.lottiefiles.com/packages/lf20_touohxv0.json"
              className="player w-[200px] md:w-[300px]"
              loop
              autoplay
            />
            <p className="text-3xl md:text-4xl lg:text-6xl text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Final Score: {score}
            </p>
            <button
              className="bg-black text-white px-5 py-1 rounded-md hover:bg-gray-900 font-thin transition-all duration-300 mx-auto md:text-xl lg:text-2xl"
              onClick={startOver}
            >
              Start over
            </button>
          </>
        )}

        {loading && (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1  space-y-6 py-1">
              <div className="h-10 bg-slate-300 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-6 bg-slate-300 rounded col-span-4"></div>
                  <div className="h-6 bg-slate-300 rounded col-span-4"></div>
                  <div className="h-6 bg-slate-300 rounded col-span-4"></div>
                  <div className="h-6 bg-slate-300 rounded col-span-4"></div>
                </div>
                <div className="h-4 w-[30%] mx-auto bg-slate-300 rounded"></div>
              </div>
            </div>
          </div>
        )}
        {!loading && !gameOver && timerRunning ? (
          <span className="font-semibold text-sm mx-2 md:text-lg lg:text-xl">
            Time remaining: <span className="font-bold">{timer} </span>
          </span>
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
            <button
              className="bg-black text-white px-5 py-1 rounded-md hover:bg-gray-900 font-thin transition-all duration-300 mx-auto md:text-xl lg:text-2xl"
              onClick={nextQuestion}
            >
              Next Question
            </button>
          )}
      </section>
    </main>
  );
};

export default App;
