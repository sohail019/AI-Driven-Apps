import { useState, useEffect } from "react";
import { useAIMusicPlayer } from "../hooks/useAIMusicPlayer";
import { MusicPlayer } from "../components/music/MusicPlayer";
import { QueueList } from "../components/music/QueueList";
import { DailyStats } from "../components/music/DailyStats";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";

export default function AISpotifyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    currentSong,
    queue,
    isPlaying,
    progress,
    dailyStats,
    error: playerError,
    isInitialized,
    playNext,
    playPrevious,
    togglePlay,
    skipSong,
    likeSong,
  } = useAIMusicPlayer();

  useEffect(() => {
    if (isInitialized) {
      setIsLoading(false);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (playerError) {
      setError(playerError);
    }
  }, [playerError]);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your music experience...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body1">
          Please try refreshing the page or contact support if the issue
          persists.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        AI-Powered Daily Music Experience
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* Main Player Section */}
        <Box sx={{ flex: 2 }}>
          <Box sx={{ mb: 4 }}>
            <MusicPlayer
              currentSong={currentSong}
              isPlaying={isPlaying}
              progress={progress}
              onPlayPause={togglePlay}
              onNext={playNext}
              onPrevious={playPrevious}
              onSkip={skipSong}
              onLike={likeSong}
            />
          </Box>

          {/* Queue Section */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Today's Queue
            </Typography>
            <QueueList
              queue={queue}
              currentSongId={currentSong?.id}
              onSongSelect={playNext}
            />
          </Box>
        </Box>

        {/* Stats and Info Section */}
        <Box sx={{ flex: 1 }}>
          <DailyStats stats={dailyStats} />
        </Box>
      </Box>
    </Container>
  );
}
