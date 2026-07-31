// Import Project model
const Project = require("../models/Project");

// Create project
const createProject = async (req, res) => {

    try {

        // Get project details
        const { title, description } = req.body;

        // Validate title
        if (!title) {

            return res.status(400).json({
                success: false,
                message: "Project title is required"
            });

        }

        // Create project
        const project = await Project.create({

            title,
            description,

            // Logged-in user's id
            user: req.user.id

        });

        // Send response
        res.status(201).json({

            success: true,
            message: "Project Created",

            project

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

};
// Get all projects of logged-in user
const getProjects = async (req, res) => {

    try {

        // Find projects belonging to logged-in user
        const projects = await Project.find({

            user: req.user.id

        }).sort({

            createdAt: -1

        });

        // Send response
        res.status(200).json({

            success: true,

            projects

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};
// Update project
const updateProject = async (req, res) => {

    try {

        const project = await Project.findOneAndUpdate(

            {
                _id: req.params.id,
                user: req.user.id
            },

            req.body,

            {
                new: true
            }

        );

        if (!project) {

            return res.status(404).json({
                success: false,
                message: "Project not found"
            });

        }

        res.json({
            success: true,
            project
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

// Delete project
const deleteProject = async (req, res) => {

    try {

        const project = await Project.findOneAndDelete({

            _id: req.params.id,
            user: req.user.id

        });

        if (!project) {

            return res.status(404).json({

                success: false,
                message: "Project not found"

            });

        }

        res.json({

            success: true,
            message: "Project Deleted"

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

};

// Export controller
module.exports = {

    createProject,
    getProjects,
    updateProject,
    deleteProject

};