const { pool } = require('../config/database');

const User = {
  async findOne({ email }) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  },

  async findById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async create({ name, email, password, role }) {
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name || null, email, password, role]
    );
    return result.rows[0];
  },
};

module.exports = User;
