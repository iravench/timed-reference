// File: src/components/Session.tsx

import React, { useState, useEffect, useRef } from 'react';
import './Session.css';

const Session: React.FC = () => {
  const [timer, setTimer] = useState<number>(30);
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [isSessionStarted, setIsSessionStarted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const timerRef = useRef<number | null>(null);

  const updatedTimerDurations = [15, 30, 45, 60, 90];

  useEffect(() => {
    setTimer(updatedTimerDurations[0]);
    setSelectedDuration(updatedTimerDurations[0]);
  }, []);

  useEffect(() => {
    if (isSessionStarted && !isPaused && timer > 0) {
      timerRef.current = window.setInterval(() => {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);
    } else if (isSessionStarted && timer === 0) {
      handleTimerEnd();
    } else {
      clearInterval(timerRef.current!);
    }

    return () => {
      clearInterval(timerRef.current!);
    };
  }, [isSessionStarted, isPaused, timer]);

  const handleStartSession = () => {
    if (imageUrls.length > 0) {
      setIsSessionStarted(true);
      setIsPaused(false);
      setCurrentImageIndex(getRandomImageIndex());
      setTimer(selectedDuration);
    }
  };

  const handlePauseSession = () => {
    if (isSessionStarted) {
      setIsPaused(true);
    }
  };

  const handleResumeSession = () => {
    if (isSessionStarted && isPaused) {
      setIsPaused(false);
    }
  };

  const handleStopSession = () => {
    if (isSessionStarted) {
      clearInterval(timerRef.current!);
      setIsSessionStarted(false);
      setTimer(updatedTimerDurations[0]);
      setSelectedDuration(updatedTimerDurations[0]);
      setIsPaused(false);
      setCurrentImageIndex(0);
    }
  };

  const getRandomImageIndex = () => {
    return Math.floor(Math.random() * imageUrls.length);
  };

  const handleTimerDurationChange = (duration: number) => {
    setTimer(duration);
    setSelectedDuration(duration);
  };

  const handleImageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      const newImageUrls: string[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const imageUrl = URL.createObjectURL(fileList[i]);
        newImageUrls.push(imageUrl);
      }
      setImageUrls(newImageUrls);
    }
  };

  const handleTimerEnd = () => {
    setCurrentImageIndex(getRandomImageIndex());
    setTimer(selectedDuration);
  };

  return (
    <div className="session-container">
      <div className="sidebar">
        <h2>Reference Timer</h2>
        <div className="timer-settings">
          <label>Select duration:</label>
          <div>
            {updatedTimerDurations.map((duration) => (
              <button
                key={duration}
                onClick={() => handleTimerDurationChange(duration)}
                className={selectedDuration === duration ? 'selected' : ''}
              >
                {duration} seconds
              </button>
            ))}
          </div>
        </div>
        <div>
          <input type="file" onChange={handleImageInputChange} multiple className="file-input" />
        </div>
        {isSessionStarted && (
          <div className="timer-countdown">
            <p>{timer > 0 && `Countdown: ${timer}s`}</p>
          </div>
        )}
        <div className="button-container">
          {!isSessionStarted && (
            <button onClick={handleStartSession} disabled={imageUrls.length === 0 || isSessionStarted}>
              Start Session
            </button>
          )}
          {isSessionStarted && (
            <>
              {!isPaused && (
                <>
                  <button onClick={handlePauseSession} disabled={!isSessionStarted || isPaused || timer === 0}>
                    Pause Session
                  </button>
                  <button onClick={handleStopSession} disabled={!isSessionStarted || timer === 0}>
                    Stop Session
                  </button>
                </>
              )}
              {isPaused && (
                <button onClick={handleResumeSession} disabled={!isSessionStarted || !isPaused || timer === 0}>
                  Resume Session
                </button>
              )}
            </>
          )}
        </div>
      </div>
      {isSessionStarted && (
        <div className="image-container">
          {imageUrls.length > 0 && (
            <img
              src={imageUrls[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Session;
