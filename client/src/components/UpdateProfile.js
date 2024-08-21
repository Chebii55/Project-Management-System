import React, { useState } from 'react';

function UpdateProfile() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    phone: '',
    email: '',
    gender: '',
    role: '',
    memberNo: '',
    dateOfBirth: '',
    memberStatus: '',
    idNo: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const validationErrors = {};
    if (!formData.fullName) validationErrors.fullName = 'Full Name is required.';
    if (!formData.username) validationErrors.username = 'Username is required.';
    if (!formData.phone) validationErrors.phone = 'Phone Number is required.';
    if (!formData.email) validationErrors.email = 'Email Address is required.';
    if (!formData.gender) validationErrors.gender = 'Gender is required.';
    if (!formData.role) validationErrors.role = 'Role is required.';
    if (!formData.memberNo) validationErrors.memberNo = 'Member No is required.';
    if (!formData.dateOfBirth) validationErrors.dateOfBirth = 'Date of Birth is required.';
    if (!formData.memberStatus) validationErrors.memberStatus = 'Member Status is required.';
    if (!formData.idNo) validationErrors.idNo = 'ID No is required.';
    if (formData.password !== formData.confirmPassword) validationErrors.confirmPassword = 'Passwords do not match.';

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await fetch('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Handle successful response
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="mb-5">
                <label htmlFor="fullName" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-2">{errors.fullName}</p>}
              </div>

              {/* Username */}
              <div className="mb-5">
                <label htmlFor="username" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                  Username <span className="text-red-500">*</span>
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
                {errors.username && <p className="text-red-500 text-sm mt-2">{errors.username}</p>}
              </div>

              {/* Phone Number */}
              <div className="mb-5">
                <label htmlFor="phone" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone}</p>}
              </div>

              {/* Email Address */}
              <div className="mb-5">
                <label htmlFor="email" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                  Email Address <span className="text-red-500">*</span>
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
                {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
              </div>

              {/* Gender */}
              <div className="mb-5">
                <label htmlFor="gender" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  id="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-2">{errors.gender}</p>}
              </div>

              {/* Role */}
              <div className="mb-5">
                <label htmlFor="role" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
                >
                  <option value="">Select Role</option>
                  <option value="member">Member</option>
                  <option value="project_owner">Project Owner</option>
                </select>
                {errors.role && <p className="text-red-500 text-sm mt-2">{errors.role}</p>}
              </div>

              {/* Member No */}
              <div className="mb-5">
                <label htmlFor="memberNo" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                  Member No <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="memberNo"
                  id="memberNo"
                  placeholder="Member No"
                  value={formData.memberNo}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
                />
                {errors.memberNo && <p className="text-red-500 text-sm mt-2">{errors.memberNo}</p>}
              </div>

              {/* Date of Birth */}
              <div className="mb-5">
                <label htmlFor="dateOfBirth" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  id="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
                />
                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-2">{errors.dateOfBirth}</p>}
              </div>

              {/* Member Status */}
              <div className="mb-5">
                <label htmlFor="memberStatus" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                  Member Status <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="memberStatus"
                  id="memberStatus"
                  placeholder="Member Status"
                  value={formData.memberStatus}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
                />
                {errors.memberStatus && <p className="text-red-500 text-sm mt-2">{errors.memberStatus}</p>}
              </div>

              {/* ID No */}
              <div className="mb-5">
                <label htmlFor="idNo" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                  ID No <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="idNo"
                  id="idNo"
                  placeholder="ID No"
                  value={formData.idNo}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
                />
                {errors.idNo && <p className="text-red-500 text-sm mt-2">{errors.idNo}</p>}
              </div>

              {/* Address */}
              <div className="mb-5 col-span-2">
                <label htmlFor="address" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                  Address
                </label>
                <textarea
                  name="address"
                  id="address"
                  rows="4"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md resize-none"
                />
                {errors.address && <p className="text-red-500 text-sm mt-2">{errors.address}</p>}
              </div>

              {/* Password */}
              <div className="mb-5">
                <label htmlFor="password" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="New Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
                />
                {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="mb-5">
                <label htmlFor="confirmPassword" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-2">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;
