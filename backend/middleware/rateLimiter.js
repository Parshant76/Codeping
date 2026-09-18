const rateLimit = require("express-rate-limit");

// Auth endpoints get hit by credential-stuffing bots constantly, even on
// small unknown projects - 20 attempts per 15 min per IP is generous for a
// real user, painful for a brute-force script.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/contests/sync currently has no auth on it and triggers multiple
// outbound calls. This limiter caps it hard regardless of who's calling it -
// pair with real auth on this route as the actual fix.
const syncLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 6,
  message: { message: "Sync endpoint is rate-limited. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, syncLimiter };
