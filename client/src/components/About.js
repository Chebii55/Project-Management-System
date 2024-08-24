import React from "react";
import Sidebar from "./Sidebar";

function About() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white dark:bg-gray-700 h-full overflow-auto">
          <div className="relative pt-8">
            <div className="absolute inset-0 h-1/2 dark:bg-gray-700"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 text-center">
                  Project Management System
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Welcome to our Project Management System, designed to streamline collaboration between Project Managers and Members. Our platform offers secure login and registration, with strict password requirements for enhanced security.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  The home page serves as your central hub, featuring a comprehensive dashboard displaying personal profile details such as name, ID number, gender, address, member number, date of birth, member status, and email address.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Project Managers have exclusive access to create and manage new projects. Members can view ongoing projects, contribute to them, and see completed projects. The system also facilitates group placements by administrators, who can assign members to various groups and sites. Members can easily view their group assignments and site placements.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Stay informed with our notifications section, keep track of important deadlines with the integrated calendar, and manage your account through the settings. The platform also supports secure storage of user and project data, and allows for easy report generation.
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Thank you for using our Project Management System to enhance your project collaborations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
