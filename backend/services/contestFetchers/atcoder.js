const axios = require('axios');

const PLATFORM = 'atcoder';

async function fetchAtCoderContests() {
  const { data } = await axios.get('https://kenkoooo.com/atcoder/resources/contests.json', {
    timeout: 15000,
    headers: { 'User-Agent': 'CodePing/1.0' },
  });

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const twoWeeksFromNow = now + 14 * dayMs;

  return data
    .filter((c) => {
      const startMs = c.start_epoch_second * 1000;
      const durationMs = (c.duration_second || 0) * 1000;
      const maxDurationMs = 7 * dayMs;

      return (
        c.start_epoch_second > 0 &&
        durationMs > 0 &&
        durationMs <= maxDurationMs &&
        startMs >= now - dayMs &&
        startMs <= twoWeeksFromNow
      );
    })
    .slice(0, 30)
    .map((c) => {
      const startTime = new Date(c.start_epoch_second * 1000);
      const durationSeconds = c.duration_second || 7200;
      const endTime = new Date(startTime.getTime() + durationSeconds * 1000);
      const durationMinutes = Math.round(durationSeconds / 60);

      let status = 'upcoming';
      if (now >= startTime.getTime() && now < endTime.getTime()) status = 'running';

      return {
        externalId: String(c.id),
        platform: PLATFORM,
        name: c.title,
        url: `https://atcoder.jp/contests/${c.id}`,
        startTime,
        endTime,
        durationMinutes,
        status,
        raw: { id: c.id },
      };
    });
}

module.exports = { fetchAtCoderContests, PLATFORM };
