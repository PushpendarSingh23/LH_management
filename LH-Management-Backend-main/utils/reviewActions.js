// utils/reviewActions.js
//
// facultyMentorController, assistantRegistrarController, and
// systemAdministratorController each had their own approveOrReject
// function. All three did the exact same thing -- look up the booking,
// validate the action, UPDATE one status column -- and differed only in
// which column they wrote to. This factory replaces all three copies
// with one implementation, parameterized by the column name.
//
// statusColumn is always a hardcoded string supplied by the controller
// (never derived from request input), so building the query with a
// template literal here is safe -- it's not user-controlled.

const { pool } = require('../config/database');
const { rowToCamelCase } = require('./caseConverter');

function makeApproveOrReject(statusColumn) {
  return async function approveOrReject(req, res) {
    try {
      const { id, action } = req.body;

      const bookingResult = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
      const booking = bookingResult.rows[0];
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      if (action !== 'approve' && action !== 'reject') {
        return res.status(400).json({ message: 'Invalid action' });
      }

      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      const updated = await pool.query(
        `UPDATE bookings SET ${statusColumn} = $1 WHERE id = $2 RETURNING *`,
        [newStatus, id]
      );

      res.json({ message: `Booking ${action}d successfully`, booking: rowToCamelCase(updated.rows[0]) });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = { makeApproveOrReject };
