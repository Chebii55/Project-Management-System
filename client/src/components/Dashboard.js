import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { getToken } from './auth';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error('No token found');

        const response = await fetch('/check_session', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const sessionData = await response.json();
        if (response.ok) {
          const userResponse = await fetch(`/users/${sessionData.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          const userData = await userResponse.json();
          if (userResponse.ok) {
            setUserData(userData);
          } else {
            throw new Error('Failed to fetch user details');
          }
        } else {
          throw new Error('Failed to fetch session data');
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);

  if (error) {
    return <p className="text-red-600 dark:text-red-400">{error}</p>;
  }

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">

      <Sidebar />
      <div className="flex-1 flex flex-col p-10 space-y-8 bg-gray-100 dark:bg-gray-900 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Welcome {userData.username}</h2>
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVTtlOwG_6l93Lo3NcGZcQpGx4LXNwa3lF5A&s"
                alt="User profile"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <p className="mt-1 text-gray-900 dark:text-white">{userData.full_name}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <p className="mt-1 text-gray-900 dark:text-white">@{userData.username}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <p className="mt-1 text-gray-900 dark:text-white">{userData.email}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <p className="mt-1 text-gray-900 dark:text-white">{userData.role}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
            <p className="mt-1 text-gray-900 dark:text-white">{userData.gender}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Member No</label>
            <p className="mt-1 text-gray-900 dark:text-white">{userData.member_no}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
            <p className="mt-1 text-gray-900 dark:text-white">{new Date(userData.date_of_birth).toLocaleDateString()}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ID No</label>
            <p className="mt-1 text-gray-900 dark:text-white">{userData.id_no}</p>
          </div>
          <div className="sm:col-span-2 p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
            <p className="mt-1 text-gray-900 dark:text-white">{userData.address}</p>
          </div>
          <div className="sm:col-span-2 p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Member Status</label>
            <p className="mt-1 text-gray-900 dark:text-white">{userData.member_status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
