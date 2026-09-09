const axios = require('axios');

const PLATFORM = 'codeforces';

function mapStatus(phase) {
  if (phase === 'BEFORE') return 'upcoming';
  if (phase === 'CODING' || phase === 'PENDING_SYSTEM_TEST') return 'running';
  return 'finished';
}

async function fetchCodeforcesContests() {
  const { data } = await axios.get('https://codeforces.com/api/contest.list', {
    timeout: 15000,
    headers: { 'User-Agent': 'CodePing/1.0' },
  });

  if (data.status !== 'OK') {
    throw new Error('Codeforces API returned non-OK status');
  }

  const now = Date.now();

  return data.result
    .filter((c) => c.phase === 'BEFORE' || c.phase === 'CODING')
    .slice(0, 40)
    .map((c) => {
      const startTime = new Date(c.startTimeSeconds * 1000);
      const durationMinutes = Math.round((c.durationSeconds || 0) / 60);
      const endTime = new Date(startTime.getTime() + (c.durationSeconds || 0) * 1000);

      let status = mapStatus(c.phase);
      if (status === 'upcoming' && startTime.getTime() <= now && endTime.getTime() > now) {
        status = 'running';
      }

      return {
        externalId: String(c.id),
        platform: PLATFORM,
        name: c.name,
        url: `https://codeforces.com/contest/${c.id}`,
        startTime,
        endTime,
        durationMinutes,
        status,
        raw: { phase: c.phase, type: c.type },
      };
    });
}

module.exports = { fetchCodeforcesContests, PLATFORM };
