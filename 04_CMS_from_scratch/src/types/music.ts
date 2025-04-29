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

export interface DailyStats {
  genres: Record<string, number>;
  years: Record<string, number>;
  totalPlayed: number;
  likedSongs: string[];
}

export interface PlaylistHistory {
  date: string;
  songs: string[];
}
