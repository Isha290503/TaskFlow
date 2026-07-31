// Projects.jsx - Complete updated version
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [myTasks, setMyTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("projects"); // "projects" or "mywork"
    const [taskStats, setTaskStats] = useState({
        total: 0,
        todo: 0,
        inProgress: 0,
        done: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
        fetchMyTasks();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await API.get("/projects");
            setProjects(res.data.projects || []);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyTasks = async () => {
        try {
            const res = await API.get("/tasks/my-tasks");
            setMyTasks(res.data.tasks || []);
            
            // Calculate stats
            const tasks = res.data.tasks || [];
            const stats = {
                total: tasks.length,
                todo: tasks.filter(t => t.status === "todo").length,
                inProgress: tasks.filter(t => t.status === "in-progress").length,
                done: tasks.filter(t => t.status === "done").length
            };
            setTaskStats(stats);
        } catch (error) {
            console.error("Error fetching my tasks:", error);
        }
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            await API.put(`/tasks/${taskId}/status`, { status: newStatus });
            // Refresh tasks
            fetchMyTasks();
        } catch (error) {
            console.error("Error updating task:", error);
            alert("Failed to update task status");
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'todo': return 'bg-gray-100 text-gray-600';
            case 'in-progress': return 'bg-yellow-100 text-yellow-700';
            case 'done': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'todo': return '📋';
            case 'in-progress': return '🔄';
            case 'done': return '✅';
            default: return '📋';
        }
    };

    const deleteProject = async (id) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            try {
                await API.delete(`/projects/${id}`);
                fetchProjects();
            } catch (error) {
                console.error("Error deleting project:", error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">
                        Project Dashboard
                    </h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            Dashboard
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
                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b">
                    <button
                        onClick={() => setActiveTab("projects")}
                        className={`pb-3 px-4 font-medium transition ${
                            activeTab === "projects"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        📁 All Projects ({projects.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("mywork")}
                        className={`pb-3 px-4 font-medium transition ${
                            activeTab === "mywork"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        💼 My Work ({myTasks.length})
                    </button>
                </div>

                {/* My Work Section */}
                {activeTab === "mywork" && (
                    <div>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                                <p className="text-2xl font-bold text-blue-600">{taskStats.total}</p>
                                <p className="text-sm text-gray-500">Total Tasks</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                                <p className="text-2xl font-bold text-gray-400">{taskStats.todo}</p>
                                <p className="text-sm text-gray-500">To Do</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                                <p className="text-2xl font-bold text-yellow-600">{taskStats.inProgress}</p>
                                <p className="text-sm text-gray-500">In Progress</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                                <p className="text-2xl font-bold text-green-600">{taskStats.done}</p>
                                <p className="text-sm text-gray-500">Done</p>
                            </div>
                        </div>

                        {/* My Tasks List */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4">My Assigned Tasks</h3>
                            
                            {myTasks.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">No tasks assigned to you yet</p>
                                    <p className="text-gray-400 text-sm mt-2">
                                        Ask your project manager to assign you some tasks!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {myTasks.map((task) => (
                                        <div
                                            key={task._id}
                                            className="border rounded-lg p-4 hover:shadow-md transition"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-lg">{getStatusIcon(task.status)}</span>
                                                        <h4 className="font-medium text-gray-800">{task.title}</h4>
                                                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                                                            {task.status}
                                                        </span>
                                                    </div>
                                                    {task.description && (
                                                        <p className="text-sm text-gray-500 mt-1 ml-8">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                    {task.project && (
                                                        <p className="text-xs text-gray-400 mt-1 ml-8">
                                                            📁 {task.project.title}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        value={task.status}
                                                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                                                        className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="todo">📋 To Do</option>
                                                        <option value="in-progress">🔄 In Progress</option>
                                                        <option value="done">✅ Done</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Projects Section */}
                {activeTab === "projects" && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    All Projects
                                </h2>
                            </div>
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                            >
                                + Create New Project
                            </button>
                        </div>

                        {projects.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                <p className="text-gray-500">No projects found. Create your first project!</p>
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
                                        <div className="mt-4 flex justify-between items-center">
                                            <span className="text-sm text-gray-500">
                                                📅 {new Date(project.createdAt).toLocaleDateString()}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteProject(project._id);
                                                }}
                                                className="text-red-600 hover:underline text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                        <div className="mt-3 text-xs text-gray-400">
                                            👥 {project.members?.length || 0} members
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Projects;