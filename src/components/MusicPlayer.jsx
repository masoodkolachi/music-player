import React, { useEffect, useRef } from "react";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaMusic,
} from "react-icons/fa";
import VolumeControl from "./VolumeControl";
import ProgressBar from "./ProgressBar";
import "../styles/MusicPlayer.css";

const MusicPlayer = ({
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  volume,
  onVolumeChange,
  currentTime,
  duration,
  onTimeUpdate,
  onDurationChange,
  onSeek,
}) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      onTimeUpdate(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      onDurationChange(audioRef.current.duration);
    }
  };

  const handleSeek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      onSeek(time);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        src={currentSong?.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onNext}
      />

      <div className="player-content">
        <div className="song-info">
          <div className="song-icon">
            <FaMusic />
          </div>
          <div className="song-details">
            <h3 className="song-title">{currentSong?.title}</h3>
            <p className="song-artist">{currentSong?.artist}</p>
          </div>
        </div>

        <div className="player-controls">
          <div className="control-buttons">
            <button className="control-btn" onClick={onPrevious}>
              <FaStepBackward />
            </button>
            <button className="control-btn play-btn" onClick={onPlayPause}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button className="control-btn" onClick={onNext}>
              <FaStepForward />
            </button>
          </div>

          <div className="progress-section">
            <span className="time">{formatTime(currentTime)}</span>
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
            />
            <span className="time">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="volume-control">
          <VolumeControl volume={volume} onVolumeChange={onVolumeChange} />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
