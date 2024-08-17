from faker import Faker
from config import db
from models import User, Project
import random

fake = Faker()

def reset_database():
    # Deleting all existing records
    db.session.query(Project).delete()
    db.session.query(User).delete()
    db.session.commit()

def seed_users(n):
    roles = ['member', 'project_owner']
    for _ in range(n):
        role = random.choice(roles)
        user = User(
            username=fake.user_name(),
            full_name=fake.name(),
            email=fake.email(),
            role=role,  # Assign role either 'member' or 'project_owner'
            gender=random.choice(['Male', 'Female', 'Other']),
            member_no=fake.unique.bothify(text='M######'),
            date_of_birth=fake.date_of_birth(minimum_age=18, maximum_age=80),
            member_status=random.choice(['active', 'inactive']),
            id_no=fake.unique.ssn(),
            address=fake.address()
        )
        # Use the setter method to hash the password
        user.password_hash = fake.password()
        db.session.add(user)
    db.session.commit()

def seed_projects(n):
    # Fetch only users with 'project_owner' role
    project_owners = User.query.filter_by(role='project_owner').all()
    for _ in range(n):
        if not project_owners:
            print("No project owners available to assign projects.")
            break
        
        project = Project(
            project_name=fake.bs(),
            deadline=fake.date_this_decade(before_today=True, after_today=False).isoformat(),
            owner_id=random.choice(project_owners).id  # Assign project to a 'project_owner'
        )
        db.session.add(project)
    db.session.commit()

if __name__ == '__main__':
    from config import app  # Import app to ensure the app context is available
    with app.app_context():
        reset_database()  # Reset the database by deleting all existing records
        db.create_all()   # Create tables if they do not exist
        seed_users(30)    # Number of users to generate
        seed_projects(5)  # Number of projects to generate
