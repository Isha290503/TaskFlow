require("dotenv").config();
// Import database connection
const connectDB = require("./config/database");
// Import required packages
// Import authentication middleware
const authMiddleware = require("./middleware/authMiddleware");
const projectRoutes = require("./routes/projectRoutes");
// Import task routes
const taskRoutes = require("./routes/taskRoutes");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Create Express app
const app = express();



// Import routes
const authRoutes = require("./routes/authRoutes");

/* ===========================
   MIDDLEWARE
   =========================== */

// Allow requests from frontend
app.use(cors());

// Parse JSON request body
app.use(express.json());
// Project routes
app.use("/api/projects", projectRoutes);
// Task routes
app.use("/api/tasks", taskRoutes);
/* ===========================
   DATABASE
   =========================== */

// Connect to MongoDB
connectDB();

/* ===========================
   ROUTES
   */

// Test route
app.get("/", (req, res) => {
    res.send("Backend is Running");
});
// Protected route
app.get("/api/profile", authMiddleware, (req, res) => {

    res.json({

        success: true,

        message: "Welcome to your profile",

        user: req.user

    });

});
// Authentication routes
app.use("/api", authRoutes);

/* ===========================
   START SERVER
   =========================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});