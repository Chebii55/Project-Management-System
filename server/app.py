from flask import make_response, jsonify, request, session
from flask_restful import Api, Resource
from flask_cors import CORS
from config import db, app, bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import Project
from models import User
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


if __name__ == '__main__':
    app.run(port=5555, debug=True)