const express = require('express');
const cors = require('cors');
const applySecurity = require('./middleware/security');
const { authLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/auth');
const contestRoutes = require('./routes/contests');
const reminderRoutes = require('./routes/reminders');
const { isEmailConfigured } = require('./services/emailService');

function createApp() {
  const app = express();

  applySecurity(app);

  app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'CodePing API',
      emailConfigured: isEmailConfigured(),
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/auth', authLimiter, authRoutes);
  app.use('/api/contests', contestRoutes);
  app.use('/api/reminders', reminderRoutes);

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  });

  return app;
}

module.exports = createApp();
