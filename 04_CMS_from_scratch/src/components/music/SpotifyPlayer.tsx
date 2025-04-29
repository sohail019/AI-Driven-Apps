import { useEffect, useRef, useState } from "react";
import { Box, IconButton, Typography, Slider } from "@mui/material";
import { Play, Pause, SkipForward, SkipBack, Heart } from "lucide-react";
import { Song } from "../../types/music";

declare global {
  interface Window {
    Spotify: any;
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

interface SpotifyPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onLike: (songId: string) => void;
  accessToken: string;
}

export function SpotifyPlayer({
  currentSong,
  isPlaying,
  progress,
  onPlayPause,
  onNext,
  onPrevious,
  onSkip,
  onLike,
  accessToken,
}: SpotifyPlayerProps) {
  const [player, setPlayer] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const deviceId = useRef<string | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "AI Music Player",
        getOAuthToken: (cb: (token: string) => void) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Ready with Device ID", device_id);
        deviceId.current = device_id;
        setIsReady(true);
      });

      player.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Device ID has gone offline", device_id);
          setIsReady(false);
        }
      );

      player.addListener(
        "initialization_error",
        ({ message }: { message: string }) => {
          console.error("Failed to initialize", message);
          setError("Failed to initialize Spotify player");
        }
      );

      player.addListener(
        "authentication_error",
        ({ message }: { message: string }) => {
          console.error("Failed to authenticate", message);
          setError("Failed to authenticate with Spotify");
        }
      );

      player.addListener(
        "account_error",
        ({ message }: { message: string }) => {
          console.error("Failed to validate Spotify account", message);
          setError("Failed to validate Spotify account");
        }
      );

      player.connect();
    };

    return () => {
      document.body.removeChild(script);
      if (player) {
        player.disconnect();
      }
    };
  }, [accessToken]);

  useEffect(() => {
    if (player && isReady && currentSong) {
      const playSong = async () => {
        try {
          await player.play({
            uris: [currentSong.audioUrl],
            device_id: deviceId.current,
          });
        } catch (err) {
          console.error("Failed to play song:", err);
          setError("Failed to play song");
        }
      };

      if (isPlaying) {
        playSong();
      } else {
        player.pause();
      }
    }
  }, [player, isReady, currentSong, isPlaying]);

  if (error) {
    return (
      <Box
        sx={{
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!currentSong) {
    return (
      <Box
        sx={{
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h6">No song selected</Typography>
      </Box>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Box
      sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}
    >
      {/* Album Cover and Song Info */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Box
          component="img"
          src={currentSong.albumCover || "/default-album.png"}
          alt={currentSong.title}
          sx={{
            width: 120,
            height: 120,
            borderRadius: 1,
            mr: 3,
          }}
        />
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            {currentSong.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {currentSong.artist}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentSong.genre} • {currentSong.releaseYear}
          </Typography>
        </Box>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ mb: 3 }}>
        <Slider
          value={progress}
          onChange={(_, value) => {
            // Handle seeking
          }}
          sx={{
            color: "primary.main",
            "& .MuiSlider-thumb": {
              width: 12,
              height: 12,
            },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="caption" color="text.secondary">
            {formatTime((progress / 100) * (currentSong.duration || 0))}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatTime(currentSong.duration || 0)}
          </Typography>
        </Box>
      </Box>

      {/* Controls */}
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <IconButton onClick={onPrevious} size="large">
          <SkipBack className="h-5 w-5" />
        </IconButton>
        <IconButton onClick={onPlayPause} size="large" sx={{ mx: 2 }}>
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </IconButton>
        <IconButton onClick={onNext} size="large">
          <SkipForward className="h-5 w-5" />
        </IconButton>
        <IconButton
          onClick={() => onLike(currentSong.id)}
          size="large"
          sx={{ ml: 2 }}
        >
          <Heart
            className={`h-5 w-5 ${
              currentSong.liked ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </IconButton>
      </Box>
    </Box>
  );
}
