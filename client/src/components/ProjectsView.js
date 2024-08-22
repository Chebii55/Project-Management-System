import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { getToken } from "./auth";
import { Link } from "react-router-dom";
import { FaTrash, FaPlus } from "react-icons/fa"; // Import additional icons

function ProjectView() {
  const [ownerProjects, setOwnerProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOwnerProjects = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error('No token found');

        const sessionResponse = await fetch('/check_session', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!sessionResponse.ok) {
          throw new Error('Failed to fetch session data');
        }

        const sessionData = await sessionResponse.json();

        const userResponse = await fetch(`/projects`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user-related projects');
        }

        const allProjects = await userResponse.json();

        // Filter projects where the owner ID matches the session data ID
        const filteredProjects = allProjects.filter(
          (project) => project.owner_id === sessionData.id
        );

        setOwnerProjects(filteredProjects);
      } catch (error) {
        setError(error.message);
        console.error('Fetch error:', error.message);
      }
    };

    fetchOwnerProjects();
  }, []);

  const handleDelete = async (projectId) => {
    try {
      const token = getToken();
      if (!token) throw new Error('No token found');

      const response = await fetch(`/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      // Remove the deleted project from the state
      setOwnerProjects(ownerProjects.filter(project => project.id !== projectId));
    } catch (error) {
      setError(error.message);
      console.error('Delete error:', error.message);
    }
  };

  if (error) {
    return <p className="text-red-600 dark:text-red-400">{error}</p>;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white dark:bg-gray-700 h-full overflow-auto">
          <div className="relative pt-8">
            <div className="absolute inset-0 h-1/2 dark:bg-gray-700"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Always display the "Create Project" button */}
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
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}
                        </p>
                        {project.tasks && project.tasks.length > 0 ? (
                          <ul className="space-y-2">
                            {project.tasks.map((task) => (
                              <li key={task.id} className="border-t pt-2">
                                <h5 className="font-medium text-gray-800 dark:text-gray-200">
                                  {task.task_name}
                                </h5>
                                <p className="text-gray-600 dark:text-gray-400">
                                  {task.description}
                                </p>
                                <p className="text-gray-500 dark:text-gray-500">
                                  Status: {task.status}
                                </p>
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
