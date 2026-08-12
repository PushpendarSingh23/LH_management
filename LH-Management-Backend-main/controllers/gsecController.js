const { pool } = require('../config/database');
const { rowsToCamelCase } = require('../utils/caseConverter');

module.exports.makeRequest = async (req, res) => {
  const {
    ltNumber,
    startDate,
    endDate,
    reason,
    clubName,
    avSupport,
    facultyMentorEmail,
    startTime,
    endTime,
    pdf,
  } = req.body;

  // Who is making this request is an identity fact, not a form field --
  // it must come from the verified JWT (set by the `authenticate`
  // middleware), never from the request body. Previously `bookedBy` was
  // read straight from req.body, so any authenticated gsec user could
  // submit a request "as" a different club/person just by changing that
  // field in the payload.
  const bookedBy = req.user.email;

  // Validate the request shape and the date range itself before ever
  // opening a connection or a transaction. This matters specifically for
  // the double-booking logic below: the overlap query's semantics
  // ("start_date <= endDate AND end_date >= startDate") only make sense
  // for a well-formed, non-inverted range, and an invalid range sent
  // straight to the API (bypassing the frontend's own check) would
  // otherwise reach the overlap query and the new EXCLUDE constraint in
  // an unpredictable way instead of a clear 400.
  if (!ltNumber || !startDate || !endDate || !reason || !clubName || !avSupport || !facultyMentorEmail) {
    return res.status(400).json({ success: false, msg: 'Missing required booking fields' });
  }

  const parsedStart = new Date(startDate);
  const parsedEnd = new Date(endDate);
  if (Number.isNaN(parsedStart.getTime()) || Number.isNaN(parsedEnd.getTime())) {
    return res.status(400).json({ success: false, msg: 'Invalid start or end date' });
  }
  if (parsedEnd <= parsedStart) {
    return res.status(400).json({ success: false, msg: 'End time must be after start time' });
  }

  // Use a single dedicated connection (not the shared pool) so BEGIN/COMMIT
  // and the row lock below all happen on the same underlying Postgres session.
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // FOR UPDATE locks any matching rows for the duration of this transaction.
    // A second concurrent request for the same lecture hall/date range will
    // block here until this transaction COMMITs or ROLLBACKs, closing the
    // check-then-insert race window that existed in the previous version
    // (which used pool.query with no transaction/lock at all). This is the
    // fast path: it lets us return a clear, friendly rejection message
    // *before* attempting the insert in the common case.
    const conflictResult = await client.query(
      `SELECT * FROM bookings
       WHERE lt_number = $1
         AND start_date <= $2
         AND end_date >= $3
       FOR UPDATE`,
      [ltNumber, endDate, startDate]
    );

    const existingBooking = conflictResult.rows[0];

    if (existingBooking) {
      const fullyApproved =
        existingBooking.faculty_status === 'approved' &&
        existingBooking.assistant_registrar_status === 'approved' &&
        (existingBooking.av_support === 'no' ||
          (existingBooking.av_support === 'yes' &&
            existingBooking.system_administrator_status === 'approved'));

      const anyPending =
        existingBooking.faculty_status === 'pending' ||
        existingBooking.assistant_registrar_status === 'pending' ||
        (existingBooking.av_support === 'yes' &&
          existingBooking.system_administrator_status === 'pending');

      if (fullyApproved) {
        await client.query('ROLLBACK');
        return res.status(200).json({
          msg: `LT Already Booked by ${existingBooking.club_name}`,
          success: false,
        });
      } else if (anyPending) {
        await client.query('ROLLBACK');
        return res.status(200).json({
          msg: `LT Already Requested by ${existingBooking.club_name}`,
          success: false,
        });
      }
      // Existing booking was found but is neither fully approved nor pending
      // (e.g. it was rejected) -- fall through and allow the new request.
    }

    await client.query(
      `INSERT INTO bookings
         (lt_number, start_date, end_date, start_time, end_time, reason, club_name, booked_by, av_support, faculty_mentor_email, pdf)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [ltNumber, startDate, endDate, startTime, endTime, reason, clubName, bookedBy, avSupport, facultyMentorEmail, pdf || null]
    );

    await client.query('COMMIT');

    return res.status(200).json({ success: true, msg: 'Successfully Made Request for an LT' });
  } catch (error) {
    await client.query('ROLLBACK');

    // 23P01 = exclusion_violation: the schema-level EXCLUDE constraint on
    // bookings (see config/database.js) rejected the insert because it
    // overlaps an existing active booking for the same lecture hall. This
    // is the backstop for the rare case where the FOR UPDATE check above
    // didn't already catch the conflict -- treat it the same way as the
    // application-level conflict above instead of surfacing a raw 500.
    if (error.code === '23P01') {
      return res.status(200).json({
        msg: 'LT Already Requested or Booked for an overlapping time range',
        success: false,
      });
    }

    // 23514 = check_violation: covers the bookings_end_after_start
    // constraint as a final backstop behind the validation at the top of
    // this function.
    if (error.code === '23514') {
      return res.status(400).json({ success: false, msg: 'End time must be after start time' });
    }

    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

module.exports.getAllRequestsByMe = async (req, res) => {
  try {
    // The caller's identity (and therefore which bookings are "theirs")
    // must come from the verified JWT, not a client-supplied query param --
    // previously `id` was read from req.query, so any authenticated gsec
    // user could view another user's bookings just by changing that value.
    // The JWT payload already carries the verified email (see
    // userAuthController.login/signup), so there's no need for a DB lookup
    // here at all.
    const email = req.user.email;

    // Approved: faculty approved, AR approved, and (no AV or SA approved)
    const approvedResult = await pool.query(
      `SELECT * FROM bookings
       WHERE booked_by = $1
         AND faculty_status = 'approved'
         AND assistant_registrar_status = 'approved'
         AND (
           av_support = 'no'
           OR (av_support = 'yes' AND system_administrator_status = 'approved')
         )`,
      [email]
    );

    // Pending: at least one status is pending, none rejected
    const pendingResult = await pool.query(
      `SELECT * FROM bookings
       WHERE booked_by = $1
         AND faculty_status != 'rejected'
         AND assistant_registrar_status != 'rejected'
         AND system_administrator_status != 'rejected'
         AND (
           faculty_status = 'pending'
           OR assistant_registrar_status = 'pending'
           OR (av_support = 'yes' AND system_administrator_status = 'pending')
         )`,
      [email]
    );

    // Rejected: at least one status is rejected
    const rejectedResult = await pool.query(
      `SELECT * FROM bookings
       WHERE booked_by = $1
         AND (
           faculty_status = 'rejected'
           OR assistant_registrar_status = 'rejected'
           OR (av_support = 'yes' AND system_administrator_status = 'rejected')
         )`,
      [email]
    );

    res.status(200).json({
      message: 'successfully fetched all approved requests',
      pendingRequests: rowsToCamelCase(pendingResult.rows),
      approvedRequests: rowsToCamelCase(approvedResult.rows),
      rejectedRequests: rowsToCamelCase(rejectedResult.rows),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, msg: 'error' });
  }
};
