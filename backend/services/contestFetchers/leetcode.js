const axios = require('axios');

const PLATFORM = 'leetcode';

const CONTEST_QUERY = `
  query {
    upcomingContests {
      title
      titleSlug
      startTime
      duration
    }
  }
`;

async function fetchLeetCodeContests() {
  const { data } = await axios.post(
    'https://leetcode.com/graphql',
    { query: CONTEST_QUERY },
    {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://leetcode.com/contest/',
      },
    }
  );

  const contests = data?.data?.upcomingContests || [];

  return contests.map((c) => {
    const startTime = new Date(c.startTime * 1000);
    const durationMinutes = Math.round((c.duration || 0) / 60);
    const endTime = new Date(startTime.getTime() + (c.duration || 0) * 1000);
    const now = Date.now();

    let status = 'upcoming';
    if (now >= startTime.getTime() && now < endTime.getTime()) status = 'running';
    if (now >= endTime.getTime()) status = 'finished';

    return {
      externalId: String(c.titleSlug || c.title),
      platform: PLATFORM,
      name: c.title,
      url: `https://leetcode.com/contest/${c.titleSlug}`,
      startTime,
      endTime,
      durationMinutes,
      status,
      raw: { title_slug: c.titleSlug },
    };
  }).filter((c) => c.status !== 'finished');
}

module.exports = { fetchLeetCodeContests, PLATFORM };
