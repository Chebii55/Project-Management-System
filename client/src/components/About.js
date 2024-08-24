import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { getToken } from "./auth";

function About() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/error-page");
    }
  }, [navigate]);

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
                <p className="text-gray-600 text-[18px] dark:text-gray-300 mb-4">
                  Welcome to our Project Management System, designed to streamline collaboration between Project Managers and Members. Our platform offers secure login and registration, with strict password requirements for enhanced security.
                </p>
                <p className="text-gray-600 text-[18px] dark:text-gray-300 mb-4">
                  The home page serves as your central hub, featuring a comprehensive dashboard displaying personal profile details such as name, ID number, gender, address, member number, date of birth, member status, and email address.
                </p>
                <p className="text-gray-600 text-[18px] dark:text-gray-300 mb-5">
                  Project Managers have exclusive access to create and manage new projects. Members can view ongoing projects, contribute to them, and see completed projects. The system also facilitates task allocation by administrators. Members can easily view their group assignments and site placements.
                </p>
                
                <p className="text-gray-600 text-[12px] dark:text-gray-300 text-center">
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
