// routes/_testCommon.js

"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Company = require("../models/company");
const { createToken } = require("../helpers/tokens");

/** Common setup before all tests run.
 *
 * - Clears out existing users and companies.
 * - Populates the test database with companies.
 * - Registers three users, including one admin.
 */
async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM companies");

  // Add test companies
  await Company.create({
    handle: "c1",
    name: "C1",
    numEmployees: 1,
    description: "Desc1",
    logoUrl: "http://c1.img",
  });

  await Company.create({
    handle: "c2",
    name: "C2",
    numEmployees: 2,
    description: "Desc2",
    logoUrl: "http://c2.img",
  });

  await Company.create({
    handle: "c3",
    name: "C3",
    numEmployees: 3,
    description: "Desc3",
    logoUrl: "http://c3.img",
  });

  // Add test users (including an admin)
  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isAdmin: false, // Regular user (non-admin)
  });

  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false, // Regular user (non-admin)
  });

  await User.register({
    username: "admin1", // Admin user for testing admin-restricted routes
    firstName: "Admin",
    lastName: "User",
    email: "admin@user.com",
    password: "adminpass",
    isAdmin: true, // Set as admin
  });
}

/** Runs before each test.
 *
 * - Begins a new transaction, so each test runs independently.
 */
async function commonBeforeEach() {
  await db.query("BEGIN");
}

/** Runs after each test.
 *
 * - Rolls back the transaction to ensure a clean slate for the next test.
 */
async function commonAfterEach() {
  await db.query("ROLLBACK");
}

/** Runs after all tests complete.
 *
 * - Ends the database connection.
 */
async function commonAfterAll() {
  await db.end();
}

// Generate JWT tokens for authentication in tests
const u1Token = createToken({ username: "u1", isAdmin: false }); // Token for regular user
const adminToken = createToken({ username: "admin1", isAdmin: true }); // Token for admin user

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token, // Regular user token
  adminToken, // Admin user token for tests requiring admin access
};
