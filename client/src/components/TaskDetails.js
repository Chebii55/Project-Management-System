import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { getToken } from './auth';

function TaskDetails() {
    const { taskId } = useParams(); // Get the taskId from the URL
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [status, setStatus] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchTaskDetails = async () => {
            try {
                const token = getToken();
                if (!token) throw new Error('No token found');

                const response = await fetch(`/tasks/${taskId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    setTask(data);
                    setStatus(data.status); // Initialize status with the current value
                } else {
                    throw new Error('Failed to fetch task details');
                }
            } catch (error) {
                setError(error.message);
            }
        };

        fetchTaskDetails();
    }, [taskId]);

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const handleUpdate = async () => {
        try {
            const token = getToken();
            if (!token) throw new Error('No token found');

            const response = await fetch(`/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                setSuccess('Task status updated successfully!');
                setTimeout(() => {
                    setSuccess(null);
                    navigate('/tasks'); // Redirect to the tasks view page after saving
                }, 2000); // Hide the success message after 2 seconds and navigate
            } else {
                throw new Error('Failed to update task');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    if (error) {
        return <p className="text-red-600 dark:text-red-400">{error}</p>;
    }

    if (!task) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-6 bg-white dark:bg-gray-800">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Task Details</h1>
                <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Task Name</label>
                            <p className="mt-1 text-gray-900 dark:text-white">{task.task_name}</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                            <p className="mt-1 text-gray-900 dark:text-white">{new Date(task.deadline).toLocaleDateString()}</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                            <p className="mt-1 text-gray-900 dark:text-white">{task.description}</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                            <select
                                value={status}
                                onChange={handleStatusChange}
                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleUpdate}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            Update Status
                        </button>
                    </div>
                    {success && (
                        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
                            {success}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TaskDetails;
