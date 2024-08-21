import React, { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { setToken } from "./auth";

function SignUp() {
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    phone: "",
    email: "",
    gender: "",
    member_no: "",
    member_status: "",
    id_no: "",
    address: "",
    password: "",
    confirmPassword: "",
    role: "",
    date_of_birth: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateDateOfBirth = (date) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  };

  // const generateMemberStatus = () => {
  //   return Math.floor(100 + Math.random() * 900).toString(); 
  // };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name) newErrors.full_name = "Full Name is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.phone) newErrors.phone = "Phone Number is required";
    if (!formData.email) newErrors.email = "Email Address is required";
    if (!validateEmail(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!["member", "project_owner"].includes(formData.role))
      newErrors.role = "Role must be either 'member' or 'project_owner'";
    if (!validateDateOfBirth(formData.date_of_birth))
      newErrors.date_of_birth = "Date of Birth must be in the format YYYY-MM-DD";
    if (!formData.member_no) newErrors.member_no = "Member No is required";
    if (!formData.member_status) formData.member_status = "Member No is required";
    if (!formData.id_no) newErrors.id_no = "ID No is required";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters long";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      setIsSubmitting(true);
  
      try {
        const response = await fetch("/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          console.log("Form data submitted:", result);
          setToken(result.access_token); // Use result.access_token instead of response.data.access_token
          navigate('/dashboard'); // Redirect to dashboard
          setFormData({
            full_name: "",
            username: "",
            phone: "",
            email: "",
            gender: "",
            member_no: "",
            member_status: "",
            id_no: "",
            address: "",
            password: "",
            confirmPassword: "",
            role: "",
            date_of_birth: "",
          });
        } else {
          setErrors(result.errors || { general: "An error occurred. Please try again." });
        }
      } catch (error) {
        setErrors({ general: "An error occurred. Please try again." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center p-12 bg-gray-100 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-[700px] bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-5">
              <label htmlFor="full_name" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                Full Name <span className="text-red-500">*</span>
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
              {errors.full_name && <p className="text-red-500 text-sm mt-2">{errors.full_name}</p>}
            </div>
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
            <div className="mb-5">
                  <label htmlFor="member_no" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                    Member No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="member_no"
                    id="member_no"
                    placeholder="Enter your member number"
                    value={formData.member_no}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
                  />
                  {errors.member_no && <p className="text-red-500 text-sm mt-2">{errors.member_no}</p>}
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="member_status"
                    className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300"
                  >
                    Member Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="member_status"
                    id="member_status"
                    value={formData.member_status}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
                  >
                    <option value="">Select Member Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  {errors.member_status && (
                    <p className="text-red-500 text-sm mt-2">{errors.member_status}</p>
                  )}
              </div>    
            <div className="mb-5">
                  <label htmlFor="date_of_birth" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    id="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
                  />
                  {errors.date_of_birth && <p className="text-red-500 text-sm mt-2">{errors.date_of_birth}</p>}
                </div>
            <div className="mb-5">
              <label htmlFor="id_no" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                ID No <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="id_no"
                id="id_no"
                placeholder="Enter your ID No"
                value={formData.id_no}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
              />
              {errors.id_no && <p className="text-red-500 text-sm mt-2">{errors.id_no}</p>}
            </div>
            <div className="col-span-2 mb-5">
              <label htmlFor="address" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="password" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
              />
              {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
            </div>
            <div className="mb-5">
              <label htmlFor="confirmPassword" className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-2">{errors.confirmPassword}</p>}
            </div>
          </div>
          {errors.general && <p className="text-red-500 text-sm mt-4">{errors.general}</p>}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-500 transition-all"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/"
                className="font-semibold text-gray-600 dark:text-gray-300 hover:underline focus:text-gray-800 dark:focus:text-gray-400 focus:outline-none"
              >
                Log in
              </Link>.
            </p>
      </div>
    </div>
  );
}

export default SignUp;
