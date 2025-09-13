# Express Starter 🚀

A minimal and scalable Express + TypeScript starter project. This template helps you quickly spin up a REST API or microservice with clean architecture and modern tooling.

## ✨ Features

- Express 5 — modern middleware and routing

- TypeScript — strong typing out of the box

- Mongoose — ODM for MongoDB

- Modular structure — `controllers`, `routes`, `middlewares`, `schemas`, `utils`

- .env support — via `tsx` and `node --env-file`

- Tsc Alias — clean, short import paths

## 📂 Project Structure

```bash
src/
├── app.ts           # Express app configuration
├── index.ts         # Entry point (server starts here)
├── config/          # Configurations
├── controllers/     # Controllers
├── middlewares/     # Middlewares
├── routes/          # Routes
├── schemas/         # Mongoose schemas
└── utils/           # Helpers and types
```

## 🛠️ Installation
```bash
# Clone the repository
git clone https://github.com/xteam-uz/express-starter.git
cd express-starter

# Install dependencies (recommended PNPM)
pnpm install
```

## ⚙️ Configuration

Create a .env file in the project root:
```bash
SERVER_HOST=localhost
SERVER_PORT=3000
DB_URI=mongodb://localhost:27017/
```

## 🚀 Run

Development:
```bash
pnpm dev
```
Runs with hot-reload using tsx.

## Build:
```bash
pnpm build
```

## Production:
```bash
pnpm start
```

## 📡 Example API

src/routes/user.ts defines routes handled by UserController:
```bash
GET /users
POST /users
```
The Mongoose schema is defined in src/schemas/user.schema.ts.

## 🧑‍💻 Contributing

Feel free to open an issue or submit a pull request to improve this project.

