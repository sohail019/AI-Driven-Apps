import { Request, Response } from "express";
import { MusicService } from "../services/musicService";
import { ApiResponse } from "../types";

export class MusicController {
  private musicService: MusicService;

  constructor() {
    this.musicService = MusicService.getInstance();
  }

  getDailyPlaylist = async (req: Request, res: Response) => {
    try {
      const playlist = await this.musicService.getDailyPlaylist();
      const response: ApiResponse<typeof playlist> = {
        success: true,
        data: playlist,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Failed to fetch daily playlist",
      };
      res.status(500).json(response);
    }
  };

  fetchTopSongs = async (req: Request, res: Response) => {
    try {
      const { startYear, endYear } = req.body;
      const songs = await this.musicService.fetchTopSongs({
        start: startYear || 2000,
        end: endYear || new Date().getFullYear(),
      });
      const response: ApiResponse<typeof songs> = {
        success: true,
        data: songs,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Failed to fetch top songs",
      };
      res.status(500).json(response);
    }
  };

  getPlaylistHistory = async (req: Request, res: Response) => {
    try {
      const { date } = req.query;
      const history = this.musicService.getPlaylistHistory(date as string);
      const response: ApiResponse<typeof history> = {
        success: true,
        data: history,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Failed to fetch playlist history",
      };
      res.status(500).json(response);
    }
  };

  clearPlaylistHistory = async (req: Request, res: Response) => {
    try {
      const { date } = req.query;
      this.musicService.clearPlaylistHistory(date as string);
      const response: ApiResponse<null> = {
        success: true,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Failed to clear playlist history",
      };
      res.status(500).json(response);
    }
  };

  getRandomSong = async (req: Request, res: Response) => {
    try {
      const song = this.musicService.getRandomSong();
      if (!song) {
        const response: ApiResponse<null> = {
          success: false,
          error: "No available songs found",
        };
        return res.status(404).json(response);
      }
      const response: ApiResponse<typeof song> = {
        success: true,
        data: song,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Failed to get random song",
      };
      res.status(500).json(response);
    }
  };

  getSongDetails = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const song = await this.musicService.getSongDetails(id);

      if (!song) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Song not found",
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse<typeof song> = {
        success: true,
        data: song,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Failed to fetch song details",
      };
      res.status(500).json(response);
    }
  };

  //   submitFeedback = async (req: Request, res: Response) => {
  //     try {
  //       const { songId, action } = req.body;

  //       // TODO: Implement feedback handling
  //       // This could be used to improve future playlist generation

  //       const response: ApiResponse<null> = {
  //         success: true,
  //       };
  //       res.json(response);
  //     } catch (error: any) {
  //       console.error("Failed to submit feedback:", error);
  //       const response: ApiResponse<null> = {
  //         success: false,
  //         error: "Failed to submit feedback",
  //       };
  //       res.status(500).json(response);
  //     }
  //   };
}
