import React, { useState } from 'react';
import PlaylistItem from './PlaylistItem';
import '../styles/Playlist.css';

const Playlist = ({ 
  songs, 
  currentSong, 
  onPlaySong, 
  onRemoveSong, 
  onRenameSong, 
  onReorderSongs,
  onClearPlaylist,
  isPlaying 
}) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem !== null && draggedItem !== index) {
      setDragOverItem(index);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === dropIndex) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const reorderedSongs = [...songs];
    const [draggedSong] = reorderedSongs.splice(draggedItem, 1);
    reorderedSongs.splice(dropIndex, 0, draggedSong);
    
    onReorderSongs(reorderedSongs);
    
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverItem(null);
  };

  // Format duration if available (you can add this feature later)
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="playlist">
      <div className="playlist-header">
        <h2>Playlist</h2>
        <div className="playlist-stats">
          <span className="song-count">{songs.length} songs</span>
          {songs.length > 0 && (
            <span className="total-duration">
              Total: {formatDuration(songs.reduce((acc, song) => acc + (song.duration || 0), 0))}
            </span>
          )}
        </div>
      </div>
      
      <div className="playlist-items">
        {songs.length === 0 ? (
          <div className="empty-playlist">
            <div className="empty-icon">🎵</div>
            <p>No songs in playlist</p>
            <p>Click "Add New Song" to get started!</p>
            <p className="hint">You can upload MP3 files or use the sample songs</p>
          </div>
        ) : (
          <div className="playlist-grid">
            {/* <div className="playlist-header-row">
              <span className="header-play">#</span>
              <span className="header-title">Title</span>
              <span className="header-artist">Artist</span>
              <span className="header-category">Category</span>
              <span className="header-actions">Actions</span>
            </div> */}
            {songs.map((song, index) => (
              <PlaylistItem
                key={song.id}
                song={song}
                index={index}
                isPlaying={currentSong?.id === song.id && isPlaying}
                isCurrentSong={currentSong?.id === song.id}
                onPlay={() => onPlaySong(song)}
                onRemove={() => onRemoveSong(song.id)}
                onRename={(newTitle) => onRenameSong(song.id, newTitle)}
                draggableProps={{
                  draggable: true,
                  onDragStart: (e) => handleDragStart(e, index),
                  onDragOver: (e) => handleDragOver(e, index),
                  onDrop: (e) => handleDrop(e, index),
                  onDragEnd: handleDragEnd,
                  onDragLeave: handleDragLeave,
                  className: dragOverItem === index ? 'drag-over' : ''
                }}
              />
            ))}
          </div>
        )}
      </div>

      {songs.length > 0 && (
        <div className="playlist-footer">
          <div className="playlist-info">
            <span>📀 {songs.length} track{songs.length !== 1 ? 's' : ''}</span>
            <span>🎵 {new Set(songs.map(s => s.category).filter(Boolean)).size} categories</span>
          </div>
          <div className="playlist-actions">
            <button 
              className="clear-playlist-btn"
              onClick={onClearPlaylist}
            >
              🗑️ Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlist;