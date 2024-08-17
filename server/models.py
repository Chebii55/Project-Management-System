from config import db, bcrypt
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates, relationship
from sqlalchemy import Integer, String, Column, Date, ForeignKey

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    serialize_rules = ('-projects_owned', )  # Exclude projects_owned from serialization to avoid recursion

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

    # Define the relationship with Project and backref to User
    projects_owned = db.relationship('Project', backref='project_owner', lazy='dynamic')

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash.encode('utf-8'), password.encode('utf-8'))

    @validates('email')
    def validate_email(self, key, email):
        if '@' not in email:
            raise ValueError("Invalid email format")
        return email

    @validates('role')
    def validate_role(self, key, role):
        if role not in ['member', 'project_owner']:
            raise ValueError("Role must be either 'member', 'project_owner'")
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
            'projects_owned': [project.to_dict() for project in self.projects_owned]
        }

class Project(db.Model, SerializerMixin):
    __tablename__ = 'projects'
    serialize_rules = ('-project_owner',)  # Exclude project_owner from serialization to avoid recursion

    id = db.Column(db.Integer, primary_key=True)
    project_name = db.Column(db.String(100), nullable=False)
    deadline = db.Column(db.Date)  # Use Date for deadlines
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def __repr__(self):
        return f'<Project {self.project_name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'project_name': self.project_name,
            'deadline': self.deadline.isoformat() if self.deadline else None,
            'project_owner_id': self.owner_id
        }
