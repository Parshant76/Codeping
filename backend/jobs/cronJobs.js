const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const { syncAllContests } = require('../services/contestAggregator');
const { sendReminderEmail } = require('../services/emailService');

function startCronJobs() {
  const fetchSchedule = process.env.CONTEST_FETCH_CRON || '*/30 * * * *';
  const reminderSchedule = process.env.REMINDER_CRON || '*/15 * * * *';

  cron.schedule(fetchSchedule, async () => {
    console.log('[cron] Running contest sync...');
    try {
      await syncAllContests();
    } catch (error) {
      console.error('[cron] Contest sync failed:', error.message);
    }
  });

  cron.schedule(reminderSchedule, async () => {
    console.log('[cron] Checking due reminders...');
    try {
      await processDueReminders();
    } catch (error) {
      console.error('[cron] Reminder job failed:', error.message);
    }
  });

  console.log(`[cron] Contest sync scheduled: ${fetchSchedule}`);
  console.log(`[cron] Reminder check scheduled: ${reminderSchedule}`);
}

async function processDueReminders() {
  const now = Date.now();
  const reminders = await Reminder.find({ emailSent: false })
    .populate('contest')
    .populate('user');

  let sentCount = 0;

  for (const reminder of reminders) {
    if (!reminder.contest || !reminder.user) continue;
    if (reminder.contest.status === 'finished') {
      reminder.emailSent = true;
      await reminder.save();
      continue;
    }

    const startMs = new Date(reminder.contest.startTime).getTime();
    const remindAt = startMs - reminder.remindBeforeMinutes * 60 * 1000;

    if (now >= remindAt && now < startMs) {
      try {
        await sendReminderEmail({
          to: reminder.user.email,
          userName: reminder.user.name,
          contest: reminder.contest,
          remindBeforeMinutes: reminder.remindBeforeMinutes,
        });

        reminder.emailSent = true;
        reminder.sentAt = new Date();
        await reminder.save();
        sentCount += 1;
      } catch (error) {
        console.error(`[cron] Failed to send reminder to ${reminder.user.email}:`, error.message);
      }
    }
  }

  if (sentCount > 0) {
    console.log(`[cron] Sent ${sentCount} reminder email(s)`);
  }
}

module.exports = { startCronJobs, processDueReminders };
