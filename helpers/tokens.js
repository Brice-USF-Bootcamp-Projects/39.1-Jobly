// helpers/tokens.js

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

function createToken(user) {
  if (!user.username) throw new Error("createToken passed user without username");
  if (user.isAdmin === undefined) user.isAdmin = false; // Ensure isAdmin is always set

  return jwt.sign(
    { username: user.username, isAdmin: user.isAdmin },
    SECRET_KEY,
    { expiresIn: "24h" }
  );
}

module.exports = { createToken };

