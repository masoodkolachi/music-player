import React, { useState } from 'react';
import { FaPlay, FaPause, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import '../styles/PlaylistItem.css';

const PlaylistItem = ({ song, index, isPlaying, isCurrentSong, onPlay, onRemove, onRename, draggableProps }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(song.title);

  const handleRename = () => {
    if (newTitle.trim() && newTitle !== song.title) {
      onRename(newTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewTitle(song.title);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Pop': '🎤',
      'Rock': '🎸',
      'Jazz': '🎷',
      'Electronic': '🎧',
      'Classical': '🎻',
      'Hip Hop': '🎙️',
      'R&B': '🎵'
    };
    return icons[category] || '🎵';
  };

  return (
    <div 
      className={`playlist-item ${isCurrentSong ? 'current' : ''} ${isPlaying ? 'playing' : ''}`}
      {...draggableProps}
    >
      <div className="item-content">
        <div className="item-index">
          {isCurrentSong && isPlaying ? (
            <div className="playing-animation">
              <span className="wave"></span>
              <span className="wave"></span>
              <span className="wave"></span>
            </div>
          ) : (
            <span className="index-number">{index + 1}</span>
          )}
        </div>

        <button className="play-button" onClick={onPlay} title={isPlaying ? "Pause" : "Play"}>
          {isCurrentSong && isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        
        <div className="song-info">
          {isEditing ? (
            <input
              type="text"
              className="rename-input"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
            />
          ) : (
            <>
              <h4 className="song-title">{song.title}</h4>
              <p className="song-artist">{song.artist}</p>
            </>
          )}
        </div>
        
        <div className="song-meta">
          {song.category && (
            <span className="song-category" title={song.category}>
              {getCategoryIcon(song.category)} {song.category}
            </span>
          )}
          
          {song.duration && (
            <span className="song-duration">
              {Math.floor(song.duration / 60)}:{Math.floor(song.duration % 60).toString().padStart(2, '0')}
            </span>
          )}
          
          <div className="action-buttons">
            {isEditing ? (
              <>
                <button className="action-btn save-btn" onClick={handleRename} title="Save">
                  <FaSave />
                </button>
                <button className="action-btn cancel-btn" onClick={handleCancel} title="Cancel">
                  <FaTimes />
                </button>
              </>
            ) : (
              <>
                <button className="action-btn edit-btn" onClick={() => setIsEditing(true)} title="Rename">
                  <FaEdit />
                </button>
                <button className="action-btn delete-btn" onClick={onRemove} title="Delete">
                  <FaTrash />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistItem;