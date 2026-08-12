const { pool } = require('../config/database');

const SystemAdministrator = {
  async findByUserId(userId) {
    const result = await pool.query(
      'SELECT * FROM system_administrators WHERE user_id = $1',
      [userId]
    );
    return result.rows[0] || null;
  },

  async create(userId) {
    const result = await pool.query(
      'INSERT INTO system_administrators (user_id) VALUES ($1) RETURNING *',
      [userId]
    );
    return result.rows[0];
  },
};

module.exports = SystemAdministrator;
