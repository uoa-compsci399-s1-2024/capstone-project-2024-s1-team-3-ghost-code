import "./CreatingQuiz.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export function Answers() {
  //   for (let index = 0; index < array.length; index++) {
  //     const element = array[index];
  //   }
  return (
    <>
      <li className="input-feild-answers">
        <input
          type="text radio"
          className="input-box-answers"
          id="createanswer"
          for="a"
          required
          placeholder="Add an Answer Option"
        />
      </li>
      {/* <div className="input-feild-feedback">
        <input
          type="text"
          className="input-box-answers"
          id="createquestion"
          placeholder="Add Feedback if Applicable"
          required
        />
      </div> */}
    </>
  );
}
export default function QuizCreation() {
  //   const count = videos.length;
  //   let heading = emptyHeading;
  //   if (count > 0) {
  //     const noun = count > 1 ? "Videos" : "Video";
  //     heading = count + " " + noun;
  //   }
  return (
    <>
      <div className="question-container">
        <div className="input-field-question">
          <input
            type="text"
            className="input-box-question"
            id="createquestion"
            placeholder="Question"
            required
          />
        </div>
        <ul>
          <Answers />
          <Answers />
        </ul>
      </div>
    </>
  );
}
