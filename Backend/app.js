// const express = require("express");
// const cors = require("cors");
// const { Pool } = require("pg");
// require("dotenv").config();

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });

// module.exports = { app, pool };

// // const { createUsersTable } = require("./models/User");
// // const { createVendorsTable } = require("./models/Vendor");
// // const { createJobsTable } = require("./models/Job");
// // const { createJobVendorsTable } = require("./models/JobVendor");
// // const { createCandidatesTable } = require("./models/Candidate");
// // const { createCandidateStatusTable } = require("./models/CandidateStatus");
// // const { createInterviewsTable } = require("./models/Interview");
// // const { createFeedbackTable } = require("./models/Feedback");
// // const { createNotificationsTable } = require("./models/Notification");


// const initDB = async () => {
//     try {
//         await pool.connect();
//         console.log("Connected to Neon database successfully");

//         //     await createUsersTable();
//         //     await createVendorsTable();
//         //     await createJobsTable();
//         //     await createJobVendorsTable();
//         //     await createCandidatesTable();
//         //     await createCandidateStatusTable();
//         //     await createInterviewsTable();
//         //     await createFeedbackTable();
//         //     await createNotificationsTable();

//         //     console.log("All tables created successfully");
//     } catch (err) {
//         console.error("Database connection error:", err);
//     }
// };

// initDB();

// app.get("/", (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: "NexHire ATS Backend Running Successfully"
//     });
// });

// const PORT = process.env.PORT || 5001;

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000, 
    idleTimeoutMillis: 30000,      
    max: 10,                    
});


pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

const initDB = async () => {
    let client;
    try {
        client = await pool.connect(); 
        console.log("✅ Connected to Neon database successfully");

    } catch (err) {
        console.error("❌ Database connection error:", err);
    } finally {

        if (client) client.release();
    }
};

initDB();

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "NexHire ATS Backend Running Successfully"
    });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, pool };