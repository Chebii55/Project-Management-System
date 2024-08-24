# Project Management System

This Project Management System allows administrators and members to manage and track projects, tasks, and group placements. The system provides a range of features for user management, project management, and task management, along with a secure authentication system.

## Features

- **User Authentication**
  - User registration, login, and logout functionalities.
  - Password change functionality with validation.

- **User Management**
  - Display and manage user profiles.
  - Admin access to manage users.

- **Project Management**
  - Create, view, update, and manage projects.
  - Role-based access to project features.

- **Task Management**
  - Create, view, and update tasks.
  - Assign tasks to specific users.

- **Group Placement**
  - Administrators can assign users to groups.
  - Members can view their assigned groups and project placements.

- **Notifications**
  - Users receive notifications about new projects and important updates.

- **Calendar**
  - View upcoming projects and deadlines.

## API Endpoints

- **Index**
  - `GET /`
  - Returns the index of the API.

- **Login**
  - `POST /login`
  - Authenticates a user and returns a token.

- **Check Session**
  - `GET /check_session`
  - Checks if the user session is active.

- **Signup**
  - `POST /signup`
  - Registers a new user.

- **Logout**
  - `POST /logout`
  - Logs out the current user.

- **Users**
  - `GET /users`
  - Returns a list of users.
  
  - `GET /users/<int:user_id>`
  - Returns details for a specific user.

- **Projects**
  - `GET /projects`
  - Returns a list of projects.
  
  - `GET /projects/<int:project_id>`
  - Returns details for a specific project.

- **Tasks**
  - `GET /tasks`
  - Returns a list of tasks.
  
  - `GET /tasks/<int:task_id>`
  - Returns details for a specific task.

- **Change Password**
  - `POST /change_password`
  - Allows users to change their password.

## Frontend Components

- **App.js**: Main entry point for the React app.
- **Auth.js**: Handles authentication logic.
- **Sidebar.js**: Contains the navigation sidebar.
- **Dashboard.js**: Displays user information and dashboard features.
- **CreateProject.js**: Allows admins to create new projects.
- **TaskDetails.js**: Displays details of a specific task.
- **Login.js**: Login form for users.
- **Signup.js**: Signup form for new users.
- **UpdateProfile.js**: Form to update user profiles.
- **ViewTasks.js**: Displays tasks assigned to the user.
- **ViewMembers.js**: Displays and manages members in the system.
- **Settings.js**: Contains user settings, including password change.
- **GroupPlacement.js**: Manages group placements.
- **LogoutPopup.js**: Handles logout confirmation.
- **ErrorPage.js**: Displays error messages when appropriate.
- **Navbar.js**: Top navigation bar.
- **CalenderComponent.js**: Displays the calendar for upcoming events.

## Installation Guide

### Backend (Flask)

1. **Install Python 3.x**

   // sudo apt-get install python3

## Clone the Repository

// git clone https://github.com/your-repo/project-management-system.git
// cd project-management-system/backend

## Create a Virtual Environment

// python3 pipenv shell

## Install Dependencies

// pip install -r requirements.txt
// Set Up Environment Variables

### Set Up the Database
# Run the Flask Application

// python3 app.py 

Run the Flask Application


### Frontend (React)
# Install Node.js and npm

// sudo apt-get install nodejs npm

Navigate to the Frontend Directory

// cd ../client

## Install Dependencies
Set Up Environment Variables

// npm install
Set Up Environment Variables

Create a .env file in the frontend directory and add the necessary environment variables.

// npm start
Access the Application

The backend will run on http://localhost:5000.

The frontend will be accessible on http://localhost:3000.


## License
This project is licensed under the MIT License. See the LICENSE file for more details.





