import React from "react";
import { AnswerObject } from "../App";

type Props = {
  question: string;
  answers: string[];
  callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
  userAnswer: AnswerObject | undefined;
  questionNr: number;
  totalQuestions: number;
};

const QuestionCart: React.FC<Props> = ({
  question,
  answers,
  callback,
  userAnswer,
  questionNr,
  totalQuestions,
}) => (
  <>
    <span className="font-semibold text-sm mx-2 md:text-lg lg:text-xl">
      Question: {questionNr} / {totalQuestions}
    </span>
    <p
      className="text-lg font-bold md:text-xl lg:2xl" 
      dangerouslySetInnerHTML={{ __html: question }}
    />
    <div className="flex flex-col gap-2 my-3">
      {answers.map((answer) => (
        <div
          key={answer}
          className="bg-blue-600 text-center text-white font-medium hover:bg-blue-500  text-base  rounded-2xl py-2  my-1 md:text-lg lg:text-xl" 
        >
          <button
            disabled={userAnswer ? true : false}
            value={answer}
            onClick={callback}
            className="w-full"
          >
            <span dangerouslySetInnerHTML={{ __html: answer }} />
          </button>
        </div>
      ))}
    </div>
  </>
);

export default QuestionCart;
