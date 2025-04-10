import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const DocumentSend = () => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [score, setScore] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [fileStatus, setFileStatus] = useState('Pending');
  const [statusMessage, setStatusMessage] = useState('');

  // Load files from localStorage
  useEffect(() => {
    const files = JSON.parse(localStorage.getItem('documents')) || [];
    setUploadedFiles(files);
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file || !name || !rollNumber || !score || !department || !year || !subject) {
      alert('Please fill out all fields and upload a file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const fileData = reader.result;

      // Construct the status string with the reason if the file is rejected
      const status = fileStatus === 'Rejected' ? `Rejected: ${rejectionReason}` : 'Accepted';

      const newFile = {
        name,
        rollNumber,
        score,
        department,
        year,
        subject,
        fileName: file.name,
        fileData,
        status,
      };

      const updatedFiles = [...uploadedFiles, newFile];
      localStorage.setItem('documents', JSON.stringify(updatedFiles));
      setUploadedFiles(updatedFiles);
      setName('');
      setRollNumber('');
      setScore('');
      setDepartment('');
      setYear('');
      setSubject('');
      setFile(null);
      setUploadSuccess(true);
      setShowModal(false);
      setRejectionReason('');
      setFileStatus('Pending');
      setStatusMessage(fileStatus === 'Rejected' ? rejectionReason : 'File has been accepted.');
    };
    reader.readAsDataURL(file);
  };

  // Handle file download
  const handleDownload = (fileData, fileName) => {
    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName;
    link.click();
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setUploadSuccess(false);
    setRejectionReason('');
    setFileStatus('Pending');
    setStatusMessage('');
  };

  // Handle file accept or reject in modal
  const handleFileStatusChange = (status) => {
    setFileStatus(status);
  };

  // Get file icon based on file type
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'fas fa-file-pdf';
      case 'doc':
      case 'docx':
        return 'fas fa-file-word';
      case 'xls':
      case 'xlsx':
        return 'fas fa-file-excel';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'fas fa-file-image';
      default:
        return 'fas fa-file';
    }
  };

  // Get card color based on file type
  const getCardColor = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'bg-danger'; // Red for PDF
      case 'doc':
      case 'docx':
        return 'bg-primary'; // Blue for Word
      case 'xls':
      case 'xlsx':
        return 'bg-success'; // Green for Excel
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'bg-warning'; // Yellow for Images
      default:
        return 'bg-secondary'; // Gray for others
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-primary">
        <i className="fas fa-file-upload me-2"></i>Plagiarism Reports
      </h1>

      {/* Button to Open Modal */}
      <button
        className="btn btn-primary w-100 mb-4"
        onClick={() => setShowModal(true)}
      >
        <i className="fas fa-plus me-2"></i>Add Plagiarism Reports
      </button>

      {/* Uploaded Files Cards */}
      <h2 className="mt-5 text-secondary">
        <i className="fas fa-file-alt me-2"></i>Plagiarism Check Uploaded Documents
      </h2>
      <div className="row">
        {uploadedFiles.map((file, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className={`card shadow-sm text-white ${getCardColor(file.fileName)}`}>
              <div className="card-body">
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-light"
                    onClick={() => handleDownload(file.fileData, file.fileName)}
                    title="Download File"
                  >
                    <i className="fas fa-download"></i>
                  </button>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <i className={`${getFileIcon(file.fileName)} fa-3x me-3`}></i>
                  <h5 className="card-title mb-0">{file.name}</h5>
                </div>
                <p className="card-text">
                  <strong>Roll Number:</strong> {file.rollNumber}
                </p>
                <p className="card-text">
                  <strong>Score:</strong> {file.score}
                </p>
                <p className="card-text">
                  <strong>Department:</strong> {file.department}
                </p>
                <p className="card-text">
                  <strong>Year:</strong> {file.year}
                </p>
                <p className="card-text">
                  <strong>Subject:</strong> {file.subject}
                </p>
                <p className="card-text">
                  <strong>File:</strong> {file.fileName}
                </p>

                {/* Display status of the file */}
                <div className="mt-3">
                  <strong>Status:</strong> {file.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for File Upload Form */}
      {showModal && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div className="modal-content" style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh', // Set maximum height for modal
            overflowY: 'auto', // Enable scrolling if content exceeds height
          }}>
            <h3 className="text-primary mb-4">
              <i className="fas fa-file-upload me-2"></i>Upload Document
            </h3>

            {/* File Upload Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Roll Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Score</label>
                <input
                  type="number"
                  className="form-control"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  required
                />
              </div>

              {/* Department, Year, and Subject */}
              <div className="mb-3">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-control"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Year</label>
                <select
                  className="form-control"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-control"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              {/* File Selection */}
              <div className="mb-3">
                <label className="form-label">Choose a file</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                  required
                />
              </div>

              {/* Status (Accept/Reject) */}
              <div className="mb-3">
                <label className="form-label">File Status</label>
                <div>
                  <button
                    type="button"
                    className="btn btn-success me-2"
                    onClick={() => handleFileStatusChange('Accepted')}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleFileStatusChange('Rejected')}
                  >
                    Reject
                  </button>
                </div>
              </div>

              {fileStatus === 'Rejected' && (
                <div className="mb-3">
                  <label className="form-label">Rejection Reason</label>
                  <textarea
                    className="form-control"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={handleCloseModal}
                >
                  <i className="fas fa-times me-2"></i>Close
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-upload me-2"></i>Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {uploadSuccess && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div className="modal-content" style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxWidth: '500px',
            width: '100%',
          }}>
            <h3 className="text-success">
              <i className="fas fa-check-circle me-2"></i>Upload Successful!
            </h3>
            <p>{statusMessage}</p>
            <button
              className="btn btn-secondary"
              onClick={handleCloseModal}
            >
              <i className="fas fa-times me-2"></i>Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentSend;
