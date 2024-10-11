// QuestionTimer.js
import React, { useState, useEffect, useRef } from 'react';
import alarmSound from '../assets/alarm.mp3';

function QuestionTimer({ defaultDuration, onQuestionReset }) { // Added onQuestionReset prop
  const [timeRemaining, setTimeRemaining] = useState(defaultDuration);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);
  const resetTimeoutRef = useRef(null);
  const previousTimeRemaining = useRef(timeRemaining);

  // Update timer every second
  useEffect(() => {
    // Clear any existing intervals
    clearInterval(timerRef.current);

    if (isRunning && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }

    // Cleanup on unmount or when dependencies change
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeRemaining]);

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

      // Change the background color
      document.body.style.backgroundColor = '#ffcccc'; // Light red

      // Automatically reset the timer after 5 seconds
      resetTimeoutRef.current = setTimeout(() => {
        resetTimer();
        document.body.style.backgroundColor = ''; // Reset background color
      }, 5000);
    }

    // Update the previous time remaining
    previousTimeRemaining.current = timeRemaining;

    // Cleanup on unmount or when dependencies change
    return () => {
      clearTimeout(resetTimeoutRef.current);
    };
  }, [timeRemaining, isRunning]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'r' || e.key === 'R') {
        resetTimer();
      } else if (e.key === 's' || e.key === 'S') {
        startTimer();
      } else if (e.key === 'e' || e.key === 'E') {
        pauseTimer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    if (onQuestionReset) {
      onQuestionReset(timeRemaining); // Report time left before resetting
    }
    setTimeRemaining(defaultDuration);
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${padZero(mins)}:${padZero(secs)}`;
  };

  const padZero = (num) => (num < 10 ? '0' + num : num);

  return (
    <div className="question-timer">
      <h2>Question Timer</h2>
      <p className='question-time-remaining'>{formatTime(timeRemaining)}</p>
      <p>Press 'S' to Start, 'E' to Pause, 'R' to Reset</p>
      <div>
        <button className="start-button" onClick={startTimer}>Start</button>
        <button className="pause-button" onClick={pauseTimer}>Pause</button>
        <button className="reset-button" onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
}

export default QuestionTimer;