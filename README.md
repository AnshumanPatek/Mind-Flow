# Mind-Flow

Mind-Flow is a collaborative study and goal-tracking application. This project uses a monorepo setup powered by **Turborepo** and **npm workspaces**.

## Project Structure

The workspace contains the following packages and applications:

- **`apps/api`**: The backend server built with [NestJS](https://nestjs.com/) and MongoDB (Mongoose). It handles users, goals, topics, chapters, study sessions, and reactions.
- **`apps/web`**: The frontend web application.
- **`packages/shared`**: A shared library containing TypeScript interfaces and DTOs used by both the API and Web apps.

## Prerequisites

Before running the project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (running locally or via MongoDB Atlas)

## Getting Started

### 1. Install Dependencies

From the root directory, install all dependencies across the entire workspace:

```bash
npm install
```

### 2. Environment Configuration

You need to configure the environment variables for the API before starting the services.

1. Navigate to the `apps/api` directory.
2. Ensure you have a `.env` file (a `.env.example` has been provided):

```bash
cd apps/api
cp .env.example .env
```
Make sure `MONGODB_URI` in `.env` points to your running MongoDB instance (e.g., `mongodb://localhost:27017/mindflow`).

### 3. Running the Project

You can run the entire stack simultaneously from the root directory using Turborepo:

```bash
npm run dev
```

This command will concurrently start both the `api` (NestJS on port 3000) and the `web` frontend in development mode.

Alternatively, you can run specific applications:

- **Run API only**: `npm run dev --filter api`
- **Run Web only**: `npm run dev --filter web`

## Other Commands (Root)

- `npm run build`: Build all apps and packages.
- `npm run lint`: Lint all apps and packages.
- `npm run format`: Format all code via Prettier.