const { pool } = require('../config/database');

const Gsec = {
  async findByUserId(userId) {
    const result = await pool.query(
      'SELECT * FROM gsecs WHERE user_id = $1',
      [userId]
    );
    return result.rows[0] || null;
  },

  async create(userId, rollNumber, councilName) {
    const result = await pool.query(
      'INSERT INTO gsecs (user_id, roll_number, council_name) VALUES ($1, $2, $3) RETURNING *',
      [userId, rollNumber, councilName]
    );
    return result.rows[0];
  },
};

module.exports = Gsec;
