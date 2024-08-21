import React, { useState } from 'react';
import Calendar from 'react-calendar';

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>Calendar</h2>
      <div style={{ width: '100%', height: '100%' }}>
        <Calendar
          onChange={onChange}
          value={date}
        />
      </div>
      <style>
        {`
          .react-calendar {
            width: 100%; 
            height: 100%; 
          }
  
          .react-calendar__tile {
            height: 50px; 
          }
  
          .react-calendar__navigation {
            height: 50px; 
          }
  
          .react-calendar__navigation__label {
            color: black !important;
          }
        `}
      </style>
    </div>
  );
};

export default CalendarComponent;
