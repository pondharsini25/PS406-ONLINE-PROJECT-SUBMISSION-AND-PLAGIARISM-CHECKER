import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap for styling

const FeedbackForm = () => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [staffName, setStaffName] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedbackList, setFeedbackList] = useState([]); // Store submitted feedback
  const [showModal, setShowModal] = useState(false); // Control modal visibility

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('roll_number', rollNumber);
    formData.append('staff_name', staffName);
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await fetch('http://localhost:5001/submit-feedback', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message); // Show success message
        // Add the new feedback to the list
        setFeedbackList([...feedbackList, { name, rollNumber, staffName, file: file ? file.name : null }]);
        // Reset form fields
        setName('');
        setRollNumber('');
        setStaffName('');
        setFile(null);
        setShowModal(false); // Close the modal after submission
      } else {
        setError(data.error || 'Something went wrong. Please try again.'); // Show error message
      }
    } catch (error) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Get icon based on file type
  const getFileIcon = (fileName) => {
    if (!fileName) return 'fas fa-file'; // Default icon if no file
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
    if (!fileName) return 'bg-secondary'; // Default color if no file
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
      <h2 className="text-center mb-4">Plagiarism Paper Upload</h2>

      {/* Button to Open Modal */}
      <div className="d-flex justify-content-center">
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <i className="fas fa-plus me-2"></i>Add Plagiarism Paper
        </button>
      </div>

      {/* Show message or error */}
      {message && <p className="alert alert-success mt-4">{message}</p>}
      {error && <p className="alert alert-danger mt-4">{error}</p>}

      {/* Display Submitted Feedback in Cards */}
      <h3 className="mt-5 text-center">Submitted Plagiarism Paper</h3>
      <div className="row mt-4">
        {feedbackList.map((feedback, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className={`card text-white ${getCardColor(feedback.file)}`}>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <i className={`${getFileIcon(feedback.file)} fa-3x me-3`}></i>
                  <h5 className="card-title mb-0">{feedback.name}</h5>
                </div>
                <p className="card-text">
                  <strong>Roll Number:</strong> {feedback.rollNumber}
                </p>
                <p className="card-text">
                  <strong>Staff Name:</strong> {feedback.staffName}
                </p>
                {feedback.file && (
                  <p className="card-text">
                    <strong>File:</strong> {feedback.file}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Feedback Form */}
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
          }}>
            <h3 className="text-primary mb-4">
              <i className="fas fa-file-upload me-2"></i>Submit Plagiarism Paper
            </h3>

            {/* Feedback Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Roll Number"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Staff Name"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={() => setShowModal(false)}
                >
                  <i className="fas fa-times me-2"></i>Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit '}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;