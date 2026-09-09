const { createTransporter, isEmailConfigured } = require('../config/email');

async function sendReminderEmail({ to, userName, contest, remindBeforeMinutes }) {
  if (!isEmailConfigured()) {
    console.log(`[email] Skipped (not configured) reminder for ${to} – ${contest.name}`);
    return { skipped: true, reason: 'Email not configured' };
  }

  const transporter = createTransporter();
  const startFormatted = new Date(contest.startTime).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6366f1;">CodePing Contest Reminder</h2>
      <p>Hi ${userName},</p>
      <p>Your contest starts in about <strong>${remindBeforeMinutes} minutes</strong>.</p>
      <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p><strong>${contest.name}</strong></p>
        <p>Platform: ${contest.platform}</p>
        <p>Start: ${startFormatted} (IST)</p>
        <p>Duration: ${contest.durationMinutes || 'N/A'} minutes</p>
      </div>
      <p><a href="${contest.url}" style="background:#6366f1;color:white;padding:10px 16px;border-radius:6px;text-decoration:none;">Open Contest</a></p>
      <p style="color:#6b7280;font-size:12px;">Manage reminders at ${process.env.CLIENT_URL || 'http://localhost:5173'}</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject: `Reminder: ${contest.name} starts soon`,
    html,
  });

  return { sent: true };
}

module.exports = { sendReminderEmail, isEmailConfigured };
