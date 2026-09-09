require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');

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
