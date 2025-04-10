from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
import logging
from dotenv import load_dotenv
from functools import wraps
from datetime import datetime

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Set the file upload folder and allowed extensions
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'pdf', 'docx', 'txt', 'png', 'jpg'}

# Ensure that the upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'student' or 'staff'

class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(120), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('files', lazy=True))
# 📌 Create a Card Table Model
class Card(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)  # Student name
    roll_number = db.Column(db.String(50), nullable=False)
    staff_name = db.Column(db.String(100), nullable=False)
    file_path = db.Column(db.String(200), nullable=True)  # Stores file location
# Role-based access decorator
def role_required(role):
    """ Decorator to ensure the user has the required role """
    def wrapper(func):
        @wraps(func)
        def decorated_function(*args, **kwargs):
            # Retrieve the user id from the session or token
            user_id = request.headers.get('User-ID')  # For example, you might pass the user ID via headers or a token
            if not user_id:
                return jsonify({"error": "User not authenticated"}), 401

            user = User.query.get(user_id)
            if not user:
                return jsonify({"error": "User not found"}), 404

            if user.role != role:
                return jsonify({"error": f"Access restricted to {role}s only"}), 403

            return func(*args, **kwargs)
        return decorated_function
    return wrapper

# Routes for authentication
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')  # 'student' or 'staff'

    if not username or not password or not role:
        return jsonify({"error": "Username, password, and role are required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, password=hashed_password, role=role)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid username or password"}), 401

    # Return user details including ID, username, and role
    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "username": user.username,
            "role": user.role
        }
    }), 200

# File upload route
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        # Retrieve user information (you can get user from headers, tokens, etc.)
        user_id = request.headers.get('User-ID')  # Assume this comes from the client side as part of the request headers
        if not user_id:
            return jsonify({"error": "User-ID header is missing"}), 401
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Secure the filename and save the file
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Store file information in the database
        new_file = File(filename=filename, user_id=user.id)
        db.session.add(new_file)
        db.session.commit()

        return jsonify({"message": "File uploaded successfully", "file": filename}), 200

    return jsonify({"error": "Invalid file type"}), 400

# Helper function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']



# 📌 API Route to Submit Feedback and Upload Files
@app.route('/submit-feedback', methods=['POST'])
def submit_feedback():
    name = request.form.get('name')
    roll_number = request.form.get('roll_number')
    staff_name = request.form.get('staff_name')
    file = request.files.get('file')

    if not (name and roll_number and staff_name):
        return jsonify({'message': 'Missing required fields'}), 400

    file_path = None
    if file:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)

    # Save feedback into the Card Table
    card = Card(name=name, roll_number=roll_number, staff_name=staff_name, file_path=file_path)
    db.session.add(card)
    db.session.commit()

    return jsonify({'message': 'Feedback submitted successfully', 'file_path': file_path}), 201

# 📌 API Route to Get All Submitted Feedback
@app.route('/get-feedback', methods=['GET'])
def get_feedback():
    feedback_list = Card.query.all()
    feedback_data = [
        {
            "id": feedback.id,
            "name": feedback.name,
            "roll_number": feedback.roll_number,
            "staff_name": feedback.staff_name,
            "file_path": feedback.file_path
        }
        for feedback in feedback_list
    ]
    return jsonify(feedback_data), 200

# 📌 API Route to Delete Feedback
@app.route('/delete-feedback/<int:feedback_id>', methods=['DELETE'])
def delete_feedback(feedback_id):
    feedback = Card.query.get(feedback_id)
    if not feedback:
        return jsonify({'message': 'Feedback not found'}), 404

    # Delete the associated file if it exists
    if feedback.file_path and os.path.exists(feedback.file_path):
        os.remove(feedback.file_path)

    db.session.delete(feedback)
    db.session.commit()
    return jsonify({'message': 'Feedback deleted successfully'}), 200


# Route to download a file
@app.route('/download/uploads/<filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Run the Flask app
if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create database tables
    app.run(debug=True, port=5001)  # Run on port 5001
