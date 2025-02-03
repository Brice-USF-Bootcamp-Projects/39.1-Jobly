// db.js  

"use strict";
/** Database setup for Jobly. */

const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

function createDbClient() {
  try {
    const connectionString = getDatabaseUri();
    const isProduction = process.env.NODE_ENV === "production";

    // Check if a password is provided (needed for your PC setup)
    const passwordRequired = Boolean(process.env.DB_PASSWORD);

    const dbConfig = {
      connectionString,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
      password: passwordRequired ? process.env.DB_PASSWORD : null, // Only set if required
    };

    console.log("📡 Connecting to database...");
    const db = new Client(dbConfig);

    db.connect()
      .then(() => console.log("✅ Database connection successful"))
      .catch((err) => {
        console.error("❌ Database connection error:", err);
        process.exit(1); // Exit process if DB fails
      });

    return db;
  } catch (error) {
    console.error("🔥 Critical Error Initializing Database:", error);
    process.exit(1); // Exit process on startup failure
  }
}

const db = createDbClient();

module.exports = db;
