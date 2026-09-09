const axios = require('axios');

const PLATFORM = 'codechef';

async function fetchCodeChefContests() {
  const { data } = await axios.get(
    'https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all',
    {
      timeout: 15000,
      headers: { 'User-Agent': 'CodePing/1.0' },
    }
  );

  const future = data?.future_contests || [];
  const present = data?.present_contests || [];
  const all = [...present, ...future];

  return all.slice(0, 30).map((c) => {
    const startTime = new Date(c.contest_start_date_iso);
    const endTime = new Date(c.contest_end_date_iso);
    const durationMinutes = Math.max(
      0,
      Math.round((endTime.getTime() - startTime.getTime()) / 60000)
    );

    const now = Date.now();
    let status = 'upcoming';
    if (now >= startTime.getTime() && now < endTime.getTime()) status = 'running';

    return {
      externalId: String(c.contest_code),
      platform: PLATFORM,
      name: c.contest_name,
      url: `https://www.codechef.com/${c.contest_code}`,
      startTime,
      endTime,
      durationMinutes,
      status,
      raw: { contest_code: c.contest_code },
    };
  });
}

module.exports = { fetchCodeChefContests, PLATFORM };
