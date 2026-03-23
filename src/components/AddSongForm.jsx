import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import '../styles/AddSongForm.css';

const AddSongForm = ({ onAddSong }) => {
  const [showForm, setShowForm] = useState(false);
  const [songData, setSongData] = useState({
    title: '',
    artist: '',
    category: '',
    url: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (songData.title && songData.artist && songData.url) {
      onAddSong(songData);
      setSongData({ title: '', artist: '', category: '', url: '' });
      setShowForm(false);
    } else {
      alert('Please fill in all required fields (Title, Artist, and MP3 file)');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'audio/mpeg' || file.type === 'audio/mp3') {
        const url = URL.createObjectURL(file);
        setSongData({ ...songData, url });
      } else {
        alert('Please upload a valid MP3 file (format: .mp3 or .mpeg)');
      }
    }
  };

  return (
    <div className="add-song-form">
      {!showForm ? (
        <button className="add-song-btn" onClick={() => setShowForm(true)}>
          <FaPlus /> Add New Song
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="song-form">
          <h3>Add New Song</h3>
          <input
            type="text"
            placeholder="Song Title *"
            value={songData.title}
            onChange={(e) => setSongData({ ...songData, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Artist Name *"
            value={songData.artist}
            onChange={(e) => setSongData({ ...songData, artist: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Category (e.g., Rock, Pop, Jazz)"
            value={songData.category}
            onChange={(e) => setSongData({ ...songData, category: e.target.value })}
          />
          <div className="file-upload">
            <input
              type="file"
              accept=".mp3,.mpeg"
              onChange={handleFileUpload}
              required
            />
            <small>Supported: MP3 files only</small>
            {songData.url && <small style={{ color: 'green' }}> ✓ File loaded</small>}
          </div>
          <div className="form-buttons">
            <button type="submit" className="submit-btn">Add Song</button>
            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddSongForm;