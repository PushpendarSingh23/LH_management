const { pool } = require('../config/database');

const Guard = {
  async findByUserId(userId) {
    const result = await pool.query(
      'SELECT * FROM guards WHERE user_id = $1',
      [userId]
    );
    return result.rows[0] || null;
  },

  async create(userId) {
    const result = await pool.query(
      'INSERT INTO guards (user_id) VALUES ($1) RETURNING *',
      [userId]
    );
    return result.rows[0];
  },
};

module.exports = Guard;
