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
const cookieParser = require("cookie-parser");
const { Pool } = require("pg");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const managerRoutes = require("./routes/managerRoutes");
require("dotenv").config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/manager", managerRoutes);

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

        // Conditionally create tables if they do not exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                email VARCHAR(150) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        await client.query(`
            CREATE TABLE IF NOT EXISTS vendors (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                company_name VARCHAR(150),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS jobs (
                id SERIAL PRIMARY KEY,
                title VARCHAR(150) NOT NULL,
                department VARCHAR(100),
                location VARCHAR(100),
                status VARCHAR(50) DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS job_vendors (
                job_id INTEGER REFERENCES jobs(id),
                vendor_id INTEGER REFERENCES vendors(id),
                PRIMARY KEY (job_id, vendor_id)
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS candidates (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                phone VARCHAR(50),
                job_id INTEGER REFERENCES jobs(id),
                vendor_id INTEGER REFERENCES vendors(id),
                status VARCHAR(50) DEFAULT 'Pending Review',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("✅ Database tables verified/created");
    } catch (err) {
        console.error("❌ Database connection/setup error:", err);
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