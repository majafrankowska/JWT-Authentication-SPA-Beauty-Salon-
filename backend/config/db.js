const mysql = require("mysql2");
require("dotenv").config();

const pool = process.env.DB_URL
  ? mysql.createPool({ uri: process.env.DB_URL }) 
  : mysql.createPool({ 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  });

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.code, err.message, err.stack);
  } else {
    console.log("Connected to database.");
    connection.release();
  }
});

module.exports = pool.promise();
