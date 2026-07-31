// pages/MyWork.jsx - Simple version
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function MyWork() {
    const [myTasks, setMyTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyTasks();
    }, []);

    const fetchMyTasks = async () => {
        try {
            const res = await API.get("/tasks/my-tasks");
            setMyTasks(res.data.tasks || []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            await API.put(`/tasks/${taskId}/status`, { status: newStatus });
            fetchMyTasks();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'todo': 'bg-gray-200 text-gray-700',
            'in-progress': 'bg-yellow-200 text-yellow-700',
            'done': 'bg-green-200 text-green-700'
        };
        return badges[status] || badges.todo;
    };

    const stats = {
        total: myTasks.length,
        todo: myTasks.filter(t => t.status === 'todo').length,
        inProgress: myTasks.filter(t => t.status === 'in-progress').length,
        done: myTasks.filter(t => t.status === 'done').length
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">💼 My Work</h1>
                    <div className="flex gap-4">
                        <button onClick={() => navigate("/dashboard")} className="text-gray-600 hover:text-gray-900">
                            Dashboard
                        </button>
                        <button onClick={() => navigate("/projects")} className="text-gray-600 hover:text-gray-900">
                            Projects
                        </button>
                        <button onClick={() => { localStorage.removeItem("token"); navigate("/"); }} 
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
            // In MyWork.jsx - Add this to your task rendering

            {/* Assignee info in MyWork */}
            <div className="mt-2 flex items-center gap-2">
                {task.assignee ? (
                    <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full ${getUserColor(task.assignee.name)} text-white flex items-center justify-center text-xs font-medium`}>
                            {getUserInitials(task.assignee.name)}
                        </div>
                        <span className="text-xs text-gray-600">{task.assignee.name}</span>
                    </div>
                ) : (
                    <span className="text-xs text-gray-400">Unassigned</span>
                )}
            </div>
            <div className="max-w-7xl mx-auto p-8">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                        <p className="text-sm text-gray-500">Total</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <p className="text-2xl font-bold text-gray-500">{stats.todo}</p>
                        <p className="text-sm text-gray-500">To Do</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
                        <p className="text-sm text-gray-500">In Progress</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <p className="text-2xl font-bold text-green-600">{stats.done}</p>
                        <p className="text-sm text-gray-500">Done</p>
                    </div>
                </div>

                {/* Tasks */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">My Tasks</h2>
                    
                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : myTasks.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No tasks assigned to you</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {myTasks.map(task => (
                                <div key={task._id} className="border rounded-lg p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{task.title}</p>
                                        {task.project && (
                                            <p className="text-sm text-gray-500">📁 {task.project.title}</p>
                                        )}
                                    </div>
                                    <select
                                        value={task.status}
                                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                                        className={`px-3 py-1 rounded-lg text-sm border ${getStatusBadge(task.status)}`}
                                    >
                                        <option value="todo">📋 To Do</option>
                                        <option value="in-progress">🔄 In Progress</option>
                                        <option value="done">✅ Done</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyWork;