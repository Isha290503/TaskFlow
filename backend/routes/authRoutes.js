// Import Express
const express = require("express");

// Create a router object
const router = express.Router();

// Import controller functions
const { register, login } = require("../controllers/authController");

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

// Export router
module.exports = router;