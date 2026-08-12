# LH Management (Frontend)

React frontend for the LH Management System, built with [Vite](https://vitejs.dev/).

## Available Scripts

In the project directory, you can run:

### `npm run dev` (or `npm start`)

Runs the app in development mode with Vite's dev server.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page reloads instantly on changes via Vite's HMR.

### `npm run build`

Builds the app for production to the `dist` folder, bundled and minified via Vite/esbuild.

### `npm run preview`

Serves the production build from `dist` locally, to sanity-check a build before deploying it.

### `npm test`

Runs tests via Vitest.

## Environment variables

Copy `.env.example` to `.env` and set `VITE_BACKEND_URL` to the backend API's base URL.
Vite only exposes variables prefixed with `VITE_` to client-side code (via `import.meta.env`).
