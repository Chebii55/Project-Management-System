import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { getToken } from "./auth";
import { Link } from "react-router-dom";
import { FaTrash, FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";

function ProjectView() {
  const [ownerProjects, setOwnerProjects] = useState([]);
  const [users, setUsers] = useState({});
  const [error, setError] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);

  useEffect(() => {
    const fetchOwnerProjects = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error("No token found");

        const sessionResponse = await fetch("/check_session", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!sessionResponse.ok) {
          throw new Error("Failed to fetch session data");
        }

        const sessionData = await sessionResponse.json();

        const userResponse = await fetch(`/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user-related projects");
        }

        const allProjects = await userResponse.json();

        const filteredProjects = allProjects.filter(
          (project) => project.owner_id === sessionData.id
        );

        setOwnerProjects(filteredProjects);

        const usersResponse = await fetch(`/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!usersResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const usersData = await usersResponse.json();
        const usersMap = {};
        usersData.forEach((user) => {
          usersMap[user.id] = user.full_name; // Assuming 'full_name' is the property for the user's name
        });

        setUsers(usersMap);
      } catch (error) {
        setError(error.message);
        console.error("Fetch error:", error.message);
      }
    };

    fetchOwnerProjects();
  }, []);

  const handleDelete = async (projectId) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token found");

      const response = await fetch(`/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      setOwnerProjects(ownerProjects.filter((project) => project.id !== projectId));
    } catch (error) {
      setError(error.message);
      console.error("Delete error:", error.message);
    }
  };

  const toggleTaskDetails = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-red-500";
      case "in-progress":
        return "text-blue-500";
      case "completed":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  if (error) {
    return <p className="text-red-600 dark:text-red-400">{error}</p>;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white dark:bg-gray-700 h-full overflow-auto">
          <div className="relative pt-8">
            <div className="absolute inset-0 h-1/2 dark:bg-gray-700"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-6">
                <Link
                  to="/create-project"
                  className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600"
                >
                  <FaPlus className="mr-2" size={20} />
                  Create Project
                </Link>
              </div>

              {ownerProjects.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
                    You have no projects
                  </h2>
                  <p className="text-gray-500 dark:text-gray-300 mb-6">
                    Start your journey by creating a new project!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ownerProjects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden relative"
                    >
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <FaTrash size={20} />
                      </button>
                      <div className="p-6">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                          {project.project_name}
                        </h4>
                        <p className="text-blue-600 dark:text-blue-400 mb-4">
                        {project.details}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Tasks
                        </p>
                        {project.tasks && project.tasks.length > 0 ? (
                          <ul className="space-y-2">
                            {project.tasks.slice(0, 5).map((task) => (
                              <li key={task.id} className="border-t pt-2">
                                <div
                                  className="flex justify-between items-center cursor-pointer"
                                  onClick={() => toggleTaskDetails(task.id)}
                                >
                                  <h5 className="font-medium text-gray-800 dark:text-gray-200">
                                    {task.task_name}
                                  </h5>
                                  {expandedTask === task.id ? (
                                    <FaChevronUp />
                                  ) : (
                                    <FaChevronDown />
                                  )}
                                </div>
                                {expandedTask === task.id && (
                                  <div className="mt-2">
                                    <p className="text-gray-600 dark:text-gray-400">
                                      {task.description}
                                    </p>
                                    <p className="text-gray-500 dark:text-white">
                                      Status:{" "}
                                      <span className={getStatusColor(task.status)}>
                                        {task.status}
                                      </span>
                                    </p>
                                    <p className="text-white dark:text-white">
                                      Assigned to: {users[task.assigned_member_id] || "Unknown"}
                                    </p>
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400">
                            No tasks assigned
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectView;
