// config.js  

"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY;

const PORT = +process.env.PORT;


// Determine the correct database URI based on "development", "production", and "testing" as values for NODE_ENV:
function getDatabaseUri() {
  if (process.env.NODE_ENV === "production") {
    return process.env.PROD_DATABASE_URL; 
  } else if (process.env.NODE_ENV === "testing") {
    return process.env.TEST_DATABASE_URL;
  } else {
    return process.env.DEV_DATABASE_URL;
  }
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Jobly Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
