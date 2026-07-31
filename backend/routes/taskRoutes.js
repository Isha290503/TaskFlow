// Import express
const express = require("express");

const router = express.Router();

// Import controller
const {

    createTask,
    getTasks,
    updateTask,
    deleteTask

} = require("../controllers/taskController");

// Import middleware
const authMiddleware = require("../middleware/authMiddleware");

// Routes
router.post("/", authMiddleware, createTask);

router.get("/:projectId", authMiddleware, getTasks);

router.put("/:id", authMiddleware, updateTask);

router.delete("/:id", authMiddleware, deleteTask);

// Export router
module.exports = router;