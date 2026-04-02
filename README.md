# eventflow-user-service

Production-ready user authentication microservice built with Node.js, Express, MongoDB, and JWT.

## Features

- User registration & login with hashed passwords (bcrypt)
- JWT-based authentication with reusable middleware
- Input validation via `express-validator`
- Centralized error handling
- Winston structured logging
- Swagger/OpenAPI docs (`/api/docs`)
- Docker multi-stage build + Docker Compose with MongoDB
- CORS enabled

## Quick Start

### Prerequisites

- Node.js >= 20
- MongoDB (or Docker)

### Local Development

```bash
cp .env.example .env
# Edit .env with your values
npm install
npm run dev
```

### Docker Compose

```bash
cp .env.example .env
docker compose up --build
```

The service starts on `http://localhost:3001`.

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | Runtime environment | `development` |
| `PORT` | HTTP port | `3001` |
| `MONGODB_URI` | MongoDB connection string | — |
| `JWT_SECRET` | Secret key for signing JWTs | — |
| `JWT_EXPIRES_IN` | JWT expiry duration | `7d` |
| `LOG_LEVEL` | Winston log level | `info` |
| `CORS_ORIGIN` | Allowed CORS origin(s) | `*` |

See `.env.example` for a full template.

---

## API Reference

Interactive docs are available at `/api/docs` (Swagger UI).

### Health

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | No | Service health check |

**Response**
```json
{
  "status": "ok",
  "service": "eventflow-user-service",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 42,
  "database": "connected"
}
```

---

### Auth

#### POST `/api/auth/register`

Register a new user.

**Request body**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Response `201`**
```json
{
  "message": "User registered successfully",
  "token": "<jwt>",
  "user": {
    "_id": "...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

#### POST `/api/auth/login`

Authenticate and receive a JWT.

**Request body**
```json
{
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Response `200`**
```json
{
  "message": "Login successful",
  "token": "<jwt>",
  "user": { ... }
}
```

---

### Users (protected — `Authorization: Bearer <token>`)

#### GET `/api/users/profile`

Returns the authenticated user's profile.

**Response `200`**
```json
{
  "user": {
    "_id": "...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

#### PUT `/api/users/profile`

Update name and/or email.

**Request body** (all fields optional)
```json
{
  "name": "Jane Smith",
  "email": "janesmith@example.com"
}
```

**Response `200`**
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

## Project Structure

```
src/
├── config/
│   ├── db.js           # Mongoose connection
│   └── swagger.js      # OpenAPI spec
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   └── health.controller.js
├── middleware/
│   ├── auth.js         # JWT verify middleware
│   ├── errorHandler.js # Centralised error handler
│   └── validate.js     # express-validator result handler
├── models/
│   └── User.js         # Mongoose User schema
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   └── health.routes.js
└── utils/
    └── logger.js       # Winston logger
```

## Error Responses

All errors follow a consistent shape:

```json
{
  "message": "Human-readable error",
  "errors": [ { "field": "email", "message": "Valid email is required" } ]
}
```

| Status | Meaning |
|---|---|
| 400 | Bad request / cast error |
| 401 | Unauthorized (missing/invalid/expired token) |
| 404 | Route not found |
| 409 | Conflict (duplicate email) |
| 422 | Validation failed |
| 500 | Internal server error |
