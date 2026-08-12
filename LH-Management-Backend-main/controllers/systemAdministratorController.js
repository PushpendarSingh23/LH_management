const { pool } = require('../config/database');
const { rowsToCamelCase } = require('../utils/caseConverter');
const { makeApproveOrReject } = require('../utils/reviewActions');

module.exports.getPendingRequests = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM bookings
       WHERE system_administrator_status = 'pending'
         AND av_support = 'yes'`
    );
    res.status(200).json({ message: 'successfully fetched all pending requests', pendingRequests: rowsToCamelCase(result.rows) });
  } catch (e) {
    res.status(500).json({ success: false, msg: 'error' });
  }
};

module.exports.getApprovedRequests = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM bookings
       WHERE system_administrator_status = 'approved'
         AND av_support = 'yes'`
    );
    res.status(200).json({ message: 'successfully fetched all pending requests', approvedRequests: rowsToCamelCase(result.rows) });
  } catch (e) {
    res.status(500).json({ success: false, msg: 'error' });
  }
};

module.exports.approveOrReject = makeApproveOrReject('system_administrator_status');

module.exports.getAllRequest = async (req, res) => {
  try {
    // Pending SA status (AV support required)
    const pendingResult = await pool.query(
      `SELECT * FROM bookings
       WHERE av_support = 'yes'
         AND system_administrator_status = 'pending'
         AND assistant_registrar_status IN ('pending', 'approved')
         AND faculty_status IN ('pending', 'approved')`
    );

    // Approved SA status
    const approvedResult = await pool.query(
      `SELECT * FROM bookings
       WHERE av_support = 'yes'
         AND system_administrator_status = 'approved'
         AND assistant_registrar_status IN ('pending', 'approved')
         AND faculty_status IN ('pending', 'approved')`
    );

    // Rejected SA status
    const rejectedResult = await pool.query(
      `SELECT * FROM bookings
       WHERE av_support = 'yes'
         AND system_administrator_status = 'rejected'
         AND assistant_registrar_status IN ('pending', 'approved')
         AND faculty_status IN ('pending', 'approved')`
    );

    res.status(200).json({
      message: 'successfully fetched all requests',
      pendingRequests: rowsToCamelCase(pendingResult.rows),
      approvedRequests: rowsToCamelCase(approvedResult.rows),
      rejectedRequests: rowsToCamelCase(rejectedResult.rows),
    });
  } catch (e) {
    res.status(500).json({ success: false, msg: 'error' });
  }
};
