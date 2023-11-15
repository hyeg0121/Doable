require('dotenv').config();
const mysql = require('mysql2');
const config = require('../config/config.json')
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME
});

module.exports = pool;
