# Express Starter 🚀

A simple but strong Express 5 + TypeScript starter kit for production-minded REST APIs.

## What is included

- Express 5 application factory with dependency injection-friendly composition.
- TypeScript strict mode with path aliases and additional safety flags.
- Built-in request validation for bodies and route params.
- Centralized error handling with safe response envelopes.
- Security headers, CORS, JSON body limits, request IDs, and in-memory rate limiting.
- Structured JSON request logging.
- Feature-based users and health modules.
- Mongoose repository implementation plus an in-memory repository for tests.
- Password hashing with Node.js `crypto.scrypt` and public DTO responses that never expose password hashes.
- Liveness/readiness health checks.
- OpenAPI JSON starter endpoint.
- Node test runner API tests.
- Docker, Docker Compose, and GitHub Actions CI.
- Graceful shutdown for HTTP server and database connections.

## Project structure

```bash
src/
├── app.ts                         # Express app factory
├── index.ts                       # Infrastructure bootstrap and graceful shutdown
├── config/                        # Environment validation and logger
├── infrastructure/database/        # Mongoose connection lifecycle
├── modules/
│   ├── health/                    # Liveness/readiness routes
│   ├── openapi/                   # OpenAPI JSON endpoint
│   └── users/                     # User feature module
└── shared/
    ├── errors/                    # Application error types
    ├── http/                      # Request lifecycle utilities
    └── middleware/                # Shared middleware
```

## Requirements

- Node.js 22+
- PNPM 10+
- MongoDB for database-backed routes

## Setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Configuration

Environment variables are validated at startup.

```bash
NODE_ENV=development
HOST=localhost
PORT=3000
DB_URI=mongodb://localhost:27017/express_starter
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## Scripts

```bash
pnpm dev            # Run with hot reload
pnpm build          # Compile TypeScript and rewrite path aliases
pnpm start          # Run compiled application
pnpm typecheck      # Type-check without emitting files
pnpm lint           # Run TypeScript lint-style checks
pnpm test           # Run API tests
```

## API endpoints

```bash
GET    /health/live
GET    /health/ready
GET    /docs/openapi.json
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

## Docker

```bash
docker compose up --build
```

The API listens on `http://localhost:3000` and MongoDB on `localhost:27017`.

## Security baseline

This starter intentionally includes a minimal security baseline instead of leaving it as an exercise:

- Built-in middleware disables or hardens common HTTP headers.
- CORS is environment-driven instead of wide open by default.
- JSON payloads are capped at `100kb`.
- Rate limiting is enabled globally.
- Passwords are hashed before storage.
- Password hashes are excluded from public responses.
- Error responses avoid leaking raw exception objects.

## Architecture notes

The application uses feature modules and constructor-injected services/repositories so that controllers stay thin and tests can run without MongoDB. This keeps the starter simple while leaving room for Clean Architecture or Hexagonal Architecture evolution.
