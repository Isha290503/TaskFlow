// Import mongoose
const mongoose = require("mongoose");

// Create project schema
const projectSchema = new mongoose.Schema({

    // Project title
    title: {
        type: String,
        required: true
    },

    // Project description
    description: {
        type: String,
        default: ""
    },

    // User who owns this project
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {
    timestamps: true
});

// Create model
const Project = mongoose.model("Project", projectSchema);

// Export model
module.exports = Project;