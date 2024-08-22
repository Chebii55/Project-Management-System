import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { getToken } from './auth';

function Settings() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    let newErrors = { ...errors };

    // Password validation
    if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'New password must be at least 8 characters long.';
      valid = false;
    } else {
      newErrors.newPassword = '';
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'New passwords do not match.';
      valid = false;
    } else {
      newErrors.confirmNewPassword = '';
    }

    setErrors(newErrors);

    if (valid) {
      try {
        const token = getToken();
        const response = await fetch('/change_password', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: userData.id, // Pass user ID to the backend
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
          })
        });

        const result = await response.json();
        if (response.ok) {
          setSuccessMessage(result.message);
          setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); // Clear form
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  if (error) {
    return <p className="text-red-600 dark:text-red-400">{error}</p>;
  }

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-8 overflow-auto">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-6">
            Update Password
          </h2>
          {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="currentPassword" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                id="currentPassword"
                placeholder="Current Password"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
              />
              {errors.currentPassword && <p className="text-red-500 text-sm mt-2">{errors.currentPassword}</p>}
            </div>
            <div className="mb-5">
              <label htmlFor="newPassword" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
              />
              {errors.newPassword && <p className="text-red-500 text-sm mt-2">{errors.newPassword}</p>}
            </div>
            <div className="mb-5">
              <label htmlFor="confirmNewPassword" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmNewPassword"
                id="confirmNewPassword"
                placeholder="Confirm New Password"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
              />
              {errors.confirmNewPassword && <p className="text-red-500 text-sm mt-2">{errors.confirmNewPassword}</p>}
            </div>
            <div>
              <button
                type="submit"
                className="w-full rounded-md bg-blue-500 py-3 text-white hover:bg-blue-600 focus:bg-blue-700 focus:outline-none"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Settings;
