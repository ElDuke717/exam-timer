// MainTimer.js
import React, { useState, useEffect, useRef } from 'react';
import alarmSound from '../assets/alarm.mp3'; // Import the alarm sound if you want audio alerts

function MainTimer({ duration, onTimeUpdate }) { // Added onTimeUpdate prop
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);
  const previousTimeRemaining = useRef(timeRemaining);

  // Update timer every second
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          onTimeUpdate(newTime); // Report time left
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeRemaining, onTimeUpdate]);

  // Handle time-up logic
  useEffect(() => {
    if (
      isRunning &&
      previousTimeRemaining.current > 0 &&
      timeRemaining === 0
    ) {
      // Timer has just reached zero
      setIsRunning(false);

      // Play the alert sound
      const audio = new Audio(alarmSound);
      audio.play();

      // Change background color
      document.body.style.backgroundColor = '#ffcccc'; // Light red
      setTimeout(() => {
        document.body.style.backgroundColor = '';
      }, 5000); // Reset after 5 seconds

      // Save exam history and clear current exam data
      const endTime = Date.now();
      const examData = JSON.parse(localStorage.getItem('currentExam'));
      const timeTaken = endTime - examData.startTime;
      const examHistory = JSON.parse(localStorage.getItem('examHistory')) || [];
      examHistory.push({
        examTitle: examData.examTitle,
        timeTaken: timeTaken,
        timeLeft: timeRemaining, // Include time left (which is 0 here)
        date: new Date().toLocaleDateString(),
      });
      localStorage.setItem('examHistory', JSON.stringify(examHistory));
      localStorage.removeItem('currentExam');
    }

    // Update previous time remaining
    previousTimeRemaining.current = timeRemaining;
  }, [timeRemaining, isRunning]);

  const startTimer = () => {
    if (timeRemaining > 0 && !isRunning) {
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
  };

  const resetTimer = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setTimeRemaining(duration);
    onTimeUpdate(duration); // Reset time left in parent
    // Reset background color in case it's still changed
    document.body.style.backgroundColor = '';
  };

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${padZero(hrs)}:${padZero(mins)}:${padZero(secs)}`;
  };

  const padZero = (num) => (num < 10 ? '0' + num : num);

  return (
    <div className="main-timer">
      <h2>Main Exam Timer</h2>
      <p className='main-time-remaining'>{formatTime(timeRemaining)}</p>
      <div>
        <button className="start-button" onClick={startTimer}>Start</button>
        <button className="pause-button" onClick={pauseTimer}>Pause</button>
        <button className="reset-button" onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
}

export default MainTimer;