import React from 'react';
import { FaVolumeUp, FaVolumeDown, FaVolumeMute } from 'react-icons/fa';
import '../styles/VolumeControl.css';

const VolumeControl = ({ volume, onVolumeChange }) => {
  const getVolumeIcon = () => {
    if (volume === 0) return <FaVolumeMute />;
    if (volume < 50) return <FaVolumeDown />;
    return <FaVolumeUp />;
  };

  const handleVolumeChange = (e) => {
    onVolumeChange(parseInt(e.target.value));
  };

  const toggleMute = () => {
    if (volume > 0) {
      onVolumeChange(0);
    } else {
      onVolumeChange(70);
    }
  };

  return (
    <div className="volume-control">
      <button className="volume-icon" onClick={toggleMute}>
        {getVolumeIcon()}
      </button>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
        className="volume-slider"
      />
      <span className="volume-value">{volume}%</span>
    </div>
  );
};

export default VolumeControl;