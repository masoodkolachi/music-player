import React, { useState, useEffect } from "react";
import MusicPlayer from "./components/MusicPlayer";
import Playlist from "./components/PlayList";
import SearchBar from "./components/SearchBar";
import VolumeControl from "./components/VolumeControl";
import CategoryFilter from "./components/CategoryFilter";
import AddSongForm from "./components/AddSongForm";
import useLocalStorage from "./hooks/useLocalStorage";
import "./styles/App.css";

const App = () => {
  const [songs, setSongs] = useLocalStorage("playlist", [
    // Sample songs for testing
    {
      id: 1,
      title: "Sample Song 1 - Happy Melody",
      artist: "SoundHelix",
      category: "Pop",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      addedAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Sample Song 2 - Rock Anthem",
      artist: "SoundHelix",
      category: "Rock",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      addedAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: "Sample Song 3 - Jazz Vibes",
      artist: "SoundHelix",
      category: "Jazz",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      addedAt: new Date().toISOString(),
    },
    {
      id: 4,
      title: "Sample Song 4 - Electronic",
      artist: "SoundHelix",
      category: "Electronic",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      addedAt: new Date().toISOString(),
    },
    {
      id: 5,
      title: "Sample Song 5 - Classical",
      artist: "SoundHelix",
      category: "Classical",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      addedAt: new Date().toISOString(),
    },
  ]);

  const [currentSong, setCurrentSong] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Get unique categories from songs
  const categories = [
    "All",
    ...new Set(songs.map((song) => song.category).filter(Boolean)),
  ];

  // Filter songs based on search and category
  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || song.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddSong = (newSong) => {
    const songWithId = {
      ...newSong,
      id: Date.now(),
      addedAt: new Date().toISOString(),
    };
    setSongs([...songs, songWithId]);
  };

  const handleRemoveSong = (songId) => {
    if (currentSong?.id === songId) {
      setCurrentSong(null);
      setIsPlaying(false);
    }
    setSongs(songs.filter((song) => song.id !== songId));
  };

  const handleRenameSong = (songId, newTitle) => {
    setSongs(
      songs.map((song) =>
        song.id === songId ? { ...song, title: newTitle } : song,
      ),
    );
    if (currentSong?.id === songId) {
      setCurrentSong({ ...currentSong, title: newTitle });
    }
  };

  const handleReorderSongs = (reorderedSongs) => {
    setSongs(reorderedSongs);
  };

  const handlePlaySong = (song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  const handleNext = () => {
    const currentIndex = filteredSongs.findIndex(
      (song) => song.id === currentSong?.id,
    );
    if (currentIndex < filteredSongs.length - 1) {
      setCurrentSong(filteredSongs[currentIndex + 1]);
      setIsPlaying(true);
      setCurrentTime(0);
    } else if (filteredSongs.length > 0) {
      // Loop back to first song
      setCurrentSong(filteredSongs[0]);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  const handlePrevious = () => {
    const currentIndex = filteredSongs.findIndex(
      (song) => song.id === currentSong?.id,
    );
    if (currentIndex > 0) {
      setCurrentSong(filteredSongs[currentIndex - 1]);
      setIsPlaying(true);
      setCurrentTime(0);
    } else if (filteredSongs.length > 0) {
      // Loop to last song
      setCurrentSong(filteredSongs[filteredSongs.length - 1]);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  const handleTimeUpdate = (time) => {
    setCurrentTime(time);
  };

  const handleDurationChange = (dur) => {
    setDuration(dur);
  };

  const handleSeek = (time) => {
    setCurrentTime(time);
  };

  const handleClearPlaylist = () => {
    if (window.confirm("Are you sure you want to clear the entire playlist?")) {
      setSongs([]);
      setCurrentSong(null);
      setIsPlaying(false);
    }
  };

  // Export playlist to JSON file
  const handleExportPlaylist = () => {
    const dataStr = JSON.stringify(songs, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "playlist.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Import playlist from JSON file
  const handleImportPlaylist = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSongs = JSON.parse(e.target.result);
          if (Array.isArray(importedSongs)) {
            setSongs(importedSongs);
            alert("Playlist imported successfully!");
          } else {
            alert("Invalid playlist format");
          }
        } catch (error) {
          alert("Error parsing playlist file");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1>🎵 kolachibeats</h1>
          <p>Your personal music library</p>
          <div className="playlist-actions">
            <button onClick={handleExportPlaylist} className="export-btn">
              📤 Export Playlist
            </button>
            <label className="import-btn">
              📥 Import Playlist
              <input
                type="file"
                accept=".json"
                onChange={handleImportPlaylist}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </header>

        <div className="main-content">
          <div className="sidebar">
            <AddSongForm onAddSong={handleAddSong} />
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          <div className="content">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            <Playlist
              songs={filteredSongs}
              currentSong={currentSong}
              onPlaySong={handlePlaySong}
              onRemoveSong={handleRemoveSong}
              onRenameSong={handleRenameSong}
              onReorderSongs={handleReorderSongs}
              onClearPlaylist={handleClearPlaylist}
              isPlaying={isPlaying}
            />

            {currentSong && (
              <MusicPlayer
                currentSong={currentSong}
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onNext={handleNext}
                onPrevious={handlePrevious}
                volume={volume}
                onVolumeChange={handleVolumeChange}
                currentTime={currentTime}
                duration={duration}
                onTimeUpdate={handleTimeUpdate}
                onDurationChange={handleDurationChange}
                onSeek={handleSeek}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
