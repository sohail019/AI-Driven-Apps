# Library Management System API

A RESTful API for managing a library system built with Node.js, Express, TypeScript, and MongoDB.

## Features

- CRUD operations for books
- Input validation using Zod
- MongoDB integration with Mongoose
- TypeScript support
- Error handling middleware
- Request validation middleware
- Pagination and search functionality
- Clean architecture (Controller-Service-Model pattern)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas URI)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd library-management-system
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/library_management
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start the development server:

```bash
npm run dev
```

## API Endpoints

### Books

- `POST /api/books` - Create a new book
- `GET /api/books` - Get all books (with pagination and search)
- `GET /api/books/:id` - Get a specific book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book

### Query Parameters

- `page` - Page number for pagination (default: 1)
- `limit` - Number of items per page (default: 10)
- `search` - Search term for filtering books

## Request/Response Examples

### Create Book

```http
POST /api/books
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "ISBN": "9780743273565",
  "quantity": 5,
  "availableQuantity": 5,
  "category": "Fiction",
  "description": "A story of the fabulously wealthy Jay Gatsby",
  "publishedYear": 1925
}
```

### Get Books with Pagination

```http
GET /api/books?page=1&limit=10&search=gatsby
```

## Error Handling

The API uses standard HTTP status codes and returns error messages in the following format:

```json
{
  "message": "Error message here",
  "errors": [] // Validation errors if applicable
}
```

## Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Run in production mode
npm start

# Run linter
npm run lint
```

## Future Enhancements

- Member management
- Transaction (borrowing/returning) system
- Authentication and authorization
- Fine calculation system
- Book reservation system

## License

ISC
