// Import mongoose
const mongoose = require("mongoose");

// Task schema
const taskSchema = new mongoose.Schema({

    // Task title
    title: {
        type: String,
        required: true
    },

    // Task status
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending"
    },

    // Project to which task belongs
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    }

}, {

    timestamps: true

});

// Create model
module.exports = mongoose.model("Task", taskSchema);