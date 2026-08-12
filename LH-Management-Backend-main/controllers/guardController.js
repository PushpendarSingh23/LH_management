const { pool } = require('../config/database');
const { rowsToCamelCase } = require('../utils/caseConverter');

module.exports.getApprovedRequests = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM bookings
       WHERE assistant_registrar_status = 'approved'
         AND faculty_status = 'approved'
         AND (
           av_support = 'no'
           OR (av_support = 'yes' AND system_administrator_status = 'approved')
         )`
    );
    res.status(200).json({ message: 'successfully fetched all approved requests', approvedRequests: rowsToCamelCase(result.rows) });
  } catch (e) {
    res.status(500).json({ success: false, msg: 'error' });
  }
};
