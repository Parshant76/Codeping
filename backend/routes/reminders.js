const express = require('express');
const Reminder = require('../models/Reminder');
const Contest = require('../models/Contest');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id })
      .populate('contest')
      .sort({ createdAt: -1 });

    return res.json({ count: reminders.length, reminders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { contestId, remindBeforeMinutes = 60 } = req.body;

    if (!contestId) {
      return res.status(400).json({ message: 'contestId is required' });
    }

    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    if (contest.status === 'finished') {
      return res.status(400).json({ message: 'Cannot set reminder for finished contest' });
    }

    const reminder = await Reminder.findOneAndUpdate(
      { user: req.user.id, contest: contestId },
      { remindBeforeMinutes, emailSent: false, sentAt: null },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).populate('contest');

    return res.status(201).json({ message: 'Reminder saved', reminder });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Reminder already exists' });
    }
    return res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    return res.json({ message: 'Reminder deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.patch('/preferences', async (req, res) => {
  try {
    const { favoritePlatforms } = req.body;

    if (!Array.isArray(favoritePlatforms) || favoritePlatforms.length === 0) {
      return res.status(400).json({ message: 'favoritePlatforms must be a non-empty array' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { favoritePlatforms },
      { new: true }
    ).select('-password');

    return res.json({ message: 'Preferences updated', user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
