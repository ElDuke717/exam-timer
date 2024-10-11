// History.js
import React, { useEffect, useState } from "react";

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const examHistory = JSON.parse(localStorage.getItem("examHistory")) || [];
    setHistory(examHistory);
  }, []);

  const handleDelete = (index) => {
    const updatedHistory = [...history];
    updatedHistory.splice(index, 1);
    setHistory(updatedHistory);
    localStorage.setItem("examHistory", JSON.stringify(updatedHistory));
  };

  // Helper function to format timeTaken (milliseconds) to HH:MM:SS
  const formatTimeTaken = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${padZero(hrs)}:${padZero(mins)}:${padZero(secs)}`;
  };

  // Helper function to format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${padZero(mins)}:${padZero(secs)}`;
  };

  const padZero = (num) => (num < 10 ? "0" + num : num);

  // Function to export history as CSV
  const exportHistory = () => {
    if (history.length === 0) {
      alert("No history data to export.");
      return;
    }

    const headers = [
      "Exam Title",
      "Date",
      "Time Taken (HH:MM:SS)",
      "Time Left (MM:SS)",
      "Average Question Time (MM:SS)",
    ];
    const rows = history.map((exam) => [
      `"${exam.examTitle}"`, // Handle commas in examTitle
      `"${exam.date}"`,
      formatTimeTaken(exam.timeTaken),
      formatTime(exam.timeLeft),
      formatTime(Math.floor(exam.averageQuestionTime)),
    ]);

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    link.setAttribute("download", `exam_history_${timestamp}.csv`);
    document.body.appendChild(link); // Required for Firefox

    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="history-container">
      <h2>Exam History</h2>
      {/* Export History Button */}
      <button className="export-history-button" onClick={exportHistory}>
        Export History
      </button>
      {history.length === 0 ? (
        <p>No exam history available.</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Exam Title</th>
              <th>Date</th>
              <th>Time Taken (HH:MM:SS)</th>
              <th>Time Left (MM:SS)</th>
              <th>Average Question Time (MM:SS)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((exam, index) => (
              <tr key={index}>
                <td>{exam.examTitle}</td>
                <td>{exam.date}</td>
                <td>{formatTimeTaken(exam.timeTaken)}</td>
                <td>{formatTime(exam.timeLeft)}</td>
                <td>{formatTime(Math.floor(exam.averageQuestionTime))}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default History;
