require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const contestRoutes = require('./routes/contests');
const reminderRoutes = require('./routes/reminders');
const { syncAllContests } = require('./services/contestAggregator');
const { startCronJobs } = require('./jobs/cronJobs');
const { isEmailConfigured } = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 5000;

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

app.use('/api/auth', authRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/reminders', reminderRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

async function bootstrap() {
  await connectDB();

  console.log('Running startup contest sync...');
  const summary = await syncAllContests();
  console.log('Startup sync:', summary);

  startCronJobs();

  app.listen(PORT, () => {
    console.log(`CodePing API running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
