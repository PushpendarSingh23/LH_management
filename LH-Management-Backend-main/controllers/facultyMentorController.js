const { pool } = require('../config/database');
const { rowsToCamelCase } = require('../utils/caseConverter');
const { makeApproveOrReject } = require('../utils/reviewActions');

module.exports.getAllRequests = async (req, res) => {
  try {
    // Same fix as gsecController.getAllRequestsByMe: identity comes from
    // the verified JWT (req.user), not a client-supplied ?id= query param.
    // The JWT already carries the verified email, so no DB lookup is
    // needed here.
    const email = req.user.email;

    // Pending faculty status
    const pendingResult = await pool.query(
      `SELECT * FROM bookings
       WHERE faculty_mentor_email = $1
         AND faculty_status = 'pending'
         AND assistant_registrar_status IN ('pending', 'approved')
         AND (
           av_support = 'no'
           OR (av_support = 'yes' AND system_administrator_status IN ('pending', 'approved'))
         )`,
      [email]
    );

    // Approved faculty status
    const approvedResult = await pool.query(
      `SELECT * FROM bookings
       WHERE faculty_mentor_email = $1
         AND faculty_status = 'approved'
         AND assistant_registrar_status IN ('pending', 'approved')
         AND (
           av_support = 'no'
           OR (av_support = 'yes' AND system_administrator_status IN ('pending', 'approved'))
         )`,
      [email]
    );

    // Rejected faculty status
    const rejectedResult = await pool.query(
      `SELECT * FROM bookings
       WHERE faculty_mentor_email = $1
         AND faculty_status = 'rejected'
         AND assistant_registrar_status IN ('pending', 'approved')
         AND (
           av_support = 'no'
           OR (av_support = 'yes' AND system_administrator_status IN ('pending', 'approved'))
         )`,
      [email]
    );

    res.status(200).json({
      message: 'successfully fetched all pending requests',
      pendingRequests: rowsToCamelCase(pendingResult.rows),
      approvedRequests: rowsToCamelCase(approvedResult.rows),
      rejectedRequests: rowsToCamelCase(rejectedResult.rows),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, msg: e.message });
  }
};

module.exports.approveOrReject = makeApproveOrReject('faculty_status');
