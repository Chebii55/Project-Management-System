import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { getToken } from "./auth";

function ViewTasks() {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("none");
    const [statusFilter, setStatusFilter] = useState("all");
    const navigate = useNavigate();
    const token = getToken();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!token) throw new Error('No token found');

                const response = await fetch('/check_session', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const sessionData = await response.json();
                if (response.ok) {
                    const userResponse = await fetch(`/users/${sessionData.id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    const userData = await userResponse.json();
                    if (userResponse.ok) {
                        setUserData(userData);
                    } else {
                        throw new Error('Failed to fetch user details');
                    }
                } else {
                    throw new Error('Failed to fetch session data');
                }
            } catch (error) {
                setError(error.message);
            }
        };

        const fetchTasks = async () => {
            try {
                const response = await fetch('/tasks'); // Update this URL to match your API endpoint
                if (response.ok) {
                    const data = await response.json();
                    if (userData) {
                        // Filter tasks assigned to the user
                        const assignedTasks = data.filter(task => task.assigned_member_id === userData.id);
                        setTasks(assignedTasks);
                        setFilteredTasks(assignedTasks); // Initialize filteredTasks
                    } else {
                        setTasks(data); // Set all tasks if userData is not yet available
                        setFilteredTasks(data); // Initialize filteredTasks
                    }
                } else {
                    console.error('Failed to fetch tasks');
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchUserData().then(fetchTasks);
    }, [token, userData]);

    useEffect(() => {
        let updatedTasks = tasks.filter(task => 
            task.task_name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (statusFilter !== "all") {
            updatedTasks = updatedTasks.filter(task => task.status === statusFilter);
        }

        if (sortOption === "deadline") {
            updatedTasks = updatedTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        } else if (sortOption === "urgency") {
            const urgencyOrder = { "pending": 1, "inprogress": 2, "completed": 3 };
            updatedTasks = updatedTasks.sort((a, b) => urgencyOrder[a.status] - urgencyOrder[b.status]);
        }

        setFilteredTasks(updatedTasks);
    }, [searchTerm, sortOption, statusFilter, tasks]);

    const handleViewTask = (taskId) => {
        navigate(`/tasks/${taskId}`); // Navigate to a details page for the task
    };

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-6 bg-white dark:bg-gray-800">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Tasks</h1>
                {error && <p className="text-red-500">{error}</p>}
                <div className="mb-4 flex flex-wrap gap-2">
                    <button 
                        onClick={() => setSortOption("deadline")}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                        Order by Deadline
                    </button>
                    <button 
                        onClick={() => setSortOption("urgency")}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                        Order by Urgency
                    </button>              
                    <button 
                        onClick={() => setStatusFilter("all")}
                        className={`px-4 py-2 rounded-lg ${statusFilter === "all" ? "bg-blue-500 text-white" : "border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                    >
                        All Tasks
                    </button>
                    <button 
                        onClick={() => setStatusFilter("pending")}
                        className={`px-4 py-2 rounded-lg ${statusFilter === "pending" ? "bg-blue-500 text-white" : "border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                    >
                        Pending
                    </button>
                    <button 
                        onClick={() => setStatusFilter("in-progress")}
                        className={`px-4 py-2 rounded-lg ${statusFilter === "in-progress" ? "bg-blue-500 text-white" : "border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                    >
                        In Progress
                    </button>
                    <button 
                        onClick={() => setStatusFilter("completed")}
                        className={`px-4 py-2 rounded-lg ${statusFilter === "completed" ? "bg-blue-500 text-white" : "border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                    >
                        Completed
                    </button>
                    <button 
                        onClick={() => setSortOption("none")}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                        Clear Sorting
                    </button>
                </div>
                <div className="mb-4">
                    <input 
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Task Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {filteredTasks.map(task => (
                                <tr key={task.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{task.task_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(task.deadline).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{task.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        <button 
                                            onClick={() => handleViewTask(task.id)}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            View Task
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ViewTasks;
