const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const secretKey = require('../config/jwt');
require('dotenv').config();

// /auth/signup is a public, unauthenticated endpoint -- there's no admin
// gate in front of it. It used to accept whatever `role` the client sent,
// which meant anyone could register themselves as 'systemAdministrator' and
// get full access. The frontend only ever exposes a login form (no signup
// UI), so in practice the only role that should be self-registerable here
// is 'gsec' (club representatives); every other role is expected to be
// provisioned directly in the database by whoever administers the system.
const SELF_SIGNUP_ROLES = ['gsec'];

module.exports.signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!SELF_SIGNUP_ROLES.includes(role)) {
      return res.status(400).json({ message: 'Invalid role for self-signup' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ email, password: hashedPassword, role });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      secretKey,
      { expiresIn: '1d' }
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: true,
    });

    res.status(201).json({ message: 'Signup successful', user: { email: newUser.email, role: newUser.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      secretKey,
      { expiresIn: '1d' }
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: true,
    });

    const sessionUser = { id: user.id, email: user.email, role: user.role };

    res.json({ message: 'Login successful', user: sessionUser });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports.logout = async (req, res) => {
  res.clearCookie('jwt', { sameSite: 'none', secure: true });
  res.json({ message: 'Logout successful' });
};
