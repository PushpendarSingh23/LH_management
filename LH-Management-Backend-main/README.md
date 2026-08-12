# LH-Management-Backend

Express + PostgreSQL API for the LH Management System (lecture-hall booking
with a multi-role approval workflow).

## Prerequisites

- Node.js 18.x
- A running local PostgreSQL instance

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and set:
   - `DATABASE_URL` — connection string for your local Postgres database
   - `JWT_SECRET` — any secret string used to sign auth tokens
3. Start the server:
   ```
   npm run dev
   ```
   (uses nodemon; `npm start` runs it without auto-restart)

The server listens on `http://localhost:9000`. On startup it connects to
Postgres and creates all required tables automatically (see
`config/database.js`) if they don't already exist -- no separate migration
step needed.

## Notes

- Auth is cookie-based (httpOnly JWT), not header-based -- the frontend must
  run on `http://localhost:3000` for the CORS config in `index.js` to allow
  it, and requests must be made with credentials included.
- A daily cron job (`node-cron`) deletes expired bookings. This only runs
  while the server process stays up, so it requires running the app as a
  long-lived local process (which `npm run dev`/`npm start` do).
