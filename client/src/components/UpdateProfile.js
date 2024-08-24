import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { getToken } from './auth';

function UpdateProfile() {
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    role: '',
    gender: '',
    member_no: '',
    date_of_birth: '',
    member_status: '',
    id_no: '',
    address: '',
  });

  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error('No token found');

        const response = await fetch('/check_session', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const sessionData = await response.json();
        if (!response.ok) throw new Error('Failed to fetch session data');

        const userResponse = await fetch(`/users/${sessionData.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const userData = await userResponse.json();
        if (!userResponse.ok) throw new Error('Failed to fetch user details');

        setUserData(userData);
        setFormData({
          username: userData.username,
          email: userData.email,
          role: userData.role,
          full_name: userData.full_name,
          gender: userData.gender,
          member_no: userData.member_no,
          date_of_birth: userData.date_of_birth,
          member_status: userData.member_status,
          id_no: userData.id_no,
          address: userData.address,
        });
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = getToken();
      if (!token) throw new Error('No token found');

      console.log('Submitting formData:', formData); // Console log formData

      const response = await fetch(`/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setSuccessMessage('Profile updated successfully'); // Set success message
      setError(null); // Clear any existing errors
    } catch (error) {
      setSuccessMessage(''); // Clear success message
      setError('Error updating profile: ' + error.message);
      console.error('Error updating profile:', error);
    }
  };

  if (error) {
    return <p className="text-red-600 dark:text-red-400">{error}</p>;
  }

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
          {successMessage && (
            <div className="mb-5 text-green-600 dark:text-green-400 p-4 bg-green-100 dark:bg-green-700 rounded-md">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mb-5 text-red-600 dark:text-red-400 p-4 bg-red-100 dark:bg-red-700 rounded-md">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="mb-5">
                <label htmlFor="full_name" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  id="full_name"
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
                />
              </div>

              {/* Username */}
              <div className="mb-5">
                <label htmlFor="username" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
                />
              </div>

              {/* Email */}
              <div className="mb-5">
                <label htmlFor="email" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
                />
              </div>

              {/* Role */}
              <div className="mb-5">
                <label htmlFor="role" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  id="role"
                  placeholder="Role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
                />
              </div>

              {/* Gender */}
              <div className="mb-5">
                <label htmlFor="gender" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Member No */}
              <div className="mb-5">
                <label htmlFor="member_no" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                  Member No
                </label>
                <input
                  type="text"
                  name="member_no"
                  id="member_no"
                  placeholder="Member No"
                  value={formData.member_no}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
                />
              </div>

              {/* Date of Birth */}
              <div className="mb-5">
                <label htmlFor="date_of_birth" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  id="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
                />
              </div>

              {/* Member Status */}
              <div className="mb-5">
                <label htmlFor="member_status" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                  Member Status(active/inactive)
                </label>
                <input
                  type="text"
                  name="member_status"
                  id="member_status"
                  placeholder="Member Status"
                  value={formData.member_status}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
                />
              </div>

              {/* ID No */}
              <div className="mb-5">
                <label htmlFor="id_no" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                  ID No
                </label>
                <input
                  type="text"
                  name="id_no"
                  id="id_no"
                  placeholder="ID No"
                  value={formData.id_no}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
                />
              </div>

              {/* Address */}
              <div className="mb-5">
                <label htmlFor="address" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="mt-4 rounded-md bg-blue-500 py-2 px-4 text-white dark:text-gray-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default UpdateProfile;
