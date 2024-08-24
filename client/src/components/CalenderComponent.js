import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import Sidebar from './Sidebar';
import { getToken } from './auth';

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error('No token found');

        // Fetch user ID
        const sessionResponse = await fetch('/check_session', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!sessionResponse.ok) throw new Error('Failed to fetch session data');

        const sessionData = await sessionResponse.json();
        const userId = sessionData.id;

        // Fetch tasks for the user
        const tasksResponse = await fetch('/tasks', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          // Filter tasks assigned to the user
          const userTasks = tasksData.filter(task => task.assigned_member_id === userId);
          setTasks(userTasks.map(task => ({
            id: task.id,
            name: task.name,
            deadline: new Date(task.deadline) // Assuming deadline is in ISO format
          })));
        } else {
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTasks();
  }, []);

  const onChange = (newDate) => {
    setDate(newDate);
  };

  const hasTaskOnDate = (date) => {
    return tasks.some(task => {
      const taskDate = new Date(task.deadline);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month' && hasTaskOnDate(date)) {
      return <div className="task-indicator">🔔</div>;
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-gray-800 dark:bg-gray-900">
      <Sidebar />

      <div className="flex-1 p-6">
        <Calendar
          onChange={onChange}
          value={date}
          className="react-calendar"
          tileContent={tileContent}
        />
      </div>

      <style>
        {`
          .react-calendar {
            width: 100%;
            height: 100%;
            background: #1f2937; /* Dark mode background color */
            border-radius: 0.5rem;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }

          .react-calendar__tile {
            height: 50px;
            color: white; /* White text color for tiles */
          }

          .react-calendar__navigation {
            height: 50px;
            color: white; /* White text color for navigation */
          }

          .react-calendar__navigation__label {
            color: white !important; /* White text color for navigation labels */
          }

          .react-calendar__tile:enabled:hover {
            background: #4b5563; /* Darker hover color */
          }

          .task-indicator {
            color: #f87171; /* Color for the task indicator */
            text-align: center;
            font-size: 1.2rem;
          }
        `}
      </style>
    </div>
  );
};

export default CalendarComponent;
