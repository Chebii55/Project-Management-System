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
import About from './About';
import ViewTasks from './ViewTasks'
import TaskDetails from './TaskDetails';
import ViewMembers from './ViewMembers';
import ProjectDetails from './ProjectDetails';
import ErrorPage from './ErrorPage';

const App = () => {
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
          <Route path="/about" element={<About/>} /> 
          <Route path="/tasks" element={<ViewTasks/>} /> 
          <Route path="/tasks/:taskId" element={<TaskDetails/>} /> 
          <Route path="/projects/:projectId" element={<ProjectDetails/>} /> 
          <Route path="/members" element={<ViewMembers/>} /> 
          <Route path='/error-page' element={<ErrorPage/>} />
       </Routes>
      </div>
    </Router>
  );
};

export default App;