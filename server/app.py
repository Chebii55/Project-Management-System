from flask import make_response, jsonify, request, session
from flask_restful import Api, Resource
from flask_cors import CORS
from config import db, app, bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import Project,User,Task
from sqlalchemy import func
import math
from datetime import datetime

CORS(app)
api = Api(app)

class Index(Resource):
    def get(self):
        return make_response(jsonify({"message": "Welcome to the API!"}), 200)

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        user = User.query.filter_by(username=username).first()

        if user and user.authenticate(password):
            access_token = create_access_token(identity=user.id)
            return {"access_token": access_token}, 200
        elif user:
            return {"error": "Invalid password"}, 401
        else:
            return {"error": "User not found"}, 404

class CheckSession(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user:
            response = {
                "id": user.id,
                "username": user.username,
                "role": user.role,
            }
            return response, 200
        else:
            return {"error": "User not found"}, 404

class Signup(Resource):
    def post(self):
        data = request.get_json()
        try:
            # Check for existing user with the same id_no
            if User.query.filter_by(id_no=data['id_no']).first():
                return {"error": "ID number already exists. Please use a different one."}, 400

            if User.query.filter_by(member_no=data['member_no']).first():
                return {"error": "Member number already exists. Please use a different one."}, 400

            password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
            date_of_birth = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()

            new_user = User(
                username=data['username'],
                _password_hash=password_hash,
                email=data['email'],
                role=data.get('role', 'member'),
                full_name=data['full_name'],
                gender=data['gender'],
                member_no=data['member_no'],
                date_of_birth=date_of_birth,
                member_status=data.get('member_status', 'inactive'),
                id_no=data['id_no'],
                address=data.get('address')
            )

            db.session.add(new_user)
            db.session.commit()

            access_token = create_access_token(identity=new_user.id)
            return {"access_token": access_token}, 201
        except Exception as e:
            return {"error": str(e)}, 500


class Logout(Resource):
    @jwt_required()
    def delete(self):
        # Logout by removing JWT from client's storage, handled on the client-side.
        return {}, 204

class Users(Resource):
    def get(self):
        all_users = User.query.all()
        users = [user.to_dict() for user in all_users]
        return make_response(jsonify(users), 200)

    def post(self):
        data = request.get_json()
        try:
            password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')

            new_user = User(
                username=data['username'],
                _password_hash=password_hash,
                email=data['email'],
                role=data.get('role', 'user'),
                full_name=data['full_name'],
                gender=data['gender'],
                member_no=data['member_no'],
                date_of_birth=datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date(),
                member_status=data.get('member_status', 'active'),
                id_no=data['id_no'],
                address=data.get('address')
            )

            db.session.add(new_user)
            db.session.commit()

            return make_response(jsonify(new_user.to_dict()), 201)
        except Exception as e:
            return make_response(jsonify({'error': str(e)}), 500)

class UsersByID(Resource):
    def get(self, user_id):
        user = User.query.get(user_id)
        if user:
            return make_response(jsonify(user.to_dict()), 200)
        else:
            return make_response(jsonify({'error': 'User not found'}), 404)

    def put(self, user_id):
        data = request.get_json()
        user = User.query.get(user_id)
        if user:
            try:
                if 'username' in data:
                    user.username = data['username']
                if 'password' in data:
                    user._password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
                if 'email' in data:
                    user.email = data['email']
                if 'role' in data:
                    user.role = data['role']
                if 'full_name' in data:
                    user.full_name = data['full_name']
                if 'gender' in data:
                    user.gender = data['gender']
                if 'member_no' in data:
                    user.member_no = data['member_no']
                if 'date_of_birth' in data:
                    user.date_of_birth = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()
                if 'member_status' in data:
                    user.member_status = data['member_status']
                if 'id_no' in data:
                    user.id_no = data['id_no']
                if 'address' in data:
                    user.address = data['address']

                db.session.commit()
                return make_response(jsonify(user.to_dict()), 200)
            except Exception as e:
                return make_response(jsonify({'error': str(e)}), 500)
        else:
            return make_response(jsonify({'error': 'User not found'}), 404)

    def delete(self, user_id):
        user = User.query.get(user_id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return make_response(jsonify({'message': 'User deleted successfully'}), 200)
        else:
            return make_response(jsonify({'error': 'User not found'}), 404)

class Projects(Resource):
    def get(self):
        all_projects = Project.query.all()
        projects = [project.to_dict() for project in all_projects]
        return make_response(jsonify(projects), 200)

    @jwt_required()
    def post(self):
        owner_id = get_jwt_identity()
        user = User.query.get(owner_id)
        if user and user.role == "project_owner":
            data = request.get_json()
            try:
                # Convert deadline from string to date object if it exists
                deadline = None
                if data.get('deadline'):
                    deadline = datetime.strptime(data['deadline'], '%Y-%m-%d').date()

                new_project = Project(
                    project_name=data['project_name'],
                    details=data['details'],
                    deadline=deadline,  # Set the converted date object
                    owner_id=owner_id
                )

                db.session.add(new_project)
                db.session.commit()

                return make_response(jsonify(new_project.to_dict()), 201)
            except Exception as e:
                return make_response(jsonify({'error': str(e)}), 500)
        else:
            return {"message": "User not authorized to create projects."}, 403


class ProjectsByID(Resource):
    def get(self, project_id):
        project = Project.query.get(project_id)
        if project:
            return make_response(jsonify(project.to_dict()), 200)
        else:
            return make_response(jsonify({'error': 'Project not found'}), 404)

    def put(self, project_id):
        data = request.get_json()
        project = Project.query.get(project_id)
        if project:
            try:
                if 'project_name' in data:
                    project.project_name = data['project_name']
                if 'deadline' in data:
                    # Convert the deadline string to a Python date object
                    project.deadline = datetime.strptime(data['deadline'], '%Y-%m-%d').date()

                db.session.commit()
                return make_response(jsonify(project.to_dict()), 200)
            except Exception as e:
                return make_response(jsonify({'error': str(e)}), 500)
        else:
            return make_response(jsonify({'error': 'Project not found'}), 404)

    def delete(self, project_id):
        project = Project.query.get(project_id)
        if project:
            db.session.delete(project)
            db.session.commit()
            return make_response(jsonify({'message': 'Project deleted successfully'}), 200)
        else:
            return make_response(jsonify({'error': 'Project not found'}), 404)

class Tasks(Resource):
    def get(self):
        all_tasks = Task.query.all()
        tasks = [task.to_dict() for task in all_tasks]
        return make_response(jsonify(tasks), 200)

    @jwt_required()
    def post(self):
        data = request.get_json()
        try:
            project = Project.query.get(data['project_id'])
            assigned_member = User.query.get(data['assigned_member_id'])

            if not project:
                return {"error": "Project not found"}, 404
            if not assigned_member:
                return {"error": "Assigned member not found"}, 404

            deadline = None
            if data.get('deadline'):
                deadline = datetime.strptime(data['deadline'], '%Y-%m-%d').date()

            new_task = Task(
                task_name=data['task_name'],
                description=data.get('description', ''),
                status=data.get('status', 'pending'),
                deadline=deadline,
                project_id=project.id,
                assigned_member_id=assigned_member.id
            )

            db.session.add(new_task)
            db.session.commit()

            return make_response(jsonify(new_task.to_dict()), 201)
        except Exception as e:
            return make_response(jsonify({'error': str(e)}), 500)

class TasksByID(Resource):
    def get(self, task_id):
        task = Task.query.get(task_id)
        if task:
            return make_response(jsonify(task.to_dict()), 200)
        else:
            return make_response(jsonify({'error': 'Task not found'}), 404)

    def put(self, task_id):
        data = request.get_json()
        task = Task.query.get(task_id)
        if task:
            try:
                if 'task_name' in data:
                    task.task_name = data['task_name']
                if 'description' in data:
                    task.description = data['description']
                if 'status' in data:
                    task.status = data['status']
                if 'deadline' in data:
                    task.deadline = datetime.strptime(data['deadline'], '%Y-%m-%d').date()
                if 'project_id' in data:
                    project = Project.query.get(data['project_id'])
                    if project:
                        task.project_id = data['project_id']
                    else:
                        return {'error': 'Project not found'}, 404
                if 'assigned_member_id' in data:
                    assigned_member = User.query.get(data['assigned_member_id'])
                    if assigned_member:
                        task.assigned_member_id = data['assigned_member_id']
                    else:
                        return {'error': 'Assigned member not found'}, 404

                db.session.commit()
                return make_response(jsonify(task.to_dict()), 200)
            except Exception as e:
                return make_response(jsonify({'error': str(e)}), 500)
        else:
            return make_response(jsonify({'error': 'Task not found'}), 404)

    def delete(self, task_id):
        task = Task.query.get(task_id)
        if task:
            db.session.delete(task)
            db.session.commit()
            return make_response(jsonify({'message': 'Task deleted successfully'}), 200)
        else:
            return make_response(jsonify({'error': 'Task not found'}), 404)
        
class ChangePassword(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['user_id', 'currentPassword', 'newPassword']
        if not all(field in data for field in required_fields):
            return make_response(jsonify({'error': 'Missing required fields'}), 400)

        user_id = data['user_id']
        current_password = data['currentPassword']
        new_password = data['newPassword']
        
        # Fetch the user
        user = User.query.get(user_id)
        if not user:
            return make_response(jsonify({'error': 'User not found'}), 404)

        # Check current password
        if not user.authenticate(current_password):
            return make_response(jsonify({'error': 'Current password is incorrect'}), 400)

        # Validate new password
        if len(new_password) < 8:
            return make_response(jsonify({'error': 'New password must be at least 8 characters long'}), 400)

        # Update the password
        try:
            new_password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
            user._password_hash = new_password_hash
            db.session.commit()
            return make_response(jsonify({'message': 'Password updated successfully'}), 200)
        except Exception as e:
            return make_response(jsonify({'error': str(e)}), 500)
        

# Register the resources with the API
api.add_resource(Index, '/')
api.add_resource(Login, '/login')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Signup, '/signup')
api.add_resource(Logout, '/logout')
api.add_resource(Users, '/users')
api.add_resource(UsersByID, '/users/<int:user_id>')
api.add_resource(Projects, '/projects')
api.add_resource(ProjectsByID, '/projects/<int:project_id>')
api.add_resource(Tasks, '/tasks')
api.add_resource(TasksByID, '/tasks/<int:task_id>')
api.add_resource(ChangePassword, '/change_password')



if __name__ == '__main__':
    app.run(port=5555, debug=True)