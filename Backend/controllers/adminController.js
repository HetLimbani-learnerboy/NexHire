const { pool } = require("../app");



/* Dashboard */

const adminDashboard = async (req, res) => {

  const vendors = await pool.query("SELECT COUNT(*) FROM vendors");

  const jobs = await pool.query("SELECT COUNT(*) FROM jobs");

  const candidates = await pool.query("SELECT COUNT(*) FROM candidates");



  res.json({

    success: true,

    totalVendors: vendors.rows[0].count,

    totalJobs: jobs.rows[0].count,

    totalCandidates: candidates.rows[0].count

  });

};



/* Vendors */

const getVendors = async (req, res) => {

  const data = await pool.query("SELECT * FROM vendors ORDER BY id DESC");

  res.json(data.rows);

};



const addVendor = async (req, res) => {

  const { company_name, contact_person, email } = req.body;



  await pool.query(

    `INSERT INTO vendors(company_name, contact_person, email)

     VALUES($1,$2,$3)`,

    [company_name, contact_person, email]

  );



  res.json({ success: true, message: "Vendor Added" });

};



const updateVendor = async (req, res) => {

  const { id } = req.params;

  const { company_name, contact_person } = req.body;



  await pool.query(

    `UPDATE vendors

     SET company_name=$1, contact_person=$2

     WHERE id=$3`,

    [company_name, contact_person, id]

  );



  res.json({ success: true });

};



const deleteVendor = async (req, res) => {

  const { id } = req.params;



  await pool.query(

    "DELETE FROM vendors WHERE id=$1",

    [id]

  );



  res.json({ success: true });

};



/* Jobs */

const getJobs = async (req, res) => {

  const data = await pool.query("SELECT * FROM jobs ORDER BY id DESC");

  res.json(data.rows);

};



const createJob = async (req, res) => {

  const { title, department, budget } = req.body;



  await pool.query(

    `INSERT INTO jobs(title, department, budget)

     VALUES($1,$2,$3)`,

    [title, department, budget]

  );



  res.json({ success: true });

};



const closeJob = async (req, res) => {

  const { id } = req.params;



  await pool.query(

    `UPDATE jobs SET status='closed' WHERE id=$1`,

    [id]

  );



  res.json({ success: true });

};



/* Candidates */

const getCandidates = async (req, res) => {

  const data = await pool.query(`

    SELECT c.*, v.company_name

    FROM candidates c

    LEFT JOIN vendors v ON c.vendor_id=v.id

    ORDER BY c.id DESC

  `);



  res.json(data.rows);

};



/* Reports */

const reports = async (req, res) => {

  const data = await pool.query(`

    SELECT company_name, rating

    FROM vendors

  `);



  res.json(data.rows);

};



/* Users */

const getUsers = async (req, res) => {

  const data = await pool.query("SELECT * FROM users");

  res.json(data.rows);

};



const createUser = async (req, res) => {

  const { full_name, email, role } = req.body;



  await pool.query(

    `INSERT INTO users(full_name,email,password_hash,role)

     VALUES($1,$2,'123456',$3)`,

    [full_name, email, role]

  );



  res.json({ success: true });

};



module.exports = {

  adminDashboard,

  getVendors,

  addVendor,

  updateVendor,

  deleteVendor,

  getJobs,

  createJob,

  closeJob,

  getCandidates,

  reports,

  getUsers,

  createUser

};