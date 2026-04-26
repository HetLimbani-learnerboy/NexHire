const express = require("express");

const router = express.Router();



const roleMiddleware = require("../middleware/roleMiddleware");



const {

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

} = require("../controllers/adminController");



/* Dashboard */

router.get("/dashboard", roleMiddleware("admin"), adminDashboard);



/* Vendors */

router.get("/vendors", roleMiddleware("admin"), getVendors);

router.post("/vendors", roleMiddleware("admin"), addVendor);

router.put("/vendors/:id", roleMiddleware("admin"), updateVendor);

router.delete("/vendors/:id", roleMiddleware("admin"), deleteVendor);



/* Jobs */

router.get("/jobs", roleMiddleware("admin"), getJobs);

router.post("/jobs", roleMiddleware("admin"), createJob);

router.put("/jobs/close/:id", roleMiddleware("admin"), closeJob);



/* Candidates */

router.get("/candidates", roleMiddleware("admin"), getCandidates);



/* Reports */

router.get("/reports", roleMiddleware("admin"), reports);



/* Users */

router.get("/users", roleMiddleware("admin"), getUsers);

router.post("/users", roleMiddleware("admin"), createUser);



module.exports = router;