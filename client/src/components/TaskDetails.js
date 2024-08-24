import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { getToken } from './auth';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';

function TaskDetails() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [project, setProject] = useState(null);
    const [projectOwner, setProjectOwner] = useState(null);
    const [allTasks, setAllTasks] = useState([]);
    const [status, setStatus] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [showProjectDetails, setShowProjectDetails] = useState(true);
    const [showTaskDetails, setShowTaskDetails] = useState(true);
    const [showRelatedTasks, setShowRelatedTasks] = useState(true);

    useEffect(() => {
        const fetchTaskDetails = async () => {
            try {
                const token = getToken();
                if (!token) throw new Error('No token found');

                // Fetch task details
                const taskResponse = await fetch(`/tasks/${taskId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const taskData = await taskResponse.json();
                if (taskResponse.ok) {
                    setTask(taskData);
                    setStatus(taskData.status);

                    // Fetch project details
                    const projectResponse = await fetch(`/projects/${taskData.project_id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    const projectData = await projectResponse.json();
                    if (projectResponse.ok) {
                        setProject(projectData);

                        // Fetch project owner details
                        const ownerResponse = await fetch(`/users/${projectData.owner_id}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });

                        const ownerData = await ownerResponse.json();
                        if (ownerResponse.ok) {
                            setProjectOwner(ownerData);
                        } else {
                            throw new Error('Failed to fetch project owner details');
                        }

                        // Fetch all tasks related to the project
                        const tasksResponse = await fetch(`/projects/${taskData.project_id}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });

                        const tasksData = await tasksResponse.json();
                        if (tasksResponse.ok) {
                            setAllTasks(tasksData.tasks);
                        } else {
                            throw new Error('Failed to fetch related tasks');
                        }
                    } else {
                        throw new Error('Failed to fetch project details');
                    }
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
                    navigate('/tasks');
                }, 2000);
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

    if (!task || !project || !projectOwner || !allTasks.length) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 p-6 overflow-y-auto">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Task Details</h1>

                {/* Project Details */}
                <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-6 mb-4">
                    <button 
                        className="text-xl font-medium text-gray-900 dark:text-white mb-4 flex items-center space-x-2"
                        onClick={() => setShowProjectDetails(!showProjectDetails)}
                    >
                        {showProjectDetails ? <AiOutlineUp /> : <AiOutlineDown />}
                        <span>{showProjectDetails ? 'Hide Project Details' : 'Show Project Details'}</span>
                    </button>
                    {showProjectDetails && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Project Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
                                    <p className="mt-1 text-gray-900 dark:text-white">{project.project_name}</p>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Details</label>
                                    <p className="mt-1 text-gray-900 dark:text-white">{project.details}</p>
                                </div>
                                <div className="p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Owner</label>
                                    <p className="mt-1 text-gray-900 dark:text-white">{projectOwner.full_name}</p>
                                    <p className="mt-1 text-gray-900 dark:text-white">Email: {projectOwner.email}</p>
                                    <p className="mt-1 text-gray-900 dark:text-white">Username: @{projectOwner.username}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Task Details */}
                <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-6 mb-4">
                    <button 
                        className="text-xl font-medium text-gray-900 dark:text-white mb-4 flex items-center space-x-2"
                        onClick={() => setShowTaskDetails(!showTaskDetails)}
                    >
                        {showTaskDetails ? <AiOutlineUp /> : <AiOutlineDown />}
                        <span>{showTaskDetails ? 'Hide Task Details' : 'Show Task Details'}</span>
                    </button>
                    {showTaskDetails && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Task Details</h2>
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
                                        className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 dark:focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                onClick={handleUpdate}
                                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg shadow-md"
                            >
                                Update Status
                            </button>
                            {success && <p className="text-green-600 dark:text-green-400 mt-4">{success}</p>}
                        </div>
                    )}
                </div>

                {/* Related Tasks */}
                <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-6 mb-4">
                    <button 
                        className="text-xl font-medium text-gray-900 dark:text-white mb-4 flex items-center space-x-2"
                        onClick={() => setShowRelatedTasks(!showRelatedTasks)}
                    >
                        {showRelatedTasks ? <AiOutlineUp /> : <AiOutlineDown />}
                        <span>{showRelatedTasks ? 'Hide Related Tasks' : 'Show Related Tasks'}</span>
                    </button>
                    {showRelatedTasks && (
                        <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Related Tasks</h2>
                        <ul className="list-disc pl-5 space-y-4">
                            {allTasks.map(task => (
                                <li key={task.id} className="text-gray-900 dark:text-white">
                                    <p className="font-medium">{task.task_name}</p>
                                    <p className="text-sm">Status: {task.status}</p>
                                    <p className="text-sm">Due Date: {new Date(task.deadline).toLocaleDateString()}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TaskDetails;
