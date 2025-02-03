// middleware/auth.js

"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      const payload = jwt.verify(token, SECRET_KEY);
      console.log("Decoded Token Payload:", payload);  // Debugging
      res.locals.user = payload;
    }
    return next();
  } catch (err) {
    console.error("JWT Verification Failed:", err);  // Debugging
    return next();
  }
}


/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError("You must be logged in.");
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Middleware to ensure the user is an admin.
 *
 * If not, raises Unauthorized.
 */

function ensureAdmin(req, res, next) {
  try {
    console.log("Checking Admin Privileges for:", res.locals.user);

    if (!res.locals.user || !res.locals.user.isAdmin) {
      console.error("❌ Admin Check Failed: User is not admin or missing");
      throw new UnauthorizedError("Admin privileges required.");
    }

    return next();
  } catch (err) {
    return next(err);
  }
}


/** Middleware to ensure the user is the correct user or an admin.
 *
 * If not, raises Unauthorized.
 */

function ensureCorrectUserOrAdmin(req, res, next) {
  try {
    const user = res.locals.user;
    if (!(user && (user.isAdmin || user.username === req.params.username))) {
      throw new UnauthorizedError("Unauthorized access.");
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin,
};
