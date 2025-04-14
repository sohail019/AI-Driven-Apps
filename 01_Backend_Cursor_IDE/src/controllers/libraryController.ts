import { Request, Response, NextFunction } from "express";
import libraryService from "../services/libraryService";
import { AppError } from "../utils/AppError";

export const createLibrary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;
    const library = await libraryService.createLibrary(userId, name);
    res.status(201).json({
      status: "success",
      data: library,
    });
  } catch (error) {
    next(error);
  }
};

export const getLibrary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const library = await libraryService.getLibraryById(id);
    res.status(200).json({
      status: "success",
      data: library,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserLibraries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const libraries = await libraryService.getUserLibraries(userId);
    res.status(200).json({
      status: "success",
      data: libraries,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLibrary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const library = await libraryService.updateLibrary(id, name);
    res.status(200).json({
      status: "success",
      data: library,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLibrary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await libraryService.deleteLibrary(id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const createShelf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { libraryId } = req.params;
    const { name } = req.body;
    const shelf = await libraryService.createShelf(libraryId, name);
    res.status(201).json({
      status: "success",
      data: shelf,
    });
  } catch (error) {
    next(error);
  }
};

export const getShelf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const shelf = await libraryService.getShelfById(id);
    res.status(200).json({
      status: "success",
      data: shelf,
    });
  } catch (error) {
    next(error);
  }
};

export const getLibraryShelves = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { libraryId } = req.params;
    const shelves = await libraryService.getLibraryShelves(libraryId);
    res.status(200).json({
      status: "success",
      data: shelves,
    });
  } catch (error) {
    next(error);
  }
};

export const updateShelf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const shelf = await libraryService.updateShelf(id, name);
    res.status(200).json({
      status: "success",
      data: shelf,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteShelf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await libraryService.deleteShelf(id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
