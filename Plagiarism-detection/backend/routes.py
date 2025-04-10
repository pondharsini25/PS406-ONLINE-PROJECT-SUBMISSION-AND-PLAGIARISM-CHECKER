from flask import request, jsonify, send_file
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import PyPDF2
from g4f.client import Client
from models import db, User, FileRequest, FileSubmission

# Route for user registration
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if not username or not password or not role:
        return jsonify({"error": "Username, password, and role are required"}), 400

    # Check if the username already exists
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    # Create a new user
    user = User(username=username, password=password, role=role)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

# Route for user login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and user.password == password:
        return jsonify({"message": "Logged in successfully", "role": user.role}), 200
    return jsonify({"error": "Invalid credentials"}), 401

# Route for creating a file request (staff only)
@app.route('/file-request', methods=['POST'])
@login_required
def create_file_request():
    if current_user.role != 'staff':
        return jsonify({"error": "Only staff can create file requests"}), 403

    data = request.get_json()
    title = data.get('title')
    student_id = data.get('student_id')

    if not title or not student_id:
        return jsonify({"error": "Title and student ID are required"}), 400

    # Check if the student exists
    student = User.query.get(student_id)
    if not student or student.role != 'student':
        return jsonify({"error": "Invalid student ID"}), 400

    # Create a new file request
    file_request = FileRequest(title=title, staff_id=current_user.id, student_id=student_id)
    db.session.add(file_request)
    db.session.commit()

    return jsonify({"message": "File request created successfully", "request_id": file_request.id}), 201

# Route for submitting a file (student only)
@app.route('/file-submit', methods=['POST'])
@login_required
def submit_file():
    if current_user.role != 'student':
        return jsonify({"error": "Only students can submit files"}), 403

    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    request_id = request.form.get('request_id')

    if not request_id:
        return jsonify({"error": "Request ID is required"}), 400

    # Check if the file request exists
    file_request = FileRequest.query.get(request_id)
    if not file_request or file_request.student_id != current_user.id:
        return jsonify({"error": "Invalid request ID"}), 400

    # Save the file
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    # Create a new file submission
    submission = FileSubmission(request_id=request_id, file_path=file_path)
    db.session.add(submission)
    db.session.commit()

    return jsonify({"message": "File submitted successfully", "submission_id": submission.id}), 201

# Route for downloading a file (staff only)
@app.route('/file-download/<int:submission_id>', methods=['GET'])
@login_required
def download_file(submission_id):
    submission = FileSubmission.query.get_or_404(submission_id)

    # Check if the current user is the staff who created the request
    if submission.request.staff_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    return send_file(submission.file_path, as_attachment=True)

# Route for adding feedback to a submission (staff only)
@app.route('/file-feedback', methods=['POST'])
@login_required
def add_feedback():
    if current_user.role != 'staff':
        return jsonify({"error": "Only staff can add feedback"}), 403

    data = request.get_json()
    submission_id = data.get('submission_id')
    feedback = data.get('feedback')

    if not submission_id or not feedback:
        return jsonify({"error": "Submission ID and feedback are required"}), 400

    # Check if the submission exists
    submission = FileSubmission.query.get(submission_id)
    if not submission or submission.request.staff_id != current_user.id:
        return jsonify({"error": "Invalid submission ID"}), 400

    # Add feedback to the submission
    submission.feedback = feedback
    db.session.commit()

    return jsonify({"message": "Feedback added successfully"}), 200

# Route for plagiarism check
@app.route('/plagiarism', methods=['POST'])
@login_required
def plagiarism_check():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    custom_instructions = request.form.get('custom_instructions', '')
    summarize = request.form.get('summarize', 'false').lower() == 'true'

    # Save the uploaded file temporarily
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    # Extract text from the PDF
    try:
        text = extract_text_from_pdf(file_path)
    except Exception as e:
        return jsonify({"error": f"Error extracting text: {e}"}), 500

    # Perform plagiarism check
    plagiarism_result = check_plagiarism(text, custom_instructions)

    # Summarize the text (optional)
    summary = summarize_text(text) if summarize else None

    # Clean up the uploaded file
    os.remove(file_path)

    return jsonify({
        "plagiarism_result": plagiarism_result,
        "summary": summary
    }), 200

# Helper function to extract text from a PDF
def extract_text_from_pdf(file_path):
    text = ""
    try:
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        raise Exception(f"Error extracting text: {e}")
    return text

# Helper function to check for plagiarism
def check_plagiarism(text, custom_instructions=""):
    client = Client()
    system_message = (
        "You are a plagiarism detection assistant. Analyze the provided text from an academic document "
        "and check for potential plagiarism. Provide a plagiarism score between 0 and 100. Identify sections "
        "that seem to be copied or lack originality, and then offer suggestions for improvement, including "
        "examples on how the text could be rephrased for better originality. "
    )
    if custom_instructions:
        system_message += custom_instructions

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": f"Please analyze the following text for plagiarism:\n\n{text}"}
        ],
        web_search=True
    )
    return response.choices[0].message.content

# Helper function to summarize text
def summarize_text(text):
    client = Client()
    system_message = (
        "You are a helpful assistant that summarizes academic text concisely. "
        "Provide a clear and brief summary of the text."
    )
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": f"Summarize the following text:\n\n{text}"}
        ],
        web_search=True
    )
    return response.choices[0].message.content