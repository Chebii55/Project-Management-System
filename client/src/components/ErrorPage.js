import React from 'react';
import { Link } from 'react-router-dom';

function ErrorPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Error</h1>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          It seems you're not logged in. Please log in to access this page.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;
