from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

# Initialize SQLAlchemy
db = SQLAlchemy()

# User model
class User(db.Model, UserMixin):
    """
    Represents a user in the system.
    - id: Unique identifier for the user.
    - username: Unique username for login.
    - password: Password for login.
    - role: Role of the user (student or staff).
    """
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # 'student' or 'staff'

    # Relationship to file requests (for staff)
    file_requests_created = db.relationship('FileRequest', foreign_keys='FileRequest.staff_id', backref='staff', lazy=True)

    # Relationship to file requests (for students)
    file_requests_received = db.relationship('FileRequest', foreign_keys='FileRequest.student_id', backref='student', lazy=True)

# File request model
class FileRequest(db.Model):
    """
    Represents a file request created by staff for a student.
    - id: Unique identifier for the request.
    - title: Title of the request.
    - staff_id: ID of the staff member who created the request.
    - student_id: ID of the student who received the request.
    - date_created: Timestamp when the request was created.
    """
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    staff_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship to file submissions
    submissions = db.relationship('FileSubmission', backref='request', lazy=True)

# File submission model
class FileSubmission(db.Model):
    """
    Represents a file submission by a student in response to a file request.
    - id: Unique identifier for the submission.
    - request_id: ID of the file request this submission belongs to.
    - file_path: Path to the uploaded file.
    - feedback: Feedback provided by the staff (optional).
    - date_submitted: Timestamp when the file was submitted.
    """
    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey('file_request.id'), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    feedback = db.Column(db.Text, nullable=True)
    date_submitted = db.Column(db.DateTime, default=datetime.utcnow)

# Function to initialize the database
def init_db(app):
    """
    Initializes the database with the Flask app.
    - Creates all tables if they don't already exist.
    """
    db.init_app(app)
    with app.app_context():
        db.create_all()