# Mind-Flow API (Backend)

This is the backend for the Mind-Flow application, built with [NestJS](https://nestjs.com/) and MongoDB.

## Features & Modules

- **Users**: Account creation and online presence polling (`lastSeenAt` & heartbeat).
- **Goals**: Group-based collaborative tracking and study leaderboards.
- **Topics & Chapters**: Ordered content organization inside goals.
- **Study Sessions**: Track duration and start times for specific chapters.
- **Reactions**: Goal members can leave reactions (🔥) when someone completes a chapter.
- **Admin**: Dedicated system endpoints for full platform analytics.

## Prerequisites

- Node.js (v18+)
- MongoDB daemon running locally on port 27017 or a valid MongoDB Atlas URI.

## Installation

Dependencies are managed from the root of the monorepo. Run the following from the **root** folder:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the `apps/api` directory:

```bash
MONGODB_URI=mongodb://localhost:27017/mindflow
PORT=3000
```

## Running the API

You can start the NestJS API individually or via the root workspace.

**From the root directory (Recommended):**
```bash
npm run dev --filter api
```

**From this `/apps/api` directory:**
```bash
# Watch mode (development)
npm run dev
# or
npm run start:dev

# Production mode
npm run start:prod
```

The server will start at `http://localhost:3000/api`.

## API Documentation & Testing

A complete Postman collection is available in this directory:
📁 `mindflow_api_postman_collection.json`

Import this file into Postman to instantly access all configured endpoints for Admin, Users, Goals, Topics, Chapters, Study Sessions, and Reactions.
