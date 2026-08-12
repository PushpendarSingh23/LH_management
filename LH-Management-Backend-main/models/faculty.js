const { pool } = require('../config/database');

const Faculty = {
  async findByUserId(userId) {
    const result = await pool.query(
      'SELECT * FROM faculty_mentors WHERE user_id = $1',
      [userId]
    );
    return result.rows[0] || null;
  },

  async create(userId, clubName) {
    const result = await pool.query(
      'INSERT INTO faculty_mentors (user_id, club_name) VALUES ($1, $2) RETURNING *',
      [userId, clubName]
    );
    return result.rows[0];
  },
};

module.exports = Faculty;
