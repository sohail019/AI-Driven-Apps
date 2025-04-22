import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { searchBook } from "../utils/bookSearch.utils";
import multer from "multer";
import path from "path";
import fs, { close } from "fs";

const genAI = new GoogleGenerativeAI(
  (process.env.GEMINI_API_KEY as string) ||
    "AIzaSyDHgcMb7VVEVC1kmoDi5bhDTMHwpo4clDQ"
);

console.log("Google Generative AI initialized");
console.log("Google Generative AI key:", process.env.GEMINI_API_KEY);
interface ExtractedBook {
  title: string;
  author: string;
  bookFound: boolean;
  source: "GoogleBooks" | "OpenLibrary" | null;
  bookDetails: any | null;
}

export const searchBooksFromImage = async (req: Request, res: Response) => {
  try {
    // const { imageBase64 } = req.body;
    console.log("Received request file path:", req.file?.path);
    const imagePath = path.resolve(req.file?.path as string);
    console.log("Resolved image path:", imagePath);

    // Read the image file and convert to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString("base64");
    console.log("Received body data:", req.file);

    if (!imageBase64) {
      return res.status(400).json({ message: "Image data is required" });
    }

    // Initialize Gemini model
    // const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      // generationConfig: {
      //   responseMimeType: "application/json",
      // },
    });

    // Convert base64 to image data
    const imageData = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg",
      },
    };

    // Generate content with the image
    const result = await model.generateContent([
      "Extract book titles and authors from this image. Return the data in JSON format: { books: [{ title: string, author: string }] } Return only the JSON response, no additional text and make sure it is in proper json format which is complete. Please only send json response no additional text.",
      imageData,
    ]);

    const response = await result.response;
    const text = response.text();
    const cleaned = text.replace(/```.*?\n?/g, "").replace(/```/g, "");
    const match = cleaned.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("No valid JSON object found in response.");
    }

    console.log("Matched JSON:", match[0]);
    // Parse the response
    const extractedBooks = JSON.parse(match[0]).books;

    // Process each extracted book
    const processedBooks: ExtractedBook[] = await Promise.all(
      extractedBooks.map(async (book: { title: string; author: string }) => {
        // Search for the book
        const searchQuery = `${book.title} ${book.author} `;
        const bookDetails = await searchBook(searchQuery);

        return {
          title: book.title,
          author: book.author,
          bookFound: !!bookDetails,
          source: bookDetails
            ? (bookDetails.source as "GoogleBooks" | "OpenLibrary")
            : null,
          bookDetails: bookDetails || null,
        };
      })
    );

    res.json(processedBooks);
  } catch (error: any) {
    console.error("Error processing image:", error);
    res.status(500).json({ message: error.message });
  }
};
