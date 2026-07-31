// Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();
    const [tasks, setTasks] = useState({});
    const [taskInputs, setTaskInputs] = useState({});
    const [showTasksFor, setShowTasksFor] = useState({});
    const [form, setForm] = useState({
        title: "",
        description: ""
    });
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState({}); // Store user details

    // Fetch all projects
    const fetchProjects = async () => {
        try {
            const res = await API.get("/projects");
            console.log("Projects:", res.data);

            if (res.data && res.data.projects) {
                setProjects(res.data.projects);
                
                res.data.projects.forEach((project) => {
                    fetchTasks(project._id);
                    setShowTasksFor(prev => ({
                        ...prev,
                        [project._id]: false
                    }));
                });
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    // Fetch tasks with assignee details
    const fetchTasks = async (projectId) => {
        try {
            const res = await API.get(`/tasks/${projectId}`);
            console.log("Tasks with assignees:", res.data);

            // Store user details for assignees
            if (res.data.tasks) {
                res.data.tasks.forEach(task => {
                    if (task.assignee && task.assignee._id) {
                        setUsers(prev => ({
                            ...prev,
                            [task.assignee._id]: task.assignee
                        }));
                    }
                });
            }

            setTasks((prev) => ({
                ...prev,
                [projectId]: res.data.tasks || []
            }));
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setTasks((prev) => ({
                ...prev,
                [projectId]: []
            }));
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Create project
    const createProject = async (e) => {
        e.preventDefault();
        
        if (!form.title.trim()) {
            alert("Project title is required!");
            return;
        }

        setLoading(true);

        try {
            await API.post("/projects", form);
            setForm({ title: "", description: "" });
            await fetchProjects();
            alert("✅ Project created successfully!");
        } catch (error) {
            console.error("Error creating project:", error);
            alert("Failed to create project. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Delete project
    const deleteProject = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;

        try {
            await API.delete(`/projects/${id}`);
            setTasks(prev => {
                const newTasks = { ...prev };
                delete newTasks[id];
                return newTasks;
            });
            setShowTasksFor(prev => {
                const newShow = { ...prev };
                delete newShow[id];
                return newShow;
            });
            await fetchProjects();
        } catch (error) {
            console.error("Error deleting project:", error);
            alert("Failed to delete project.");
        }
    };

    // Add task
    const addTask = async (projectId, title) => {
        if (!title.trim()) {
            alert("Please enter a task title!");
            return;
        }

        try {
            await API.post("/tasks", { title, project: projectId });
            setTaskInputs({ ...taskInputs, [projectId]: "" });
            await fetchTasks(projectId);
        } catch (error) {
            console.error("Error adding task:", error);
            alert("Failed to add task.");
        }
    };

    // Delete task
    const deleteTask = async (taskId, projectId) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;

        try {
            await API.delete(`/tasks/${taskId}`);
            await fetchTasks(projectId);
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Failed to delete task.");
        }
    };

    const handleTaskInput = (id, value) => {
        setTaskInputs({ ...taskInputs, [id]: value });
    };

    const toggleTasksVisibility = (projectId) => {
        setShowTasksFor(prev => ({
            ...prev,
            [projectId]: !prev[projectId]
        }));
        if (!tasks[projectId] || tasks[projectId].length === 0) {
            fetchTasks(projectId);
        }
    };

    // Helper function to get user initials
    const getUserInitials = (name) => {
        if (!name) return "?";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    // Helper function to get user color
    const getUserColor = (name) => {
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500',
            'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">TaskFlow</h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/my-work")}
                            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
                        >
                            💼 My Work
                        </button>
                        <button
                            onClick={() => navigate("/projects")}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            Projects
                        </button>
                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                navigate("/");
                            }}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-8">
                <h2 className="text-3xl font-bold text-gray-800">Welcome Back 👋</h2>
                <p className="text-gray-500 mt-2">Manage all your projects from one place.</p>

                {/* Create Project Form */}
                <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
                    <h3 className="text-xl font-semibold mb-5">Create New Project</h3>
                    <form onSubmit={createProject} className="space-y-5">
                        <div>
                            <label className="block mb-2 font-medium text-gray-700">Project Title *</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Enter project title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                placeholder="Enter project description"
                                value={form.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Project"}
                        </button>
                    </form>
                </div>

                {/* Projects List */}
                <div className="mt-10">
                    <h3 className="text-2xl font-semibold mb-5">My Projects ({projects.length})</h3>

                    {projects.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                            <p className="text-gray-500">No projects yet. Create your first project above!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <div
                                    key={project._id}
                                    className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition cursor-pointer"
                                    onClick={() => navigate(`/projects/${project._id}`)}
                                >
                                    <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600">
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-500 mt-2 line-clamp-2">
                                        {project.description || "No description"}
                                    </p>
                                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                                        <span>📋 {tasks[project._id]?.length || 0} tasks</span>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteProject(project._id);
                                        }}
                                        className="mt-3 text-red-600 hover:underline text-sm"
                                    >
                                        Delete Project
                                    </button>

                                    <div className="mt-6 border-t pt-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Add a task..."
                                                value={taskInputs[project._id] || ""}
                                                onChange={(e) => handleTaskInput(project._id, e.target.value)}
                                                className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addTask(project._id, taskInputs[project._id]);
                                                }}
                                                className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 text-sm"
                                            >
                                                Add
                                            </button>
                                        </div>

                                        <div className="mt-3">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleTasksVisibility(project._id);
                                                }}
                                                className="text-blue-600 hover:underline text-sm"
                                            >
                                                {showTasksFor[project._id] ? "Hide Tasks" : "Show Tasks"}
                                            </button>
                                        </div>

                                        {/* Show tasks with assignee names */}
                                        {showTasksFor[project._id] && (
                                            <div className="mt-4 space-y-2">
                                                {tasks[project._id]?.length > 0 ? (
                                                    tasks[project._id].map((task) => {
                                                        const assignee = task.assignee || task.assigneeId;
                                                        const assigneeName = assignee?.name || "Unassigned";
                                                        const assigneeEmail = assignee?.email || "";
                                                        
                                                        return (
                                                            <div
                                                                key={task._id}
                                                                className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-sm font-medium text-gray-800">
                                                                                {task.title}
                                                                            </span>
                                                                        </div>
                                                                        
                                                                        {/* Assignee section */}
                                                                        <div className="mt-2 flex items-center gap-2">
                                                                            {assignee ? (
                                                                                <div className="flex items-center gap-2">
                                                                                    <div className={`w-6 h-6 rounded-full ${getUserColor(assigneeName)} text-white flex items-center justify-center text-xs font-medium`}>
                                                                                        {getUserInitials(assigneeName)}
                                                                                    </div>
                                                                                    <div className="flex flex-col">
                                                                                        <span className="text-xs font-medium text-gray-700">
                                                                                            {assigneeName}
                                                                                        </span>
                                                                                        {assigneeEmail && (
                                                                                            <span className="text-xs text-gray-400">
                                                                                                {assigneeEmail}
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="flex items-center gap-2">
                                                                                    <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs font-medium">
                                                                                        ?
                                                                                    </div>
                                                                                    <span className="text-xs text-gray-400">Unassigned</span>
                                                                                </div>
                                                                            )}
                                                                            
                                                                            {/* Task status indicator */}
                                                                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                                                                task.status === 'done' ? 'bg-green-100 text-green-700' :
                                                                                task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                                                                                'bg-gray-100 text-gray-600'
                                                                            }`}>
                                                                                {task.status || 'todo'}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            deleteTask(task._id, project._id);
                                                                        }}
                                                                        className="text-red-500 hover:text-red-700 text-sm ml-2"
                                                                    >
                                                                        ✕
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <p className="text-gray-500 text-sm mt-2">No tasks found.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;