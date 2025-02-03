// routes/main.js

const jsonschema = require("jsonschema");
const express = require("express");
const { BadRequestError } = require("../expressError");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Welcome to Jobly API!");
  });
  

module.exports = router;