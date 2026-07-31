// Import mongoose
const mongoose = require("mongoose");

// Function to connect with MongoDB
const connectDB = async () => {

    try {

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

    } catch (error) {

        console.log("Database Connection Failed");

        console.error(error);

        process.exit(1);

    }

};

// Export function
module.exports = connectDB;