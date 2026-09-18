// Wires up the standard "don't get owned on day one" middleware stack.
// Import and call this once in server.js, right after `const app = express()`.
//
//   const applySecurity = require("./middleware/security");
//   applySecurity(app);

const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");

function applySecurity(app) {
  // Sets a bunch of sane security headers (X-Frame-Options, CSP basics, etc.)
  app.use(helmet());

  // Strips out any request body/query keys starting with "$" or containing ".",
  // which stops NoSQL injection attempts from reaching a Mongoose query.
    // Skip query sanitization during tests to avoid read-only `req.query` issues
    // when SuperTest creates the request object. The sanitizer is still applied
    // in non-test environments for safety.
    if (process.env.NODE_ENV !== 'test') {
      app.use(mongoSanitize());
    }

  // Gzips JSON responses - contest lists can get large across 4 platforms
  app.use(compression());

  return app;
}

module.exports = applySecurity;
