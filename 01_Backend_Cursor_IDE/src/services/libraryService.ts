import { Library } from "../models/Library";
import { Shelf } from "../models/Shelf";
import { AppError } from "../utils/AppError";
import { ILibrary, IShelf } from "../types/library.types";

class LibraryService {
  async createLibrary(userId: string, name: string): Promise<ILibrary> {
    const library = await Library.create({ userId, name });
    return library;
  }

  async getLibraryById(id: string): Promise<ILibrary> {
    const library = await Library.findOne({ id });
    if (!library) {
      throw new AppError("Library not found", 404);
    }
    return library;
  }

  async getUserLibraries(userId: string): Promise<ILibrary[]> {
    return await Library.find({ userId });
  }

  async updateLibrary(id: string, name: string): Promise<ILibrary> {
    const library = await Library.findOneAndUpdate(
      { id },
      { name, updatedAt: new Date() },
      { new: true }
    );
    if (!library) {
      throw new AppError("Library not found", 404);
    }
    return library;
  }

  async deleteLibrary(id: string): Promise<void> {
    const library = await Library.findOneAndDelete({ id });
    if (!library) {
      throw new AppError("Library not found", 404);
    }
    // Delete all shelves in this library
    await Shelf.deleteMany({ libraryId: id });
  }

  async createShelf(libraryId: string, name: string): Promise<IShelf> {
    const library = await this.getLibraryById(libraryId);
    if (!library) {
      throw new AppError("Library not found", 404);
    }
    const shelf = await Shelf.create({ libraryId, name });
    return shelf;
  }

  async getShelfById(id: string): Promise<IShelf> {
    const shelf = await Shelf.findOne({ id });
    if (!shelf) {
      throw new AppError("Shelf not found", 404);
    }
    return shelf;
  }

  async getLibraryShelves(libraryId: string): Promise<IShelf[]> {
    return await Shelf.find({ libraryId });
  }

  async updateShelf(id: string, name: string): Promise<IShelf> {
    const shelf = await Shelf.findOneAndUpdate(
      { id },
      { name, updatedAt: new Date() },
      { new: true }
    );
    if (!shelf) {
      throw new AppError("Shelf not found", 404);
    }
    return shelf;
  }

  async deleteShelf(id: string): Promise<void> {
    const shelf = await Shelf.findOneAndDelete({ id });
    if (!shelf) {
      throw new AppError("Shelf not found", 404);
    }
  }
}

export default new LibraryService();
