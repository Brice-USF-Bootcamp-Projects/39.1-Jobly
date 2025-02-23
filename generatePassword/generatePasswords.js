// generatePassword/generatePasswords.js

const bcrypt = require("bcrypt");

const newPassword = "password123";  // Change this to your desired password
const hashedPassword = bcrypt.hashSync(newPassword, 12);

console.log("New hashed password:", hashedPassword);
