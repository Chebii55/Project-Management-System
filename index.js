import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { getToken } from "./auth";

function CreateProject() {
  const [projectName, setProjectName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([
    { task_name: "", description: "", deadline: "", assigned_member_id: "", status: "pending" },
  ]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error('No token found');

        const sessionResponse = await fetch('/check_session', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!sessionResponse.ok) {
          throw new Error('Failed to fetch session data');
        }

        const sessionData = await sessionResponse.json();
        const userResponse = await fetch(`/users/${sessionData.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user details');
        }

        const userData = await userResponse.json();
        setUserData(userData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();

    fetch("/users")
      .then((response) => response.json())
      .then((data) => {
        const filteredMembers = data.filter((user) => user.role === "member");
        setMembers(filteredMembers);
      })
      .catch(() => {
        setError("Failed to load members.");
      });

    // Fetch or set initial data here if needed
    setProjectName("Initial Project Name"); // example of autofill data
    setDeadline("2024-09-30"); // example of autofill data
    setDescription("This is a sample project description."); // example of autofill data
    setPriority("high"); // example of autofill data

  }, []);

  const handleTaskChange = (index, field, value) => {
    setTasks(tasks.map((task, i) =>
      i === index ? { ...task, [field]: value } : task
    ));
  };

  const addTask = () => {
    setTasks([
      ...tasks,
      { task_name: "", description: "", deadline: "", assigned_member_id: "", status: "pending" }
    ]);
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const logFormData = () => {
    console.log("Project Info:", { projectName, deadline, description, priority });
    console.log("Tasks Info:", tasks);
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    logFormData(); // Log data before submitting

    const token = getToken();

    try {
      const response = await fetch("/projects", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner_id: userData.id,
          project_name: projectName,
          deadline,
          description,
          priority,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to create project");
        return;
      }

      setProjectId(result.id);
      setSuccessMessage("Project created successfully!");
      setShowTaskForm(true); // Show task form after project is created
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmitTasks = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    logFormData(); // Log data before submitting

    if (!projectId) {
      setError("Project must be created before adding tasks.");
      return;
    }

    const token = getToken();

    try {
      const response = await fetch("/tasks", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: projectId,
          tasks: tasks.map(task => ({
            assigned_member_id: task.assigned_member_id,
            deadline: task.deadline,
            description: task.description,
            status: task.status || "pending",
            task_name: task.task_name
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to create tasks");
        return;
      }

      setSuccessMessage("Tasks created successfully!");
      setTasks([{ task_name: "", description: "", deadline: "", assigned_member_id: "", status: "pending" }]);
      setShowTaskForm(false);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white dark:bg-gray-700 h-full overflow-auto">
          <div className="relative pt-8">
            <div className="absolute inset-0 h-1/2 dark:bg-gray-700"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">
                  Create a New Project
                </h2>

                <form onSubmit={handleSubmitProject}>
                  <div className="mb-6">
                    <label
                      htmlFor="projectName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Project Name
                    </label>
                    <input
                      type="text"
                      id="projectName"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="deadline"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Project Deadline
                    </label>
                    <input
                      type="date"
                      id="deadline"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Project Description
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="priority"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Priority
                    </label>
                    <select
                      id="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    Create Project
                  </button>
                </form>

                {showTaskForm && (
                  <div className="mt-8">
                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">
                      Add Tasks to the Project
                    </h3>

                    <form onSubmit={handleSubmitTasks}>
                      {tasks.map((task, index) => (
                        <div key={index} className="mb-6">
                          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">
                            Task {index + 1}
                          </h4>

                          <div className="mb-4">
                            <label
                              htmlFor={`task_name_${index}`}
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Task Name
                            </label>
                            <input
                              type="text"
                              id={`task_name_${index}`}
                              value={task.task_name}
                              onChange={(e) =>
                                handleTaskChange(index, "task_name", e.target.value)
                              }
                              required
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>

                          <div className="mb-4">
                            <label
                              htmlFor={`description_${index}`}
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Task Description
                            </label>
                            <textarea
                              id={`description_${index}`}
                              value={task.description}
                              onChange={(e) =>
                                handleTaskChange(index, "description", e.target.value)
                              }
                              required
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>

                          <div className="mb-4">
                            <label
                              htmlFor={`deadline_${index}`}
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Task Deadline
                            </label>
                            <input
                              type="date"
                              id={`deadline_${index}`}
                              value={task.deadline}
                              onChange={(e) =>
                                handleTaskChange(index, "deadline", e.target.value)
                              }
                              required
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>

                          <div className="mb-4">
                            <label
                              htmlFor={`assigned_member_id_${index}`}
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Assigned Member
                            </label>
                            <select
                              id={`assigned_member_id_${index}`}
                              value={task.assigned_member_id}
                              onChange={(e) =>
                                handleTaskChange(index, "assigned_member_id", e.target.value)
                              }
                              required
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="">Select a member</option>
                              {members.map((member) => (
                                <option key={member.id} value={member.id}>
                                  {member.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeTask(index)}
                            className="text-red-600 hover:text-red-900 focus:outline-none"
                          >
                            Remove Task
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addTask}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        Add Another Task
                      </button>

                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ml-4"
                      >
                        Submit Tasks
                      </button>
                    </form>
                  </div>
                )}

                {error && (
                  <div className="mt-4 text-red-600 dark:text-red-400">
                    <p>Error: {error}</p>
                  </div>
                )}

                {successMessage && (
                  <div className="mt-4 text-green-600 dark:text-green-400">
                    <p>{successMessage}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProject;
