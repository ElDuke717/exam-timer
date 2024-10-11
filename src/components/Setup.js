import React, { useState } from "react";
import "./Setup.css"; // Import the CSS file

function Setup({ onStart }) {
  const [examTitle, setExamTitle] = useState("");
  const [mainDuration, setMainDuration] = useState("70");
  const [questionDuration, setQuestionDuration] = useState("2");

  const handleSubmit = (e) => {
    e.preventDefault();

    const mainDur = parseInt(mainDuration, 10);
    const questionDur = parseInt(questionDuration, 10);

    if (isNaN(mainDur) || mainDur <= 0) {
      alert("Please enter a valid main exam duration greater than 0.");
      return;
    }

    if (isNaN(questionDur) || questionDur <= 0) {
      alert("Please enter a valid question timer duration greater than 0.");
      return;
    }

    onStart({
      examTitle,
      mainDuration: mainDur * 60, // Convert minutes to seconds
      questionDuration: questionDur * 60, // Convert minutes to seconds
    });
  };

  return (
    <div className="setup">
      <h2>Exam Setup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="examTitle">Exam Title:</label>
          <input
            id="examTitle"
            type="text"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="mainDuration">Main Exam Duration (minutes):</label>
          <input
            id="mainDuration"
            type="number"
            value={mainDuration}
            onChange={(e) => setMainDuration(e.target.value)}
            required
            min="1"
          />
        </div>
        <div className="form-group">
          <label htmlFor="questionDuration">
            Question Timer Duration (minutes):
          </label>
          <input
            id="questionDuration"
            type="number"
            value={questionDuration}
            onChange={(e) => setQuestionDuration(e.target.value)}
            required
            min="1"
          />
        </div>
        <button className="start-button" type="submit">Start Exam</button>
      </form>
    </div>
  );
}

export default Setup;
