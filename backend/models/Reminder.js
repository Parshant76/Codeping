const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contest: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest', required: true },
    remindBeforeMinutes: { type: Number, default: 60 },
    emailSent: { type: Boolean, default: false },
    sentAt: { type: Date },
  },
  { timestamps: true }
);

reminderSchema.index({ user: 1, contest: 1 }, { unique: true });

module.exports = mongoose.model('Reminder', reminderSchema);
