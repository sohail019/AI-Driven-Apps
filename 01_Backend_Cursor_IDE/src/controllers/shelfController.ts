import { Request, Response } from "express";
import { Shelf } from "../models/Shelf";
import { IErrorResponse, ISuccessResponse } from "../types/response.types";
import { IShelf } from "../types/shelf.types";

export const shelfController = {
  // Create a new shelf
  async createShelf(
    req: Request<{}, {}, IShelf>,
    res: Response<ISuccessResponse<IShelf> | IErrorResponse>
  ) {
    try {
      const shelf = await Shelf.create(req.body);
      res.status(201).json({
        success: true,
        data: shelf.toObject(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to create shelf",
      });
    }
  },

  // Get all shelves for a library
  async getShelves(
    req: Request<{ libraryId: string }>,
    res: Response<ISuccessResponse<IShelf[]> | IErrorResponse>
  ) {
    try {
      const shelves = await Shelf.find({ libraryId: req.params.libraryId });
      res.status(200).json({
        success: true,
        data: shelves,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch shelves",
      });
    }
  },

  // Get a single shelf
  async getShelf(
    req: Request<{ id: string }>,
    res: Response<ISuccessResponse<IShelf> | IErrorResponse>
  ) {
    try {
      const shelf = await Shelf.findById(req.params.id);
      if (!shelf) {
        return res.status(404).json({
          success: false,
          error: "Shelf not found",
        });
      }
      res.status(200).json({
        success: true,
        data: shelf,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch shelf",
      });
    }
  },

  // Update a shelf
  async updateShelf(
    req: Request<{ id: string }, {}, Partial<IShelf>>,
    res: Response<ISuccessResponse<IShelf> | IErrorResponse>
  ) {
    try {
      const shelf = await Shelf.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!shelf) {
        return res.status(404).json({
          success: false,
          error: "Shelf not found",
        });
      }
      res.status(200).json({
        success: true,
        data: shelf,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to update shelf",
      });
    }
  },

  // Delete a shelf
  async deleteShelf(
    req: Request<{ id: string }>,
    res: Response<ISuccessResponse<null> | IErrorResponse>
  ) {
    try {
      const shelf = await Shelf.findByIdAndDelete(req.params.id);
      if (!shelf) {
        return res.status(404).json({
          success: false,
          error: "Shelf not found",
        });
      }
      res.status(200).json({
        success: true,
        data: null,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to delete shelf",
      });
    }
  },
};
