import { Song, DailyPlaylist, PlaylistHistory } from "../types";
import { generateDailyPlaylist } from "../utils/aiMusicSelection";
import { SpotifyService } from "./spotifyService";

export class MusicService {
  private static instance: MusicService;
  private currentPlaylist: DailyPlaylist | null = null;
  private playlistHistory: PlaylistHistory[] = [];
  private allSongs: Song[] = [];
  private spotifyService: SpotifyService;

  private constructor() {
    console.log("MusicService initialized");
    this.spotifyService = SpotifyService.getInstance();
  }

  static getInstance(): MusicService {
    if (!MusicService.instance) {
      MusicService.instance = new MusicService();
    }
    return MusicService.instance;
  }

  async fetchTopSongs(yearRange?: {
    start: number;
    end: number;
  }): Promise<Song[]> {
    try {
      console.log(
        "Fetching top songs...",
        yearRange
          ? `Year range: ${yearRange.start}-${yearRange.end}`
          : "No year range"
      );

      this.allSongs = await this.spotifyService.fetchTopSongs(yearRange);
      console.log(`Processed ${this.allSongs.length} songs`);
      return this.allSongs;
    } catch (error) {
      console.error("Failed to fetch songs:", error);
      throw error;
    }
  }

  async getDailyPlaylist(): Promise<DailyPlaylist> {
    const today = new Date().toISOString().split("T")[0];
    console.log(`Getting daily playlist for ${today}`);

    if (this.currentPlaylist?.date === today) {
      console.log("Returning cached playlist for today");
      return this.currentPlaylist;
    }

    if (this.allSongs.length === 0) {
      console.log("No songs in cache, fetching from API...");
      await this.fetchTopSongs();
    }

    const playedHistory = this.getPlayedHistory();
    console.log(`Found ${playedHistory.length} songs in play history`);

    const newPlaylist = generateDailyPlaylist(this.allSongs, playedHistory);
    console.log(`Generated new playlist with ${newPlaylist.length} songs`);

    this.currentPlaylist = {
      date: today,
      songs: newPlaylist,
    };

    this.updatePlaylistHistory(newPlaylist.map((song) => song.id));
    console.log(`Updated playlist history for ${today}`);

    return this.currentPlaylist;
  }

  getPlaylistHistory(date?: string): PlaylistHistory[] {
    console.log(`Getting playlist history${date ? ` for ${date}` : ""}`);
    if (date) {
      const filteredHistory = this.playlistHistory.filter(
        (history) => history.date === date
      );
      console.log(`Found ${filteredHistory.length} entries for date ${date}`);
      return filteredHistory;
    }
    console.log(
      `Returning all history (${this.playlistHistory.length} entries)`
    );
    return this.playlistHistory;
  }

  clearPlaylistHistory(date?: string): void {
    console.log(`Clearing playlist history${date ? ` for ${date}` : ""}`);
    if (date) {
      const initialLength = this.playlistHistory.length;
      this.playlistHistory = this.playlistHistory.filter(
        (history) => history.date !== date
      );
      console.log(
        `Removed ${
          initialLength - this.playlistHistory.length
        } entries for date ${date}`
      );
    } else {
      this.playlistHistory = [];
      console.log("Cleared all playlist history");
    }
  }

  getRandomSong(): Song | null {
    console.log("Getting random song");
    if (this.allSongs.length === 0) {
      console.log("No songs available");
      return null;
    }

    const playedHistory = this.getPlayedHistory();
    const availableSongs = this.allSongs.filter(
      (song) => !playedHistory.includes(song.id)
    );

    console.log(`Found ${availableSongs.length} available songs`);

    if (availableSongs.length === 0) {
      console.log("No unplayed songs available");
      return null;
    }

    const randomIndex = Math.floor(Math.random() * availableSongs.length);
    const selectedSong = availableSongs[randomIndex];
    console.log(`Selected random song: ${selectedSong.title}`);
    return selectedSong;
  }

  private getPlayedHistory(): string[] {
    const last7Days = this.playlistHistory
      .slice(-7)
      .flatMap((history) => history.songs);
    const uniqueSongs = [...new Set(last7Days)];
    console.log(
      `Getting play history: ${uniqueSongs.length} unique songs in last 7 days`
    );
    return uniqueSongs;
  }

  private updatePlaylistHistory(songIds: string[]) {
    const today = new Date().toISOString().split("T")[0];
    console.log(
      `Updating playlist history for ${today} with ${songIds.length} songs`
    );

    this.playlistHistory.push({
      date: today,
      songs: songIds,
    });

    if (this.playlistHistory.length > 7) {
      const removedCount = this.playlistHistory.length - 7;
      this.playlistHistory = this.playlistHistory.slice(-7);
      console.log(`Removed ${removedCount} old history entries`);
    }
  }

  async getSongDetails(songId: string): Promise<Song | null> {
    try {
      console.log(`Fetching details for song ${songId}`);
      return await this.spotifyService.getSongDetails(songId);
    } catch (error) {
      console.error(`Failed to fetch song details for ${songId}:`, error);
      return null;
    }
  }
}
