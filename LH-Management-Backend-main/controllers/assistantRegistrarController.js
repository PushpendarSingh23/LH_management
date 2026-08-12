const { pool } = require('../config/database');
const { rowsToCamelCase } = require('../utils/caseConverter');
const { makeApproveOrReject } = require('../utils/reviewActions');

module.exports.getAllRequests = async (req, res) => {
  try {
    // Pending AR status
    const pendingResult = await pool.query(
      `SELECT * FROM bookings
       WHERE assistant_registrar_status = 'pending'
         AND faculty_status IN ('pending', 'approved')
         AND (
           av_support = 'no'
           OR (av_support = 'yes' AND system_administrator_status IN ('pending', 'approved'))
         )`
    );

    // Approved AR status
    const approvedResult = await pool.query(
      `SELECT * FROM bookings
       WHERE assistant_registrar_status = 'approved'
         AND faculty_status IN ('pending', 'approved')
         AND (
           av_support = 'no'
           OR (av_support = 'yes' AND system_administrator_status IN ('pending', 'approved'))
         )`
    );

    // Rejected AR status
    const rejectedResult = await pool.query(
      `SELECT * FROM bookings
       WHERE assistant_registrar_status = 'rejected'
         AND faculty_status IN ('pending', 'approved')
         AND (
           av_support = 'no'
           OR (av_support = 'yes' AND system_administrator_status IN ('pending', 'approved'))
         )`
    );

    res.status(200).json({
      message: 'successfully fetched all requests',
      pendingRequests: rowsToCamelCase(pendingResult.rows),
      approvedRequests: rowsToCamelCase(approvedResult.rows),
      rejectedRequests: rowsToCamelCase(rejectedResult.rows),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, msg: 'error' });
  }
};

module.exports.approveOrReject = makeApproveOrReject('assistant_registrar_status');
