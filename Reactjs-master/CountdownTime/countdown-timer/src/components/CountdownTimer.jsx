import React, { useState, useEffect, useRef } from 'react';

const CountdownTimer = () => {
  const [inputMinutes, setInputMinutes] = useState(5); // 
  const [timeLeft, setTimeLeft] = useState(0); // giây
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSetTimer = () => {
    const totalSeconds = Math.max(0, parseInt(inputMinutes)) * 60;
    setTimeLeft(totalSeconds);
    setIsRunning(false); 
  };

  return (
    <div>
      <h1>⏳ Countdown Timer</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="number"
          min="0"
          value={inputMinutes}
          onChange={(e) => setInputMinutes(e.target.value)}
          style={{ padding: '8px', fontSize: '1rem', width: '80px', textAlign: 'center', marginRight: '10px' }}
        />
        <button onClick={handleSetTimer}>Set Timer</button>
      </div>
      <div className="timer">{formatTime(timeLeft)}</div>
      <div>
        <button onClick={() => setIsRunning(true)}>Start</button>
        <button onClick={() => setIsRunning(false)}>Pause</button>
        <button onClick={() => {
          setIsRunning(false);
          setTimeLeft(0);
        }}>Reset</button>
      </div>
    </div>
  );
};

export default CountdownTimer;
