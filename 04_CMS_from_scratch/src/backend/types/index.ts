export interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  releaseYear: number;
  popularityScore: number;
  audioUrl: string;
  albumCover?: string;
  duration?: number;
  liked?: boolean;
}

export interface DailyPlaylist {
  date: string;
  songs: Song[];
}

export interface PlaylistHistory {
  date: string;
  songs: string[];
}

export interface UserFeedback {
  songId: string;
  action: "play" | "skip" | "like";
  timestamp: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
