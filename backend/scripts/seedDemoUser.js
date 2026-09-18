require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');

// Prevent accidental seeding on production instances unless explicitly allowed.
if (process.env.NODE_ENV === 'production' && process.env.SEED_ALLOW_PRODUCTION !== 'true') {
  console.log('Refusing to seed demo user in production');
  process.exit(1);
}

async function seedDemoUser() {
  await connectDB();

  const email = 'demo@codeping.dev';
  const existing = await User.findOne({ email });

  if (existing) {
    console.log('Demo user already exists:', email);
    process.exit(0);
  }

  await User.create({
    name: 'Demo User',
    email,
    password: 'demo123',
  });

  console.log('Demo user created');
  console.log('  Email: demo@codeping.dev');
  console.log('  Password: demo123');
  process.exit(0);
}

seedDemoUser().catch((err) => {
  console.error(err);
  process.exit(1);
});
