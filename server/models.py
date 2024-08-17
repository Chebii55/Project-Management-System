from config import db, bcrypt
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates, relationship
from sqlalchemy import Integer, String, Column, Date, ForeignKey
from datetime import datetime

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    serialize_rules = ('-projects_owned', '-tasks_assigned')  # Exclude to avoid recursion

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    _password_hash = db.Column(db.String)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(20), default='member')
    gender = db.Column(db.String(10), nullable=False)
    member_no = db.Column(db.String(50), unique=True, nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    member_status = db.Column(db.String(20), nullable=False)
    id_no = db.Column(db.String(20), unique=True, nullable=False)
    address = db.Column(db.String(200), nullable=True)

    # Relationships
    projects_owned = db.relationship('Project', back_populates='owner', lazy='dynamic')
    tasks_assigned = db.relationship('Task', back_populates='assigned_member', lazy='dynamic')

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash.encode('utf-8'), password.encode('utf-8'))

    @validates('email')
    def validate_email(self, key, email):
        if '@' not in email:
            raise ValueError("Invalid email format")
        return email

    @validates('role')
    def validate_role(self, key, role):
        if role not in ['member', 'project_owner']:
            raise ValueError("Role must be either 'member' or 'project_owner'")
        return role

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'full_name': self.full_name,
            'email': self.email,
            'role': self.role,
            'gender': self.gender,
            'member_no': self.member_no,
            'date_of_birth': self.date_of_birth.isoformat(),
            'member_status': self.member_status,
            'id_no': self.id_no,
            'address': self.address,
            'projects_owned': [project.to_dict() for project in self.projects_owned],
            'tasks_assigned': [task.to_dict() for task in self.tasks_assigned]
        }

class Project(db.Model, SerializerMixin):
    __tablename__ = 'projects'
    serialize_rules = ('-owner', '-tasks')  # Exclude to avoid recursion

    id = db.Column(db.Integer, primary_key=True)
    project_name = db.Column(db.String(255), nullable=False)
    details = db.Column(db.String(255))
    deadline = db.Column(db.Date)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Relationships
    owner = db.relationship('User', back_populates='projects_owned')
    tasks = db.relationship('Task', back_populates='project', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'project_name': self.project_name,
            'deadline': self.deadline.strftime('%Y-%m-%d') if self.deadline else None,
            'owner_id': self.owner_id,
            'tasks': [task.to_dict() for task in self.tasks]
        }

class Task(db.Model, SerializerMixin):
    __tablename__ = 'tasks'
    serialize_rules = ('-project', '-assigned_member')  # Exclude to avoid recursion

    id = db.Column(db.Integer, primary_key=True)
    task_name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255))
    status = db.Column(db.String(50), default='pending')
    deadline = db.Column(db.Date)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    assigned_member_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Relationships
    project = db.relationship('Project', back_populates='tasks')
    assigned_member = db.relationship('User', back_populates='tasks_assigned')

    def to_dict(self):
        return {
            'id': self.id,
            'task_name': self.task_name,
            'description': self.description,
            'status': self.status,
            'deadline': self.deadline.strftime('%Y-%m-%d') if self.deadline else None,
            'project_id': self.project_id,
            'assigned_member_id': self.assigned_member_id,
        }
