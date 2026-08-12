const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

exports.connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL DB connected successfully');
    client.release();
  } catch (err) {
    console.error('DB connection failed!', err.message);
    process.exit(1);
  }
};

// Run schema migrations on startup
exports.initDB = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('systemAdministrator', 'assistantRegistrar', 'guard', 'facultyMentor', 'gsec')),
        reset_token VARCHAR(255),
        reset_token_expiration TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS assistant_registrars (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS faculty_mentors (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        club_name VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS gsecs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        roll_number VARCHAR(100) NOT NULL,
        council_name VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS guards (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS system_administrators (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        lt_number INTEGER NOT NULL,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        start_time VARCHAR(20) NOT NULL,
        end_time VARCHAR(20) NOT NULL,
        reason TEXT NOT NULL,
        club_name VARCHAR(255) NOT NULL,
        booked_by VARCHAR(255) NOT NULL,
        av_support VARCHAR(10) NOT NULL CHECK (av_support IN ('yes', 'no')),
        pdf TEXT,
        faculty_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (faculty_status IN ('pending', 'approved', 'rejected')),
        system_administrator_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (system_administrator_status IN ('pending', 'approved', 'rejected')),
        assistant_registrar_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (assistant_registrar_status IN ('pending', 'approved', 'rejected')),
        faculty_mentor_email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // --- Double-booking hardening (production backstop) -----------------
    //
    // gsecController.makeRequest already prevents overlapping bookings at
    // the application level, using SELECT ... FOR UPDATE inside a
    // transaction. That closes the check-then-insert race condition for
    // requests that go through that controller, but it is not a guarantee
    // enforced by the database itself -- a bug in that code path, a direct
    // SQL client, or a future code path that forgets to take the lock could
    // still insert an overlapping row. The additions below give Postgres
    // itself the final say, as a defense-in-depth complement to the
    // application-level lock, not a replacement for it.

    // 1) A CHECK constraint rejecting any row where the range itself is
    //    inverted or empty (end_date <= start_date). This can't be
    //    expressed with "ADD CONSTRAINT IF NOT EXISTS" in Postgres, so it's
    //    wrapped in a DO block that swallows "already exists" on repeat
    //    startups.
    await client.query(`
      DO $$
      BEGIN
        ALTER TABLE bookings
          ADD CONSTRAINT bookings_end_after_start CHECK (end_date > start_date);
      EXCEPTION WHEN duplicate_object OR duplicate_table THEN
        NULL;
      END $$;
    `);

    // 2) A composite index on the exact columns the double-booking overlap
    //    query filters and locks on (Section 4/14 of the interview prep:
    //    "the first thing to break under load"). Without this, that
    //    SELECT ... FOR UPDATE does a full table scan as bookings grows.
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_lt_daterange
        ON bookings (lt_number, start_date, end_date);
    `);

    // 3) A schema-level EXCLUDE constraint using a GiST index, so two
    //    overlapping *active* bookings (i.e. not yet rejected by every
    //    gate) for the same lecture hall can never coexist as rows,
    //    regardless of what application code did or didn't lock. This
    //    requires the btree_gist extension, which needs a superuser or
    //    CREATEDB-ish privilege on some managed Postgres providers -- if
    //    that's unavailable, we log a warning and continue without it
    //    rather than failing startup, since the application-level lock
    //    still provides real protection on its own.
    let btreeGistAvailable = false;
    try {
      await client.query('CREATE EXTENSION IF NOT EXISTS btree_gist;');
      btreeGistAvailable = true;
    } catch (extErr) {
      console.warn(
        'btree_gist extension could not be created (insufficient privilege on this database) - ' +
        'skipping the schema-level double-booking EXCLUDE constraint. ' +
        'The application-level transaction + row lock in gsecController.js still applies.'
      );
    }

    if (btreeGistAvailable) {
      await client.query(`
        DO $$
        BEGIN
          ALTER TABLE bookings
            ADD CONSTRAINT no_overlapping_active_bookings
            EXCLUDE USING gist (
              lt_number WITH =,
              tsrange(start_date, end_date, '[]') WITH &&
            )
            WHERE (
              faculty_status <> 'rejected'
              AND assistant_registrar_status <> 'rejected'
              AND (av_support = 'no' OR system_administrator_status <> 'rejected')
            );
        EXCEPTION WHEN duplicate_object OR duplicate_table THEN
          NULL;
        END $$;
      `);
    }
    // ----------------------------------------------------------------------

    console.log('Database schema initialized');
  } catch (err) {
    console.error('Schema initialization failed:', err.message);
    throw err;
  } finally {
    client.release();
  }
};

module.exports.pool = pool;
