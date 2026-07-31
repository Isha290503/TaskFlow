// Projects.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState({});
    const [teamMembers, setTeamMembers] = useState({});
    const [expandedProject, setExpandedProject] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const res = await API.get("/projects");
            setProjects(res.data.projects || []);
            
            // Fetch tasks and members for each project
            if (res.data.projects) {
                res.data.projects.forEach(project => {
                    fetchTasks(project._id);
                    fetchTeamMembers(project._id);
                });
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTasks = async (projectId) => {
        try {
            const res = await API.get(`/tasks/${projectId}`);
            setTasks(prev => ({
                ...prev,
                [projectId]: res.data.tasks || []
            }));
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setTasks(prev => ({
                ...prev,
                [projectId]: []
            }));
        }
    };

    const fetchTeamMembers = async (projectId) => {
        try {
            // Fetch team members for the project
            // If you have an endpoint for project members
            const res = await API.get(`/projects/${projectId}/members`);
            setTeamMembers(prev => ({
                ...prev,
                [projectId]: res.data.members || []
            }));
        } catch (error) {
            // Fallback: Use mock data if endpoint doesn't exist
            const mockMembers = [
                { 
                    _id: "1", 
                    name: "John Doe", 
                    email: "john@example.com",
                    role: "Project Lead",
                    avatar: "https://i.pravatar.cc/150?img=1"
                },
                { 
                    _id: "2", 
                    name: "Jane Smith", 
                    email: "jane@example.com",
                    role: "Senior Developer",
                    avatar: "https://i.pravatar.cc/150?img=2"
                },
                { 
                    _id: "3", 
                    name: "Bob Johnson", 
                    email: "bob@example.com",
                    role: "Designer",
                    avatar: "https://i.pravatar.cc/150?img=3"
                },
                { 
                    _id: "4", 
                    name: "Alice Williams", 
                    email: "alice@example.com",
                    role: "Developer",
                    avatar: "https://i.pravatar.cc/150?img=4"
                }
            ];
            setTeamMembers(prev => ({
                ...prev,
                [projectId]: mockMembers
            }));
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

    const toggleProjectExpansion = (projectId) => {
        setExpandedProject(expandedProject === projectId ? null : projectId);
    };

    // Get task statistics for a project
    const getTaskStats = (projectId) => {
        const projectTasks = tasks[projectId] || [];
        const total = projectTasks.length;
        const done = projectTasks.filter(t => t.status === "done").length;
        const inProgress = projectTasks.filter(t => t.status === "in-progress").length;
        const todo = projectTasks.filter(t => t.status === "todo").length;
        const progress = total > 0 ? Math.round((done / total) * 100) : 0;
        
        return { total, done, inProgress, todo, progress };
    };

    // Get tasks assigned to a specific member
    const getTasksForMember = (projectId, memberId) => {
        const projectTasks = tasks[projectId] || [];
        return projectTasks.filter(task => task.assignee === memberId);
    };

    // Get task progress for a member
    const getMemberProgress = (projectId, memberId) => {
        const memberTasks = getTasksForMember(projectId, memberId);
        const total = memberTasks.length;
        const done = memberTasks.filter(t => t.status === "done").length;
        return total > 0 ? Math.round((done / total) * 100) : 0;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Loading projects...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
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
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">
                            All Projects
                        </h2>
                        <p className="text-gray-500 mt-1">
                            {projects.length} projects • {Object.values(tasks).flat().length} total tasks
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <span>+</span> Create New Project
                    </button>
                </div>

                {projects.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <p className="text-gray-500">No projects found. Create your first project!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {projects.map((project) => {
                            const stats = getTaskStats(project._id);
                            const members = teamMembers[project._id] || [];
                            const isExpanded = expandedProject === project._id;

                            return (
                                <div
                                    key={project._id}
                                    className="bg-white rounded-xl shadow-sm border hover:shadow-md transition"
                                >
                                    {/* Project Header */}
                                    <div className="p-6 cursor-pointer" onClick={() => toggleProjectExpansion(project._id)}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-xl font-semibold text-gray-800">
                                                        {project.title}
                                                    </h3>
                                                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                                                        {stats.total} tasks
                                                    </span>
                                                </div>
                                                <p className="text-gray-500 mt-1">
                                                    {project.description || "No description"}
                                                </p>
                                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                                    <span>📅 Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                                                    <span>👥 {members.length} members</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {/* Progress Circle */}
                                                <div className="flex items-center gap-2">
                                                    <div className="w-12 h-12 relative">
                                                        <svg className="w-12 h-12 transform -rotate-90">
                                                            <circle
                                                                cx="24"
                                                                cy="24"
                                                                r="20"
                                                                stroke="#E5E7EB"
                                                                strokeWidth="4"
                                                                fill="none"
                                                            />
                                                            <circle
                                                                cx="24"
                                                                cy="24"
                                                                r="20"
                                                                stroke="#3B82F6"
                                                                strokeWidth="4"
                                                                fill="none"
                                                                strokeDasharray={`${stats.progress * 1.256} 125.6`}
                                                                className="transition-all duration-500"
                                                            />
                                                        </svg>
                                                        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-700">
                                                            {stats.progress}%
                                                        </span>
                                                    </div>
                                                    <div className="hidden sm:flex gap-2 text-xs">
                                                        <span className="text-gray-500">✅ {stats.done}</span>
                                                        <span className="text-yellow-500">🔄 {stats.inProgress}</span>
                                                        <span className="text-gray-400">📋 {stats.todo}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteProject(project._id);
                                                    }}
                                                    className="text-red-600 hover:underline text-sm"
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/projects/${project._id}`);
                                                    }}
                                                    className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 text-sm"
                                                >
                                                    View Board
                                                </button>
                                            </div>
                                        </div>

                                        {/* Quick Member Avatars */}
                                        {members.length > 0 && (
                                            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                                                <span className="text-sm text-gray-500">Team:</span>
                                                <div className="flex -space-x-2">
                                                    {members.slice(0, 5).map((member) => (
                                                        <img
                                                            key={member._id}
                                                            src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=3B82F6&color=fff&size=32`}
                                                            alt={member.name}
                                                            className="w-8 h-8 rounded-full border-2 border-white"
                                                            title={`${member.name} (${member.role})`}
                                                        />
                                                    ))}
                                                    {members.length > 5 && (
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                                                            +{members.length - 5}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Expanded Member Cards */}
                                    {isExpanded && (
                                        <div className="px-6 pb-6 border-t pt-4">
                                            <h4 className="font-semibold text-gray-700 mb-4">Team Members & Tasks</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                {members.map((member) => {
                                                    const memberTasks = getTasksForMember(project._id, member._id);
                                                    const memberProgress = getMemberProgress(project._id, member._id);
                                                    const taskCount = memberTasks.length;
                                                    const doneCount = memberTasks.filter(t => t.status === "done").length;

                                                    return (
                                                        <div
                                                            key={member._id}
                                                            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition border border-gray-200"
                                                        >
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <img
                                                                    src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=3B82F6&color=fff&size=40`}
                                                                    alt={member.name}
                                                                    className="w-10 h-10 rounded-full"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium text-gray-800 truncate">
                                                                        {member.name}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 truncate">
                                                                        {member.role || "Team Member"}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Member Progress */}
                                                            <div className="mb-3">
                                                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                                    <span>Progress</span>
                                                                    <span>{memberProgress}%</span>
                                                                </div>
                                                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                                    <div
                                                                        className="bg-blue-600 rounded-full h-1.5 transition-all duration-500"
                                                                        style={{ width: `${memberProgress}%` }}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Task Stats */}
                                                            <div className="flex justify-between text-xs text-gray-600">
                                                                <div className="text-center">
                                                                    <span className="block font-semibold text-gray-800">
                                                                        {taskCount}
                                                                    </span>
                                                                    <span>Total</span>
                                                                </div>
                                                                <div className="text-center">
                                                                    <span className="block font-semibold text-green-600">
                                                                        {doneCount}
                                                                    </span>
                                                                    <span>Done</span>
                                                                </div>
                                                                <div className="text-center">
                                                                    <span className="block font-semibold text-yellow-600">
                                                                        {memberTasks.filter(t => t.status === "in-progress").length}
                                                                    </span>
                                                                    <span>In Progress</span>
                                                                </div>
                                                                <div className="text-center">
                                                                    <span className="block font-semibold text-gray-400">
                                                                        {memberTasks.filter(t => t.status === "todo").length}
                                                                    </span>
                                                                    <span>Todo</span>
                                                                </div>
                                                            </div>

                                                            {/* Task List (limited) */}
                                                            {memberTasks.length > 0 && (
                                                                <div className="mt-3 pt-3 border-t">
                                                                    <div className="space-y-1 max-h-24 overflow-y-auto">
                                                                        {memberTasks.slice(0, 3).map((task) => (
                                                                            <div
                                                                                key={task._id}
                                                                                className={`text-xs p-1 rounded flex items-center gap-1 ${
                                                                                    task.status === "done" 
                                                                                        ? "text-green-600 line-through" 
                                                                                        : task.status === "in-progress"
                                                                                        ? "text-yellow-600"
                                                                                        : "text-gray-600"
                                                                                }`}
                                                                            >
                                                                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-current" />
                                                                                <span className="truncate">{task.title}</span>
                                                                            </div>
                                                                        ))}
                                                                        {memberTasks.length > 3 && (
                                                                            <p className="text-xs text-gray-400 text-center">
                                                                                +{memberTasks.length - 3} more tasks
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Deadline indicator (mock) */}
                                                            <div className="mt-2 text-xs text-gray-400">
                                                                {memberTasks.length > 0 ? (
                                                                    <span>⏱️ {Math.floor(Math.random() * 10) + 1} days remaining</span>
                                                                ) : (
                                                                    <span>No tasks assigned</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Overall Project Timeline (mock) */}
                                            <div className="mt-6 pt-4 border-t">
                                                <div className="flex justify-between items-center text-sm text-gray-600">
                                                    <span>📊 Project Timeline</span>
                                                    <span>Due: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-green-500 rounded-full h-2 transition-all duration-500"
                                                        style={{ width: `${Math.min(stats.progress, 100)}%` }}
                                                    />
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                                    <span>Start: {new Date(project.createdAt).toLocaleDateString()}</span>
                                                    <span>{stats.progress}% Complete</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Projects;