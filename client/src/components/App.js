import '../App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import ProjectsView from './ProjectsView';
import Login from './Login';
import SignUp from './SignUp';
import Dashboard from './Dashboard';
import GroupPlacement from './GroupPlacement';
import Settings from './Settings';
import CalendarComponent from './CalenderComponent';
import UpdateProfile from './UpdateProfile';
import CreateProject from './CreateProject';

const App = () => {
  // const [user,setUser] = useState(null);

  // useEffect(() => {
    
  //   fetch('/check-session',{
  //   method: 'GET',
  //   headers: {
  //     'Authorization':`Bearer ${localStorage.getItem('JWT')}`
  //   }}
  //   )
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       setUser(data)
          
        
  //     })
  //     .catch(error => {
  //       console.error('Error checking session:', error);
  //     });
  // }, []);

  return (
    <Router>
      <div>
        <Navbar  /> 
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/projects-view" element={<ProjectsView />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/group-placement" element={<GroupPlacement />} />
          <Route path="/calendar" element={<CalendarComponent />} />
          <Route path="/update-profile" element={<UpdateProfile />} /> 
          <Route path="/create-project" element={<CreateProject/>} /> 
       </Routes>
      </div>
    </Router>
  );
};

export default App;