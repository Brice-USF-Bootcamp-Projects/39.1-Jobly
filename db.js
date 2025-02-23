// db.js  

"use strict";

/** Database setup for Jobly. */
require("dotenv").config();
const { Client } = require("pg");
const url = require("url");

/**
 * Creates and returns a PostgreSQL client while handling database connection securely.
 * It dynamically injects the password into DATABASE_URL to avoid double `@` issues.
 */
function createDbClient() {
  try {
    let connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      console.error("❌ DATABASE_URL is not set in .env file.");
      process.exit(1);
    }

    // ✅ Inject password dynamically if PGPASSWORD is set
    if (process.env.PGPASSWORD) {
      const parsedUrl = new url.URL(connectionString);
      parsedUrl.password = process.env.PGPASSWORD;
      connectionString = parsedUrl.toString();
    }

    // Determine if SSL should be enabled
    const isProduction = process.env.NODE_ENV === "production";
    const sslConfig = isProduction ? { rejectUnauthorized: false } : false;

    // Create database client configuration
    const dbConfig = {
      connectionString,
      ssl: sslConfig,
    };

    // Debugging (remove in production)
    console.log("🔍 Updated DATABASE_URL:", connectionString.replace(process.env.PGPASSWORD, "********"));
    console.log("🔑 DB Config:", dbConfig);

    // Skip database connection in test mode
    if (process.env.NODE_ENV === "test") {
      console.log("🛑 Skipping DB connection in test mode.");
      return null;
    }

    // Initialize and connect the database client
    const db = new Client(dbConfig);
    db.connect()
      .then(() => console.log("✅ Database connection successful"))
      .catch((err) => {
        console.error("❌ Database connection error:", err);
        process.exit(1);
      });

    return db;
  } catch (error) {
    console.error("🔥 Critical Error Initializing Database:", error);
    process.exit(1);
  }
}

// Export the database client
const db = createDbClient();
module.exports = db;
