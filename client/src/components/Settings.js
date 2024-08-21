import React, { useState } from 'react';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
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
      // Handle password update here
      console.log('Password updated');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-12 bg-gray-100 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-6">Update Password</h2>
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
    </div>
  );
}

export default Settings;
