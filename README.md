# ALXBackend-Project
This project is an application of concepts learned during this back-end trimester, we will be building a simple yet powerful blog platform


WordCanvas API
Overview

WordCanvas API is a backend service that provides functionality for user authentication, blog post creation, and management. Built using Node.js, Express, and MongoDB, it follows RESTful API principles to ensure scalability and maintainability.
Key Features

    Authentication: User signup, login, and secured endpoints with JWT authentication.
    Blog Management: CRUD operations for blog posts.
    Pagination: Efficiently handles large datasets by implementing pagination.
    Error Handling: Centralized error-handling middleware for better debugging and user feedback.

Project Architecture
Directory Structure

WordCanvas/
│
├── models/
│   ├── BlogPost.js   # Schema for blog posts
│   └── User.js       # Schema for user authentication
│
├── routes/
│   ├── auth.js       # Authentication-related routes
│   └── blog.js       # Blog post management routes
│
├── middleware/
│   ├── auth.js       # Middleware to verify JWT tokens
│   └── errorHandler.js # Centralized error handling
│
├── server.js         # Entry point for the application
├── .env              # Environment variables
├── package.json      # Project dependencies and scripts
└── README.md         # Project documentation

Technology Stack

    Node.js: Server-side JavaScript runtime.
    Express: Lightweight and fast web application framework.
    MongoDB: NoSQL database for storing user and blog data.
    JWT: Secure authentication and session management.

Setup Instructions
Prerequisites

    Node.js and npm installed.
    MongoDB server (local or cloud-hosted like MongoDB Atlas).

Installation

    Clone the repository:

git clone https://github.com/Ngayep/ALXBackend-Project.git  
cd WordCanvas  

Install dependencies:

npm install  

Configure environment variables:
Create a .env file in the project root with the following content:

MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_jwt_secret_key  

Start the server:

    npm start  

    The server will be available at http://localhost:5000.

API Usage
Base URL

http://localhost:5000/api
Authentication Endpoints
METHOD	ENDPOINT	DESCRIPTION	REQUEST BODY
POST	/auth/signup	Register a new user	{ "name": "John", "email": "john@example.com", "password": "password123" }
POST	/auth/login	Login and receive a JWT	{ "email": "john@example.com", "password": "password123" }
Blog Endpoints
METHOD	ENDPOINT	DESCRIPTION	REQUEST BODY
GET	/blogs	Fetch paginated blogs	Query Params: ?page=1&limit=10
GET	/blogs/:id	Fetch a specific blog	N/A
POST	/blogs	Create a new blog	{ "title": "Blog Title", "content": "Blog content" }
PUT	/blogs/:id	Update an existing blog	{ "title": "Updated Title", "content": "Updated content" }
DELETE	/blogs/:id	Delete a blog	N/A
Example: Creating a Blog Post

    Request:

POST /api/blogs HTTP/1.1  
Content-Type: application/json  
Authorization: Bearer <JWT_TOKEN>  

{  
  "title": "First Blog",  
  "content": "This is the content of the first blog."  
}  

Response:

    {  
      "id": "64cfd7d4f73d2e001d5c9d32",  
      "title": "First Blog",  
      "content": "This is the content of the first blog.",  
      "author": "64cfd7d4f73d2e001d5c9a31",  
      "createdAt": "2024-01-19T10:00:00.000Z",  
      "updatedAt": "2024-01-19T10:00:00.000Z"  
    }  

Error Handling

The API returns appropriate HTTP status codes and messages for each scenario:

    400 Bad Request: Invalid or missing input data.
    401 Unauthorized: Invalid or missing JWT token.
    403 Forbidden: Access to the resource is forbidden.
    404 Not Found: Resource not found.
    500 Internal Server Error: Server-side issues.

Example Error Response

{  
  "error": "Unauthorized",  
  "message": "Invalid or missing token."  
}  

How to Improve

    Validation: Enhance input validation with libraries like Joi or Yup.
    Unit Testing: Add automated tests using Jest or Mocha.
    Logging: Use logging tools like Winston for better traceability in production.
    Rate Limiting: Prevent abuse of API endpoints by implementing rate limiting.
    API Documentation: Add Swagger or Postman documentation for better developer experience.

License

This project is licensed under the MIT License.
