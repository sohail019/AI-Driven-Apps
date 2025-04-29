import axios from "axios";
import { Song } from "../types";

const SPOTIFY_API = "https://api.spotify.com/v1";
const SPOTIFY_AUTH = "https://accounts.spotify.com/api/token";
const SPOTIFY_CLIENT_ID = "649a65d1730d4c84a4aee6572ba4c40a";
const SPOTIFY_CLIENT_SECRET = "891a9b4a6f55402c8acc6cffa9fe2a80";

interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    images: Array<{ url: string }>;
    release_date: string;
  };
  popularity: number;
  duration_ms: number;
  preview_url: string;
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
    next: string | null;
  };
}

export class SpotifyService {
  private static instance: SpotifyService;
  private token: SpotifyToken | null = null;

  private constructor() {
    console.log("SpotifyService initialized");
  }

  static getInstance(): SpotifyService {
    if (!SpotifyService.instance) {
      SpotifyService.instance = new SpotifyService();
    }
    return SpotifyService.instance;
  }

  private async getAccessToken(): Promise<string> {
    if (this.token && Date.now() < this.token.expires_at) {
      return this.token.access_token;
    }

    try {
      const response = await axios.post<SpotifyToken>(
        SPOTIFY_AUTH,
        new URLSearchParams({
          grant_type: "client_credentials",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
              `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
            ).toString("base64")}`,
          },
        }
      );

      this.token = {
        ...response.data,
        expires_at: Date.now() + response.data.expires_in * 1000,
      };

      console.log("Successfully obtained Spotify access token");
      return this.token.access_token;
    } catch (error) {
      console.error("Failed to obtain Spotify access token:", error);
      throw new Error("Failed to authenticate with Spotify");
    }
  }

  async fetchTopSongs(yearRange?: {
    start: number;
    end: number;
  }): Promise<Song[]> {
    try {
      console.log(
        "Fetching top songs from Spotify...",
        yearRange
          ? `Year range: ${yearRange.start}-${yearRange.end}`
          : "No year range"
      );

      const token = await this.getAccessToken();
      const songs: Song[] = [];
      let offset = 0;
      const limit = 50; // Spotify's maximum limit per request

      // Search for popular songs from the last 20 years
      const searchQueries = [
        "tag:new", // Recent hits
        "tag:hipster", // Popular but not mainstream
        "tag:acoustic", // Acoustic hits
        "tag:party", // Party hits
      ];

      for (const query of searchQueries) {
        try {
          let nextUrl: string | null = `${SPOTIFY_API}/search`;

          while (nextUrl && songs.length < 1000) {
            const response = await axios.get<SpotifySearchResponse>(nextUrl, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                q: query,
                type: "track",
                limit,
                offset,
                market: "US",
              },
            });

            if (!response.data.tracks?.items) {
              console.warn(`No tracks found for query: ${query}`);
              break;
            }

            const tracks = response.data.tracks.items.map(
              (track: SpotifyTrack) => ({
                id: track.id,
                title: track.name,
                artist: track.artists[0]?.name || "Unknown Artist",
                genre: "Unknown", // Spotify doesn't provide genre at track level
                releaseYear: new Date(track.album.release_date).getFullYear(),
                popularityScore: track.popularity,
                audioUrl: track.preview_url || "",
                albumCover: track.album.images[0]?.url || "",
                duration: Math.floor(track.duration_ms / 1000),
              })
            );

            songs.push(...tracks);
            nextUrl = response.data.tracks.next;
            offset += limit;
          }
        } catch (error) {
          console.error(`Error fetching songs for query ${query}:`, error);
          // Continue with next query instead of failing completely
          continue;
        }
      }

      if (songs.length === 0) {
        console.warn("No songs found with any query, trying fallback search");
        // Fallback to a simple search for popular songs
        const response = await axios.get<SpotifySearchResponse>(
          `${SPOTIFY_API}/search`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              q: "popular",
              type: "track",
              limit: 50,
              market: "US",
            },
          }
        );

        if (response.data.tracks?.items) {
          const tracks = response.data.tracks.items.map(
            (track: SpotifyTrack) => ({
              id: track.id,
              title: track.name,
              artist: track.artists[0]?.name || "Unknown Artist",
              genre: "Unknown",
              releaseYear: new Date(track.album.release_date).getFullYear(),
              popularityScore: track.popularity,
              audioUrl: track.preview_url || "",
              albumCover: track.album.images[0]?.url || "",
              duration: Math.floor(track.duration_ms / 1000),
            })
          );
          songs.push(...tracks);
        }
      }

      // Remove duplicates based on track ID
      const uniqueSongs = Array.from(
        new Map(songs.map((song) => [song.id, song])).values()
      );

      // Sort by popularity
      uniqueSongs.sort((a, b) => b.popularityScore - a.popularityScore);

      console.log(`Fetched ${uniqueSongs.length} unique songs from Spotify`);
      return uniqueSongs;
    } catch (error) {
      console.error("Failed to fetch songs from Spotify:", error);
      throw error;
    }
  }

  async getSongDetails(songId: string): Promise<Song | null> {
    try {
      const token = await this.getAccessToken();
      const response = await axios.get<SpotifyTrack>(
        `${SPOTIFY_API}/tracks/${songId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const track = response.data;
      return {
        id: track.id,
        title: track.name,
        artist: track.artists[0]?.name || "Unknown Artist",
        genre: "Unknown",
        releaseYear: new Date(track.album.release_date).getFullYear(),
        popularityScore: track.popularity,
        audioUrl: track.preview_url || "",
        albumCover: track.album.images[0]?.url || "",
        duration: Math.floor(track.duration_ms / 1000),
      };
    } catch (error) {
      console.error(`Failed to fetch song details for ${songId}:`, error);
      return null;
    }
  }
}
