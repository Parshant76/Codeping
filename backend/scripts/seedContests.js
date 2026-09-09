require('dotenv').config();
const connectDB = require('./config/db');
const { syncAllContests } = require('./services/contestAggregator');
const { startCronJobs } = require('./jobs/cronJobs');

async function seed() {
  await connectDB();
  console.log('Running initial contest sync...');
  const summary = await syncAllContests();
  console.log('Sync summary:', JSON.stringify(summary, null, 2));
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
