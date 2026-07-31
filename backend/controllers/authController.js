// Import User model
// Import JWT
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Import bcrypt for password hashing
const bcrypt = require("bcryptjs");

/* ===========================================
   REGISTER CONTROLLER
   =========================================== */

const register = async (req, res) => {

    try {

        // Get data from frontend
        const { name, email, password } = req.body;

        // Check if any field is missing
        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });

        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });

        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        // Save user to MongoDB
        await user.save();

        // Send success response
        res.status(201).json({
            success: true,
            message: "Registration Successful"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

/* ===========================================
   LOGIN CONTROLLER
   =========================================== */

// Login Controller
const login = async (req, res) => {

    try {

        // Get email and password from request body
        const { email, password } = req.body;

        // Check if all fields are provided
        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });

        }

        // Find user by email
        const user = await User.findOne({ email });

        // If user does not exist
        if (!user) {

            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password"
            });

        }

        // Compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        // If password is incorrect
        if (!isMatch) {

            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password"
            });

        }

        // Generate JWT token
        const token = jwt.sign(

            {
                id: user._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );

        // Send response
        res.status(200).json({

            success: true,

            message: "Login Successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

};

/* ===========================================
   EXPORT CONTROLLERS
   =========================================== */

module.exports = {
    register,
    login
};