import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoutPopup from "./LogoutPopup"; // Import the LogoutPopup component
import { removeToken } from "./auth"; // Import removeToken function

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false); // State to control the logout popup
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogoutClick = () => {
        setShowLogoutPopup(true); // Show the logout popup
    };

    const confirmLogout = () => {
        setShowLogoutPopup(false);
        removeToken(); // Remove the token using the removeToken function
        console.log('User logged out');
        navigate('/'); // Redirect to home or login page after logout
    };

    const cancelLogout = () => {
        setShowLogoutPopup(false); // Close the popup without logging out
    };

    return (
        <nav className="bg-black p-4">
            <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center">
                <Link to="/dashboard"><div className="text-white font-bold text-3xl mb-4 lg:mb-0 hover:text-blue-600 hover:cursor-pointer">
                    Project Management System
                </div></Link>

                <div className="lg:hidden">
                    <button onClick={toggleMenu} className="text-white focus:outline-none">
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            ></path>
                        </svg>
                    </button>
                </div>

                <div className={`lg:flex flex-col lg:flex-row ${isOpen ? 'block' : 'hidden'} lg:space-x-4 lg:mt-0 mt-4 flex flex-col items-center text-xl`}>
                    <Link to="/dashboard" className="text-white px-4 py-2 hover:text-blue-600">Home</Link>
                    <Link to="/projects-view" className="text-white px-4 py-2 hover:text-blue-600">Projects</Link>
                    <Link to="/about" className="text-white px-4 py-2 hover:text-blue-600">About</Link>
                    <span onClick={handleLogoutClick} className="text-white px-4 py-2 hover:text-blue-600 cursor-pointer">Log Out</span>
                </div>
            </div>
            {/* Logout Popup to confirm logout */}
            <LogoutPopup show={showLogoutPopup} onConfirm={confirmLogout} onCancel={cancelLogout} />
        </nav>
    );
}

export default Navbar;
