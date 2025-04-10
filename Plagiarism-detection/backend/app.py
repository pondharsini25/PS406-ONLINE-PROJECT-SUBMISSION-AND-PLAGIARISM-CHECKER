import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import PyPDF2
from docx import Document
import openpyxl
from werkzeug.utils import secure_filename
from g4f.client import Client

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configuration
app.config['UPLOAD_FOLDER'] = 'uploads'  # Folder for storing uploaded files
app.config['DOWNLOAD_FOLDER'] = 'downloads'  # Folder for storing downloadable files

# Ensure the upload folder and download folder exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['DOWNLOAD_FOLDER'], exist_ok=True)

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
        raise Exception(f"Error extracting text from PDF: {e}")
    return text

# Helper function to extract text from a DOC file
def extract_text_from_doc(file_path):
    text = ""
    try:
        doc = Document(file_path)
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
    except Exception as e:
        raise Exception(f"Error extracting text from DOC: {e}")
    return text

# Helper function to extract text from a TXT file
def extract_text_from_txt(file_path):
    text = ""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            text = file.read()
    except Exception as e:
        raise Exception(f"Error extracting text from TXT: {e}")
    return text

# Helper function to extract text from an XLSX file
def extract_text_from_xlsx(file_path):
    text = ""
    try:
        workbook = openpyxl.load_workbook(file_path)
        for sheet in workbook.worksheets:
            for row in sheet.iter_rows():
                for cell in row:
                    if cell.value:
                        text += str(cell.value) + "\n"
    except Exception as e:
        raise Exception(f"Error extracting text from XLSX: {e}")
    return text

# Helper function to extract text based on file type
def extract_text(file_path, file_type):
    if file_type == 'pdf':
        return extract_text_from_pdf(file_path)
    elif file_type == 'doc' or file_type == 'docx':
        return extract_text_from_doc(file_path)
    elif file_type == 'txt':
        return extract_text_from_txt(file_path)
    elif file_type == 'xlsx':
        return extract_text_from_xlsx(file_path)
    else:
        raise Exception("Unsupported file type")

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

# Route for plagiarism check and file download
@app.route('/plagiarism', methods=['POST'])
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

    # Determine file type
    file_type = filename.split('.')[-1].lower()

    # Extract text from the file
    try:
        text = extract_text(file_path, file_type)
    except Exception as e:
        return jsonify({"error": f"Error extracting text: {e}"}), 500

    # Perform plagiarism check
    try:
        plagiarism_result = check_plagiarism(text, custom_instructions)
    except Exception as e:
        return jsonify({"error": f"Error checking plagiarism: {e}"}), 500

    # Summarize the text (optional)
    summary = None
    if summarize:
        try:
            summary = summarize_text(text)
        except Exception as e:
            return jsonify({"error": f"Error summarizing text: {e}"}), 500

    # Save the result as a downloadable file
    result_filename = f"plagiarism_result_{filename.split('.')[0]}.txt"
    result_file_path = os.path.join(app.config['DOWNLOAD_FOLDER'], result_filename)
    with open(result_file_path, 'w', encoding='utf-8') as result_file:
        result_file.write(f"Plagiarism Check for: {filename}\n\n")
        result_file.write("Plagiarism Result:\n")
        result_file.write(plagiarism_result)
        if summarize:
            result_file.write("\n\nSummary of the Text:\n")
            result_file.write(summary)

    # Clean up the uploaded file
    os.remove(file_path)

    # Return the result and the download URL
    return jsonify({
        "plagiarism_result": plagiarism_result,
        "summary": summary,
        "download_url": f"/download/{result_filename}"  # Provide URL to download the result file
    })

# Route for file download
@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory(app.config['DOWNLOAD_FOLDER'], filename)

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
