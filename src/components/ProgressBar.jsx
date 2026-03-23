import React from 'react';
import '../styles/ProgressBar.css';

const ProgressBar = ({ currentTime, duration, onSeek }) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    onSeek(newTime);
  };

  return (
    <div className="progress-bar-container" onClick={handleSeek}>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
        <div className="progress-handle" style={{ left: `${progress}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;