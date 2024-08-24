import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { getToken } from "./auth";

function CreateProject() {
  const [projectName, setProjectName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [details, setDetails] = useState("");
  const [priority, setPriority] = useState("medium");
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([
    { task_name: "", details: "", deadline: "", assigned_member_id: "", status: "pending" },
  ]);
  const [error, setError] = useState(null);
  const [projectSuccessMessage, setProjectSuccessMessage] = useState(null);
  const [taskSuccessMessage, setTaskSuccessMessage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [loading, setLoading] = useState(false);

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
  }, []);

  const handleTaskChange = (index, field, value) => {
    setTasks(tasks.map((task, i) =>
      i === index ? { ...task, [field]: value } : task
    ));
  };

  const addTask = () => {
    setTasks([
      ...tasks,
      { task_name: "", details: "", deadline: "", assigned_member_id: "", status: "pending" }
    ]);
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    setError(null);
    setProjectSuccessMessage(null);
    setLoading(true);

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
          details: details || "", // Handle empty details
          priority,
        }),
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        setError(result.error || "Failed to create project");
        return;
      }

      setProjectId(result.id);
      setProjectSuccessMessage("Project created successfully!");
      setShowTaskForm(true); // Show task form after project is created
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  const handleSubmitTasks = async (e) => {
    e.preventDefault();
    setError(null);
    setTaskSuccessMessage(null);

    if (!projectId) {
      setError("Project must be created before adding tasks.");
      return;
    }

    const token = getToken();

    try {
      for (const task of tasks) {
        const response = await fetch("/tasks", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project_id: projectId,
            assigned_member_id: task.assigned_member_id,
            deadline: task.deadline,
            description: task.details,
            status: task.status || "pending",
            task_name: task.task_name
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to create task");
        }
      }

      setTaskSuccessMessage("Tasks created successfully!");
      setTasks([{ task_name: "", details: "", deadline: "", assigned_member_id: "", status: "pending" }]);
      setShowTaskForm(true); // Keep the task form visible after tasks are created
    } catch (error) {
      setError(error.message);
    }
  };

  if (userData && userData.role === "member") {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-700">
        <Sidebar />
        <div className="flex-1 flex flex-col justify-center items-center p-6">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">
              Access Denied
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Members do not have permission to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white dark:bg-gray-800 h-full overflow-auto">
          <div className="relative pt-8">
            <div className="absolute inset-0 h-1/2 bg-gray-100 dark:bg-gray-800"></div>
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
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="details"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Project Details
                    </label>
                    <textarea
                      id="details"
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      rows="4"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {loading ? "Creating Project..." : "Create Project"}
                  </button>

                  {projectSuccessMessage && (
                    <p className="mt-4 text-green-600 dark:text-green-400">
                      {projectSuccessMessage}
                    </p>
                  )}
                  {error && (
                    <p className="mt-4 text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  )}
                </form>

                {showTaskForm && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Add Tasks
                    </h3>
                    <form onSubmit={handleSubmitTasks}>
                      {tasks.map((task, index) => (
                        <div key={index} className="mb-6">
                          <div className="flex items-center">
                            <div className="flex-1">
                              <label
                                htmlFor={`taskName-${index}`}
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                              >
                                Task Name
                              </label>
                              <input
                                type="text"
                                id={`taskName-${index}`}
                                value={task.task_name}
                                onChange={(e) =>
                                  handleTaskChange(index, "task_name", e.target.value)
                                }
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => removeTask(index)}
                              className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="mt-4">
                            <label
                              htmlFor={`taskDetails-${index}`}
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Task Details
                            </label>
                            <textarea
                              id={`taskDetails-${index}`}
                              value={task.details}
                              onChange={(e) =>
                                handleTaskChange(index, "details", e.target.value)
                              }
                              rows="4"
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>

                          <div className="mt-4">
                            <label
                              htmlFor={`taskDeadline-${index}`}
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Task Deadline
                            </label>
                            <input
                              type="date"
                              id={`taskDeadline-${index}`}
                              value={task.deadline}
                              onChange={(e) =>
                                handleTaskChange(index, "deadline", e.target.value)
                              }
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>

                          <div className="mt-4">
                            <label
                              htmlFor={`assignedMember-${index}`}
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Assigned Member
                            </label>
                            <select
                              id={`assignedMember-${index}`}
                              value={task.assigned_member_id}
                              onChange={(e) =>
                                handleTaskChange(index, "assigned_member_id", e.target.value)
                              }
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="">Select a member</option>
                              {members.map((member) => (
                                <option key={member.id} value={member.id}>
                                  {member.full_name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="mt-4">
                            <label
                              htmlFor={`taskStatus-${index}`}
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Status
                            </label>
                            <select
                              id={`taskStatus-${index}`}
                              value={task.status}
                              onChange={(e) =>
                                handleTaskChange(index, "status", e.target.value)
                              }
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addTask}
                        className="inline-flex justify-center py-2 px-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Add Task
                      </button>

                      <button
                        type="submit"
                        className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {loading ? "Creating Tasks..." : "Create Tasks"}
                      </button>

                      {taskSuccessMessage && (
                        <p className="mt-4 text-green-600 dark:text-green-400">
                          {taskSuccessMessage}
                        </p>
                      )}
                      {error && (
                        <p className="mt-4 text-red-600 dark:text-red-400">
                          {error}
                        </p>
                      )}
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div></div>
    );
  }

export default CreateProject;
