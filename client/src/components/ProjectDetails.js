import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { getToken } from "./auth";
import { Link, useParams } from "react-router-dom";
import { FaChevronDown, FaChevronUp, FaSave, FaEdit} from "react-icons/fa";

function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState({});
  const [error, setError] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState({});
  const [filter, setFilter] = useState("all"); // State for filtering tasks

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error("No token found");

        const projectResponse = await fetch(`/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!projectResponse.ok) {
          throw new Error("Failed to fetch project details");
        }

        const projectData = await projectResponse.json();
        setProject(projectData);
        setEditedProject(projectData);

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

    fetchProjectDetails();
  }, [projectId]);

  const toggleTaskDetails = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token found");
  
  
      const response = await fetch(`/projects/${projectId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedProject),
      });
  
      // Debug: Log the response status and body
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to save project details");
      }
  
      setProject(editedProject);
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
      console.error("Save error:", error.message);
    }
  };
  

  if (error) {
    return <p className="text-red-600 dark:text-red-400">{error}</p>;
  }

  if (!project) {
    return <p className="text-gray-600 dark:text-gray-400">Loading...</p>;
  }

  const filteredTasks = project.tasks.filter((task) => filter === "all" || task.status === filter);

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
                  to="/projects-view"
                  className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600"
                >
                  Back to Projects
                </Link>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProject.project_name}
                        onChange={(e) =>
                          setEditedProject({
                            ...editedProject,
                            project_name: e.target.value,
                          })
                        }
                        className="bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      project.project_name
                    )}
                  </h2>
                  <div>
                    {isEditing ? (
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                      >
                        <FaSave className="mr-2" />
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={handleEdit}
                        className="px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                      >
                        <FaEdit className="mr-2" />
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {isEditing ? (
                    <textarea
                      value={editedProject.details}
                      onChange={(e) =>
                        setEditedProject({
                          ...editedProject,
                          details: e.target.value,
                        })
                      }
                      className="bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    project.details
                  )}
                </p>

                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Deadline:{" "}
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedProject.deadline}
                      onChange={(e) =>
                        setEditedProject({
                          ...editedProject,
                          deadline: e.target.value,
                        })
                      }
                      className="bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    project.deadline
                  )}
                </p>

                <div className="mb-4 flex space-x-4">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded-md ${filter === "all" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter("pending")}
                    className={`px-4 py-2 rounded-md ${filter === "pending" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"}`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setFilter("in-progress")}
                    className={`px-4 py-2 rounded-md ${filter === "in-progress" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => setFilter("completed")}
                    className={`px-4 py-2 rounded-md ${filter === "completed" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"}`}
                  >
                    Completed
                  </button>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Tasks
                </h3>
                {filteredTasks && filteredTasks.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTasks.map((task) => (
                      <div key={task.id} className={`bg-white dark:bg-gray-800 border rounded-lg shadow-md p-4 ${getStatusColor(task.status)}`}>
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
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No tasks assigned
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
