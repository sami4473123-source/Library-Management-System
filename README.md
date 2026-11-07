# Library Management System (MERN)

Premium full-stack Library Management System built with MongoDB, Express.js, React.js and Node.js.

## Project structure
- `backend/config` — MongoDB connection
- `backend/models` — Admin, Book, Member and Loan schemas
- `backend/controllers` — application business logic
- `backend/routes` — REST API endpoints
- `backend/middleware` — JWT authentication
- `backend/server.js` — Express application bootstrap
- `frontend/src/pages` — application pages
- `frontend/src/services` — central API client
- `frontend/src/index.css` — responsive premium design system

## Requirements
Node.js 18+ and MongoDB Atlas or local MongoDB.

## Setup
1. Open this project folder in VS Code.
2. Run `npm install`.
3. Run `npm install --prefix backend`.
4. Run `npm install --prefix frontend`.
5. Copy `backend/.env.example` to `backend/.env`.
6. Add your MongoDB connection string and a long random `JWT_SECRET`.
7. Run `npm run dev`.

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## Create the first admin
Send a POST request to `http://localhost:5000/api/auth/register`:
```json
{ "name": "Library Admin", "email": "admin@example.com", "password": "ChangeThisPassword123" }
```
Then sign in from the React app. Registration is open in this starter; disable public registration before public production deployment.

## Features
- Admin login with JWT
- Dashboard overview and collection statistics
- Book CRUD and search
- Member registration, search and deletion
- Issue and return book workflow
- Due-date tracking and overdue fine calculation (₹5/day by default)

Never upload `.env` or expose your MongoDB URI. This starter has been generated and organized; run local integration tests before production deployment.
