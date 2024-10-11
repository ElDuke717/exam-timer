// App.js
import React, { useState } from "react";
import Setup from "./components/Setup";
import History from "./components/History";
import MainTimer from "./components/MainTimer";
import QuestionTimer from "./components/QuestionTimer";
// Import other necessary components and styles

function App() {
  const [examStarted, setExamStarted] = useState(false);
  const [examData, setExamData] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null); // Tracks MainTimer's time left
  const [questionTimes, setQuestionTimes] = useState([]); // Tracks QuestionTimer resets

  const handleStartExam = (data) => {
    setExamData({ ...data, startTime: Date.now() });
    setExamStarted(true);
    localStorage.setItem(
      "currentExam",
      JSON.stringify({ ...data, startTime: Date.now() })
    );
  };

  const handleGoBackToSetup = () => {
    setIsConfirmModalOpen(true);
  };

  const confirmGoBackToSetup = () => {
    setExamStarted(false);
    setExamData(null);
    localStorage.removeItem("currentExam");
    setIsConfirmModalOpen(false);
    setTimeLeft(null);
    setQuestionTimes([]); // Reset question times
  };

  const cancelGoBackToSetup = () => {
    setIsConfirmModalOpen(false);
  };

  const handleFinishAndSave = () => {
    if (!examData) {
      alert("No exam data to save.");
      return;
    }

    const examTitle = examData.examTitle;
    const finishTime = new Date().toLocaleString();
    const timeTaken = Date.now() - examData.startTime;
    const remainingTime = timeLeft; // MainTimer's remaining time

    // Calculate average question time in seconds
    const totalQuestionTime = questionTimes.reduce(
      (acc, curr) => acc + curr,
      0
    );
    const averageQuestionTime =
      questionTimes.length > 0 ? totalQuestionTime / questionTimes.length : 0;

    const newHistoryEntry = {
      examTitle,
      date: finishTime,
      timeTaken,
      timeLeft: remainingTime,
      averageQuestionTime, // Add average question time
    };

    const existingHistory =
      JSON.parse(localStorage.getItem("examHistory")) || [];
    const updatedHistory = [...existingHistory, newHistoryEntry];
    localStorage.setItem("examHistory", JSON.stringify(updatedHistory));

    // Provide feedback to the user
    alert("Exam finished and saved to history.");

    // Reset exam state
    setExamStarted(false);
    setExamData(null);
    setTimeLeft(null);
    setQuestionTimes([]);
  };

  // Callback to update timeLeft from MainTimer
  const updateTimeLeft = (remaining) => {
    setTimeLeft(remaining);
  };

  // Callback to record question time left from QuestionTimer
  const handleQuestionReset = (timeLeft) => {
    setQuestionTimes((prevTimes) => [...prevTimes, timeLeft]);
  };

  return (
    <div className="App">
      <h1>Exam Timer App</h1>
      {!examStarted ? (
        <>
          <Setup onStart={handleStartExam} />
          <History />
        </>
      ) : (
        <div className="timers-container">
          <h2>{examData.examTitle}</h2>
          <MainTimer
            duration={examData.mainDuration}
            onTimeUpdate={updateTimeLeft} // Pass the callback
          />
          <QuestionTimer
            defaultDuration={examData.questionDuration}
            onQuestionReset={handleQuestionReset} // Pass the callback
          />
          {/* Button to go back to Setup */}
          <button className="back-to-setup" onClick={handleGoBackToSetup}>
            Back to Setup
          </button>
          {/* Finish and Save Button */}
          <button className="finish-and-save" onClick={handleFinishAndSave}>
            Finish and Save
          </button>
        </div>
      )}

      {isConfirmModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>
              Are you sure you want to reset the timer and go back to setup?
            </p>
            <button onClick={confirmGoBackToSetup} className="reset-button">
              Confirm
            </button>
            <button
              onClick={cancelGoBackToSetup}
              className="modal-close-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
