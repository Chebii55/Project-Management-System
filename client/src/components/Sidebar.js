import React from "react";
import {Link} from "react-router-dom"

function Sidebar(){

    return(
        <>
        <div className="w-1/4 bg-white dark:bg-gray-800 shadow-md">
        <div className="px-6 py-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>
        </div>
        <nav className="px-6">
          <Link  to="/update-profile" className="block py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
            Update Profile
          </Link >
          <Link to="/calendar" className="block py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
            Calendar
          </Link>
          <Link  to="/projects-view" className="block py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
            Projects
          </Link >
          <Link  to="#notifications" className="block py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
            Notifications
          </Link >
          <Link  to="#billing" className="block py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
            Billing
          </Link >
          <Link to="/settings" className="block py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
            Settings
          </Link >
        </nav>
      </div>
        </>
    )
}

export default Sidebar;