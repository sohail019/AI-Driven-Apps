import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.test" });

// Mock console.error to keep test output clean
console.error = jest.fn();
