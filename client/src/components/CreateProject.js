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
  const [projectSuccessMessage, setProjectSuccessMessage] = useState(null);
  const [taskSuccessMessage, setTaskSuccessMessage] = useState(null);
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

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    setError(null);
    setProjectSuccessMessage(null);

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
      setProjectSuccessMessage("Project created successfully!");
      setShowTaskForm(true); // Show task form after project is created
    } catch (error) {
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
            description: task.description,
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
      setTasks([{ task_name: "", description: "", deadline: "", assigned_member_id: "", status: "pending" }]);
      setShowTaskForm(true); // Keep the task form visible after tasks are created
    } catch (error) {
      setError(error.message);
    }
  };

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
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Project Description
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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

                  {error && (
                    <div className="text-red-600 dark:text-red-400 mb-4">
                      <p>{error}</p>
                    </div>
                  )}
                  {projectSuccessMessage && (
                    <div className="text-green-600 dark:text-green-400 mb-4">
                      <p>{projectSuccessMessage}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
                  >
                    Create Project
                  </button>
                </form>

                {showTaskForm && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Add Tasks
                    </h3>

                    <form onSubmit={handleSubmitTasks}>
                      {tasks.map((task, index) => (
                        <div key={index} className="mb-6">
                          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                            Task {index + 1}
                          </h4>

                          <div className="mb-4">
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
                              required
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>

                          <div className="mb-4">
                            <label
                              htmlFor={`taskDescription-${index}`}
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Description
                            </label>
                            <textarea
                              id={`taskDescription-${index}`}
                              value={task.description}
                              onChange={(e) =>
                                handleTaskChange(index, "description", e.target.value)
                              }
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>

                          <div className="mb-4">
                            <label
                              htmlFor={`taskDeadline-${index}`}
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Deadline
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

                          <div className="mb-4">
                            <label
                              htmlFor={`assignedMember-${index}`}
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Assign Member
                            </label>
                            <select
                              id={`assignedMember-${index}`}
                              value={task.assigned_member_id}
                              onChange={(e) =>
                                handleTaskChange(index, "assigned_member_id", e.target.value)
                              }
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="" className="text-gray-500 dark:text-gray-400">
                                Select Member
                              </option>
                              {members.map((member) => (
                                <option key={member.id} value={member.id} className="text-gray-900 dark:text-white">
                                  {member.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex justify-between">
                            <button
                              type="button"
                              onClick={() => removeTask(index)}
                              className="text-red-600 dark:text-red-400"
                            >
                              Remove Task
                            </button>
                            {tasks.length === index + 1 && (
                              <button
                                type="button"
                                onClick={addTask}
                                className="text-indigo-600 dark:text-indigo-400"
                              >
                                Add Another Task
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {error && (
                        <div className="text-red-600 dark:text-red-400 mb-4">
                          <p>{error}</p>
                        </div>
                      )}
                      {taskSuccessMessage && (
                        <div className="text-green-600 dark:text-green-400 mb-4">
                          <p>{taskSuccessMessage}</p>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
                      >
                        Save Tasks
                      </button>
                    </form>
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
