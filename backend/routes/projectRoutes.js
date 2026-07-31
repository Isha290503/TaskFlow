// Import express
const express = require("express");

const router = express.Router();

// Import controller
const {
    createProject,
    getProjects,
    deleteProject
} = require("../controllers/projectController");

// Import authentication middleware
const authMiddleware = require("../middleware/authMiddleware");

// Get all projects
router.get("/", authMiddleware, getProjects);

// Create project
router.post("/", authMiddleware, createProject);

// Delete project
router.delete("/:id", authMiddleware, deleteProject);

// Export routes
module.exports = router;