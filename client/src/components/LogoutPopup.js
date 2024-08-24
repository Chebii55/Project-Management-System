import React from 'react';

function LogoutPopup({ show, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Confirm Logout</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">Are you sure you want to log out?</p>
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md mr-2 hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutPopup;
