const Contest = require('../models/Contest');
const { fetchCodeforcesContests } = require('./contestFetchers/codeforces');
const { fetchLeetCodeContests } = require('./contestFetchers/leetcode');
const { fetchCodeChefContests } = require('./contestFetchers/codechef');
const { fetchAtCoderContests } = require('./contestFetchers/atcoder');

const fetchers = [
  { name: 'codeforces', fn: fetchCodeforcesContests },
  { name: 'leetcode', fn: fetchLeetCodeContests },
  { name: 'codechef', fn: fetchCodeChefContests },
  { name: 'atcoder', fn: fetchAtCoderContests },
];

async function upsertContests(contests) {
  let upserted = 0;

  for (const contest of contests) {
    await Contest.findOneAndUpdate(
      { platform: contest.platform, externalId: contest.externalId },
      contest,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    upserted += 1;
  }

  return upserted;
}

async function syncAllContests() {
  const summary = { total: 0, platforms: {}, errors: [] };

  for (const { name, fn } of fetchers) {
    try {
      const contests = await fn();
      const count = await upsertContests(contests);
      summary.platforms[name] = count;
      summary.total += count;
      console.log(`[sync] ${name}: ${count} contests`);
    } catch (error) {
      const message = error.message || 'Unknown error';
      summary.errors.push({ platform: name, message });
      console.error(`[sync] ${name} failed:`, message);
    }
  }

  await Contest.updateMany(
    { endTime: { $lt: new Date() }, status: { $ne: 'finished' } },
    { status: 'finished' }
  );

  return summary;
}

async function getContests(filters = {}) {
  const query = {};

  if (filters.platform) {
    query.platform = filters.platform;
  }

  if (filters.status) {
    query.status = filters.status;
  } else {
    query.status = { $in: ['upcoming', 'running'] };
  }

  if (filters.search) {
    query.name = { $regex: filters.search, $options: 'i' };
  }

  const contests = await Contest.find(query).sort({ startTime: 1 }).limit(200);
  return contests;
}

module.exports = { syncAllContests, getContests, upsertContests };
