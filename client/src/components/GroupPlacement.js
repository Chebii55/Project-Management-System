import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default Calendar styles

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 h-screen flex items-center justify-center p-4">
      <div className="relative max-w-lg w-full rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <div className="absolute inset-0 h-1/3 bg-gradient-to-b from-gray-100 to-transparent dark:from-gray-700"></div>
        <div className="relative p-6 lg:p-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">Calendar</h2>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-md">
            <Calendar
              onChange={onChange}
              value={date}
              className="react-calendar"
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        .react-calendar {
          border: none;
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .react-calendar__tile {
          height: 50px;
          transition: background-color 0.3s ease, color 0.3s ease;
          border-radius: 0.5rem;
        }

        .react-calendar__tile:hover {
          background-color: #f7fafc; /* Light gray for hover */
        }

        .react-calendar__tile--active {
          background-color: #3182ce; /* Blue for active tile */
          color: #ffffff;
          border-radius: 0.5rem;
        }

        .react-calendar__navigation {
          height: 50px;
          border-bottom: 1px solid #e2e8f0; /* Light gray border */
        }

        .react-calendar__navigation__label {
          color: #1a202c; /* Dark mode text color */
        }

        .react-calendar__month-view__days__day {
          padding: 0;
          font-size: 1rem; /* Adjust font size */
        }

        .react-calendar__month-view__days__day--weekend {
          color: #e53e3e; /* Red for weekends */
        }

        .react-calendar__month-view__weekdays {
          font-size: 0.875rem; /* Smaller font size for weekdays */
        }
      `}</style>
    </div>
  );
};

export default CalendarComponent;
