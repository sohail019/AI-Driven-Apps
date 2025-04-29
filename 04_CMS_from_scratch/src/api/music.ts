import axios from "axios";
import { Song } from "../types/music";

const API_BASE_URL = "http://localhost:3000/api";

export const musicAPI = {
  fetchTopSongs: async (yearRange?: {
    startYear: number;
    endYear: number;
  }): Promise<Song[]> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/songs/fetch`,
        yearRange || {
          startYear: 2004,
          endYear: 2024,
        }
      );
      console.log("Fetched songs:", response.data);
      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to fetch songs");
      }
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch songs:", error);
      throw error;
    }
  },

  fetchSongDetails: async (songId: string): Promise<Song> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/songs/${songId}`);
      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to fetch song details");
      }
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch song details:", error);
      throw error;
    }
  },

  getDailyPlaylist: async (): Promise<Song[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/songs/daily`);
      console.log("Daily playlist response:", response.data);
      if (!response.data.success) {
        throw new Error(
          response.data.error || "Failed to fetch daily playlist"
        );
      }
      return response.data.data.songs;
    } catch (error) {
      console.error("Failed to fetch daily playlist:", error);
      throw error;
    }
  },

  getRandomSong: async (): Promise<Song> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/songs/random`);
      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to fetch random song");
      }
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch random song:", error);
      throw error;
    }
  },

  getPlaylistHistory: async (
    date?: string
  ): Promise<{ date: string; songs: string[] }[]> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/songs/history${date ? `?date=${date}` : ""}`
      );
      if (!response.data.success) {
        throw new Error(
          response.data.error || "Failed to fetch playlist history"
        );
      }
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch playlist history:", error);
      throw error;
    }
  },

  updateSongStats: async (
    songId: string,
    stats: { plays: number; likes: number }
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/songs/${songId}/stats`,
        stats
      );
      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to update song stats");
      }
      return response.data.data;
    } catch (error) {
      console.error("Failed to update song stats:", error);
      throw error;
    }
  },
};
