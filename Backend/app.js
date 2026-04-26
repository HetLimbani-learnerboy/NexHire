const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Database Connection */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => {
    console.log("Connected to Neon database successfully");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NexHire ATS Backend Running Successfully"
  });
});

/* Server */
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, pool };