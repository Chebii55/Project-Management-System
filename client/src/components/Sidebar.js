import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getToken } from "./auth";

function Sidebar() {
    const [userRole, setUserRole] = useState(null); // State to store the user role

    useEffect(() => {
        // Function to fetch the user session data
        const fetchUserSession = async () => {
            try {
              const token = getToken();
              const response = await fetch('/check_session', {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
                
                if (response.ok) {
                    const data = await response.json();
                    setUserRole(data.role); // Assuming response contains role information
                } else {
                    console.error('Failed to fetch user session');
                }
            } catch (error) {
                console.error('Error fetching user session:', error);
            }
        };

        fetchUserSession();
    }, []);

    return (
        <div className="w-1/4 bg-white dark:bg-gray-800 shadow-md">
            <div className="px-6 py-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>
            </div>
            <nav className="px-6">
                <Link to="/update-profile" className="block py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
                    Update Profile
                </Link>
                <Link to="/calendar" className="block py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
                    Calendar
                </Link>
                {userRole === 'member' ? (
                    <Link to="/tasks" className="block py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
                        View Tasks
                    </Link>
                ) : (<>
                    <Link to="/projects-view" className="block py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
                        Projects
                    </Link>
                    <Link to="/members" className="block py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
                     View Members
                     </Link></>
                )}
                <Link to="/settings" className="block py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
                    Settings
                </Link>
            </nav>
        </div>
    );
}

export default Sidebar;
