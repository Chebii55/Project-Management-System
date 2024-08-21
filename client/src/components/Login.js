import React, { useState } from 'react';
import { useNavigate ,Link} from 'react-router-dom';
import axios from 'axios'; // Import Axios
import { setToken } from './auth';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    let newErrors = { ...errors };

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
      valid = false;
    } else {
      newErrors.password = '';
    }

    setErrors(newErrors);

    if (valid) {
      try {
        const response = await axios.post('/login', formData);
        console.log('Login successful');
        setToken(response.data.access_token);

        navigate('/dashboard'); // Redirect to Dashboard after login
      } catch (error) {
        console.error('Login failed', error);
        setErrors({ ...errors, password: 'Invalid username or password' });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-12 bg-gray-100 dark:bg-gray-900">
      <div className="relative mx-auto w-full max-w-md bg-white dark:bg-gray-800 px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
        <div className="text-center p-4 rounded-lg">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Sign In</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Sign in below to access your account</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-5">
          <div className="relative mt-6">
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="peer mt-1 w-full border-b-2 border-gray-300 dark:border-gray-600 bg-transparent px-0 py-1 text-gray-900 dark:text-white placeholder:text-transparent focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none"
              autoComplete="off"
            />
            <label
              htmlFor="username"
              className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 dark:text-gray-400 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800 dark:peer-focus:text-gray-400"
            >
              Username
            </label>
          </div>
          <div className="relative mt-6">
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="peer mt-1 w-full border-b-2 border-gray-300 dark:border-gray-600 bg-transparent px-0 py-1 text-gray-900 dark:text-white placeholder:text-transparent focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none"
              autoComplete="off"
            />
            <label
              htmlFor="password"
              className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 dark:text-gray-400 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800 dark:peer-focus:text-gray-400"
            >
              Password
            </label>
            {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
          </div>
          <div className="my-6">
            <button
              type="submit"
              className="w-full rounded-md bg-blue-500 py-3 text-white hover:bg-blue-600 focus:bg-blue-700 focus:outline-none"
            >
              Sign In
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don&#x27;t have an account yet?{' '}
            <Link
              to="/signup"
              className="font-semibold text-gray-600 dark:text-gray-300 hover:underline focus:text-gray-800 dark:focus:text-gray-400 focus:outline-none"
            >
              Sign up
            </Link>.
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
