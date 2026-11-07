# System Architecture

```text
Presentation Layer
React + Vite + React Router
        |
        | JSON / REST API + JWT
        v
Application Layer
Node.js + Express Controllers + Middleware
        |
        | Mongoose ODM
        v
Data Layer
MongoDB Atlas
(Admins, Books, Members, Loans)
```

## Main API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create initial admin |
| POST | `/api/auth/login` | Admin login |
| GET | `/api/dashboard` | Dashboard summary |
| GET/POST | `/api/books` | List/add books |
| PUT/DELETE | `/api/books/:id` | Update/delete book |
| GET/POST | `/api/members` | List/register members |
| PUT/DELETE | `/api/members/:id` | Update/delete member |
| GET/POST | `/api/loans` | List/issue loans |
| PATCH | `/api/loans/:id/return` | Return a book |

All endpoints except health check and auth endpoints require `Authorization: Bearer <token>`.
