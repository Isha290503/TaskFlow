// Import Task model
const Task = require("../models/Task");

// Create task
const createTask = async (req, res) => {

    try {

        const { title, project } = req.body;

        const task = await Task.create({

            title,
            project

        });

        res.status(201).json({

            success: true,
            task

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

};

// Get all tasks of a project
const getTasks = async (req, res) => {

    try {

        const tasks = await Task.find({

            project: req.params.projectId

        });

        res.json({

            success: true,
            tasks

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

};

// Update task
const updateTask = async (req, res) => {

    try {

        const task = await Task.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new: true

            }

        );

        res.json({

            success: true,
            task

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

};

// Delete task
const deleteTask = async (req, res) => {

    try {

        await Task.findByIdAndDelete(req.params.id);

        res.json({

            success: true,
            message: "Task Deleted"

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

};

// Export controllers
module.exports = {

    createTask,
    getTasks,
    updateTask,
    deleteTask

};