from faker import Faker
from config import db
from models import User, Project, Task
import random

fake = Faker()

def reset_database():
    # Deleting all existing records in reverse order to maintain foreign key integrity
    db.session.query(Task).delete()
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
            role=role,
            gender=random.choice(['Male', 'Female', 'Other']),
            member_no=fake.unique.bothify(text='M######'),
            date_of_birth=fake.date_of_birth(minimum_age=18, maximum_age=80),
            member_status=random.choice(['active', 'inactive']),
            id_no=fake.unique.ssn(),
            address=fake.address()
        )
        # Use the setter method to hash the password
        user.password_hash = '12345678'
        db.session.add(user)
    db.session.commit()

def seed_projects(n):
    project_owners = User.query.filter_by(role='project_owner').all()
    if not project_owners:
        print("No project owners available to assign projects.")
        return

    for _ in range(n):
        project_owner = random.choice(project_owners)
        project = Project(
            project_name=fake.catch_phrase(),
            deadline=fake.date_this_decade(before_today=False, after_today=True),  # Set future deadlines
            details=fake.text(),
            owner_id=project_owner.id
        )
        db.session.add(project)
        
        # Seed tasks for the project
        num_tasks = random.randint(1, 5)
        for _ in range(num_tasks):
            available_members = User.query.filter(User.role == 'member').all()
            if not available_members:
                print("No available members to assign tasks.")
                break
            
            assigned_member = random.choice(available_members)
            task = Task(
                task_name=fake.catch_phrase(),  # Ensure task_name is non-null
                description=fake.sentence(),
                project_id=project.id,
                assigned_member_id=assigned_member.id,
                status=random.choice(['pending', 'in-progress', 'completed']),
                deadline=fake.date_between(start_date="today", end_date="+30d")
            )
            db.session.add(task)
    db.session.commit()

if __name__ == '__main__':
    from config import app  # Import app to ensure the app context is available
    with app.app_context():
        reset_database()  # Reset the database by deleting all existing records
        db.create_all()   # Create tables if they do not exist
        seed_users(30)    # Number of users to generate
        seed_projects(10)  # Number of projects to generate
