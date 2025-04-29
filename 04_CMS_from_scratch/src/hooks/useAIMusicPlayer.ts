import { useState, useEffect, useCallback, useRef } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { Song, DailyStats } from "../types/music";
import { musicAPI } from "../api/music";

const STORAGE_KEYS = {
  DAILY_PLAYLIST: "ai_spotify_daily_playlist",
  PLAYED_HISTORY: "ai_spotify_played_history",
  LAST_UPDATE: "ai_spotify_last_update",
};

export function useAIMusicPlayer() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    genres: {},
    years: {},
    totalPlayed: 0,
    likedSongs: [],
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [storedPlaylist, setStoredPlaylist] = useLocalStorage<Song[]>(
    STORAGE_KEYS.DAILY_PLAYLIST,
    []
  );
  const [playedHistory, setPlayedHistory] = useLocalStorage<string[]>(
    STORAGE_KEYS.PLAYED_HISTORY,
    []
  );
  const [lastUpdate, setLastUpdate] = useLocalStorage<string>(
    STORAGE_KEYS.LAST_UPDATE,
    ""
  );

  // Initialize or update daily playlist
  useEffect(() => {
    const initializePlaylist = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        console.log("Initializing playlist for:", today);

        if (lastUpdate !== today) {
          console.log("Fetching new playlist for today");
          // Get today's playlist history
          const history = await musicAPI.getPlaylistHistory(today);
          const playedToday = history[0]?.songs || [];
          console.log("Today's played history:", playedToday);
          setPlayedHistory(playedToday);

          // Get new daily playlist
          const newPlaylist = await musicAPI.getDailyPlaylist();
          console.log("New daily playlist:", newPlaylist);
          setStoredPlaylist(newPlaylist);
          setQueue(newPlaylist);
          setLastUpdate(today);
        } else {
          console.log("Using cached playlist from:", lastUpdate);
          setQueue(storedPlaylist);
        }

        // Start with a random song if no current song
        if (!currentSong) {
          const randomSong = await musicAPI.getRandomSong();
          console.log("Starting with random song:", randomSong);
          setCurrentSong(randomSong);
        }

        setIsInitialized(true);
      } catch (err) {
        console.error("Failed to initialize playlist:", err);
        setError(
          err instanceof Error ? err.message : "Failed to initialize playlist"
        );
      }
    };

    initializePlaylist();
  }, [lastUpdate, setStoredPlaylist, setLastUpdate, currentSong]);

  // Handle audio playback
  useEffect(() => {
    if (currentSong?.audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      audioRef.current.src = currentSong.audioUrl;
      audioRef.current.load();

      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error("Failed to play audio:", err);
          setError("Failed to play audio. Please try another song.");
        });
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [currentSong, isPlaying]);

  // Update progress
  useEffect(() => {
    if (!audioRef.current) return;

    const updateProgress = () => {
      if (audioRef.current) {
        const progress =
          (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(progress);
      }
    };

    audioRef.current.addEventListener("timeupdate", updateProgress);
    audioRef.current.addEventListener("ended", playNext);
    audioRef.current.addEventListener("error", (e) => {
      console.error("Audio playback error:", e);
      setError("Failed to play audio. Please try another song.");
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", updateProgress);
        audioRef.current.removeEventListener("ended", playNext);
        audioRef.current.removeEventListener("error", () => {});
      }
    };
  }, [currentSong]);

  // Update playlist history when a song is played
  const updatePlaylistHistory = useCallback(
    async (songId: string) => {
      try {
        const newHistory = [...playedHistory, songId];
        setPlayedHistory(newHistory);

        // Update stats
        await musicAPI.updateSongStats(songId, { plays: 1, likes: 0 });
      } catch (err) {
        console.error("Failed to update playlist history:", err);
      }
    },
    [playedHistory]
  );

  // Playback controls
  const playNext = useCallback(() => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      setCurrentSong(nextSong);
      setQueue(queue.slice(1));
      updatePlaylistHistory(nextSong.id);
      setIsPlaying(true);
    } else {
      // If queue is empty, get a random song
      musicAPI
        .getRandomSong()
        .then((song) => {
          setCurrentSong(song);
          updatePlaylistHistory(song.id);
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Failed to get random song:", err);
          setError("Failed to get next song. Please try again.");
        });
    }
  }, [queue, updatePlaylistHistory]);

  const playPrevious = useCallback(() => {
    if (currentSong) {
      setQueue([currentSong, ...queue]);
      setCurrentSong(null);
      setIsPlaying(false);
    }
  }, [currentSong, queue]);

  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => {
          console.error("Failed to play audio:", err);
          setError("Failed to play audio. Please try another song.");
        });
      }
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const skipSong = useCallback(() => {
    playNext();
  }, [playNext]);

  const likeSong = useCallback(async (songId: string) => {
    try {
      await musicAPI.updateSongStats(songId, { plays: 0, likes: 1 });
      setDailyStats((prev) => ({
        ...prev,
        likedSongs: [...prev.likedSongs, songId],
      }));
    } catch (err) {
      console.error("Failed to like song:", err);
      setError("Failed to like song. Please try again.");
    }
  }, []);

  // Update daily stats
  useEffect(() => {
    if (currentSong) {
      setDailyStats((prev) => ({
        ...prev,
        genres: {
          ...prev.genres,
          [currentSong.genre]: (prev.genres[currentSong.genre] || 0) + 1,
        },
        years: {
          ...prev.years,
          [currentSong.releaseYear]:
            (prev.years[currentSong.releaseYear] || 0) + 1,
        },
        totalPlayed: prev.totalPlayed + 1,
      }));
    }
  }, [currentSong]);

  return {
    currentSong,
    queue,
    isPlaying,
    progress,
    dailyStats,
    error,
    isInitialized,
    playNext,
    playPrevious,
    togglePlay,
    skipSong,
    likeSong,
  };
}
