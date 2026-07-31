// Import mongoose
const mongoose = require("mongoose");

// Create the schema (blueprint)
const userSchema = new mongoose.Schema({

    // User's name
    name: {
        type: String,
        required: true
    },

    // User's email
    email: {
        type: String,
        required: true,
        unique: true
    },

    // User's password
    password: {
        type: String,
        required: true
    }

},
{
    // Automatically adds createdAt and updatedAt
    timestamps: true
});

// Create the model
const User = mongoose.model("User", userSchema);

// Export the model
module.exports = User;