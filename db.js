// db.js  

"use strict";

/** Database setup for Jobly. */

const { Client } = require("pg");
const { getDatabaseUri } = require("./config");
const url = require("url");

function createDbClient() {
  try {
    const connectionString = getDatabaseUri();
    const isProduction = process.env.NODE_ENV === "production";

    // Parse the database URL
    const params = new url.URL(connectionString);

    const dbConfig = {
      host: params.hostname,
      port: params.port || "5432",
      user: params.username,
      database: params.pathname.replace(/^\//, ""),
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    };

    // 🛠️ Decode password and explicitly cast it to a string
    if (params.password) {
      dbConfig.password = String(decodeURIComponent(params.password)); // Force string conversion
    } else {
      console.warn("⚠️ No password found in DATABASE_URL");
    }

    console.log("🔍 DB Config:", dbConfig);
    console.log("🛠 Password Type Check:", typeof dbConfig.password, `"${dbConfig.password}"`); // Should be "string"

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

const db = createDbClient();

module.exports = db;

