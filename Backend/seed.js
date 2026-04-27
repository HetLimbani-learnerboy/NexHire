const pool = require("./config/db");
const bcrypt = require("bcryptjs");

const createDemoUsers = async () => {
  try {
    const demoUsers = [
      {
        full_name: "Sahil Dobaria",
        email: "admin@nexhire.com",
        role: "admin",
        phone: "+91 9876543210"
      },
      {
        full_name: "Het Limbani",
        email: "hr@nexhire.com",
        role: "hr",
        phone: "+91 9876543211"
      },
      {
        full_name: "Rohan Upadhyay",
        email: "vendor@nexhire.com",
        role: "vendor",
        phone: "+91 9876543212"
      },
      {
        full_name: "Priya Sharma",
        email: "manager@nexhire.com",
        role: "manager",
        phone: "+91 9876543213"
      }
    ];

    for (const user of demoUsers) {
      // Check if user already exists
      const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [user.email]
      );

      if (existingUser.rows.length === 0) {
        // Hash the default password
        const passwordHash = await bcrypt.hash("nexhire123", 10);

        // Insert user
        await pool.query(
          `INSERT INTO users (full_name, email, password_hash, role, phone, is_active)
           VALUES ($1, $2, $3, $4, $5, true)`,
          [user.full_name, user.email, passwordHash, user.role, user.phone]
        );

        console.log(`✅ Demo user created: ${user.email}`);
      } else {
        console.log(`ℹ️  Demo user already exists: ${user.email}`);
      }
    }
  } catch (err) {
    console.error("Error creating demo users:", err);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  createDemoUsers().then(() => {
    pool.end();
    console.log("✅ Demo user initialization complete");
  });
}

module.exports = { createDemoUsers };
