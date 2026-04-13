# Mind-Flow Web (Frontend)

This is the frontend application for Mind-Flow.

## Getting Started

To run the development server for the web application, you can execute the following command from the **root** directory of the monorepo:

```bash
npm run dev --filter web
```

Or, if you are inside the `apps/web` directory:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or whichever port Next/Vite allocates if 3000 is taken by the API) with your browser to see the outcome.

## Integration with API

Make sure the backend is running concurrently to fetch goal and study analytics. You can start both simultaneously by running `npm run dev` from the root of the workspace!
