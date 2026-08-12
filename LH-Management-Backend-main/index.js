const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const gsecRoutes = require('./routes/gsecRoutes');
const assistantRegistrarRoutes = require('./routes/assistantRegistrarRoutes');
const guardRoutes = require('./routes/guardRoutes');
const facultyMentorRoutes = require('./routes/facultyMentorRoutes');
const systemAdministratorRoutes = require('./routes/systemAdministratorRoutes');
const jwt = require('jsonwebtoken');
// authenticate/authorize used to be duplicated across three separate
// middleware files (verifyToken.js, roleBasedMiddlewares.js, and this one).
// authMiddlewares.js is now the single source of truth for both.
const { authenticate, authorize } = require('./middlewares/authMiddlewares');
const { connectDB, initDB, pool } = require('./config/database');
var cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

// Middlewares
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000'],
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to PostgreSQL and initialize schema
(async () => {
  await connectDB();
  await initDB();
})();

// Routes
app.use('/auth', authRoutes);
app.use('/facultyMentor', facultyMentorRoutes);
app.use('/gsec', gsecRoutes);
app.use('/guard', guardRoutes);
app.use('/systemAdministrator', systemAdministratorRoutes);
app.use('/assistantRegistrar', assistantRegistrarRoutes);

app.get('/api/user', authenticate, (req, res) => {
  const userData = req.user;
  res.status(200).json({ user: userData });
});

// Manual trigger to delete expired bookings
// Restricted to systemAdministrator -- this route used to have no auth guard
// at all, so anyone who knew the URL could trigger a mass delete of bookings.
app.get('/deleteUnwanted', authenticate, authorize(['systemAdministrator']), async (req, res) => {
  const currentDate = new Date().toISOString();
  console.log('inside scheduler', new Date());
  try {
    const result = await pool.query(
      'DELETE FROM bookings WHERE end_date < $1',
      [currentDate]
    );
    const deletedCount = result.rowCount;
    if (deletedCount === 0) {
      console.log('No bookings found to delete.');
      return res.status(200).json({ message: 'No bookings found to delete.' });
    }
    console.log(`${deletedCount} bookings deleted`);
    return res.status(200).json({ message: `${deletedCount} bookings deleted` });
  } catch (err) {
    console.error('Error occurred while deleting bookings:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Cron job: delete expired bookings daily at 21:22
cron.schedule('22 21 * * *', async () => {
  const currentDate = new Date().toISOString();
  console.log('inside scheduler');
  try {
    const result = await pool.query(
      'DELETE FROM bookings WHERE end_date < $1',
      [currentDate]
    );
    console.log(`${result.rowCount} bookings deleted`);
  } catch (err) {
    console.error('Error occurred while deleting bookings:', err);
  }
});

app.listen(9000, () => {
  console.log('Server running on port 9000');
});
