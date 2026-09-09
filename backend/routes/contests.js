const express = require('express');
const { syncAllContests, getContests } = require('../services/contestAggregator');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { platform, status, search } = req.query;
    const contests = await getContests({ platform, status, search });
    return res.json({ count: contests.length, contests });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/platforms', (_req, res) => {
  return res.json({
    platforms: [
      { id: 'codeforces', name: 'Codeforces', color: '#1f8acb' },
      { id: 'leetcode', name: 'LeetCode', color: '#ffa116' },
      { id: 'codechef', name: 'CodeChef', color: '#5b4638' },
      { id: 'atcoder', name: 'AtCoder', color: '#000000' },
    ],
  });
});

router.post('/sync', async (_req, res) => {
  try {
    const summary = await syncAllContests();
    return res.json({ message: 'Contest sync completed', summary });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
