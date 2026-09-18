require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app');
const { syncAllContests } = require('./services/contestAggregator');
const { startCronJobs } = require('./jobs/cronJobs');

const PORT = process.env.PORT || 5000;

async function start() {
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

start().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
