const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true },
    platform: {
      type: String,
      required: true,
      enum: ['codeforces', 'leetcode', 'codechef', 'atcoder'],
    },
    name: { type: String, required: true },
    url: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    durationMinutes: { type: Number },
    status: {
      type: String,
      enum: ['upcoming', 'running', 'finished'],
      default: 'upcoming',
    },
    raw: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

contestSchema.index({ platform: 1, externalId: 1 }, { unique: true });
contestSchema.index({ startTime: 1 });
contestSchema.index({ status: 1, startTime: 1 });

module.exports = mongoose.model('Contest', contestSchema);
