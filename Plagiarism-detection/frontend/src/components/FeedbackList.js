import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap for styling
import { FaDownload, FaTrash, FaUser, FaFileAlt, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage } from 'react-icons/fa'; // Importing icons from react-icons

const FeedbackList = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch('http://localhost:5001/get-feedback');
      if (!response.ok) throw new Error('Failed to fetch feedback');

      const data = await response.json();
      setFeedback(data);
    } catch (err) {
      setError('Error fetching feedback. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (filename) => {
    const downloadLink = document.createElement('a');
    downloadLink.href = `http://localhost:5001/download/${filename}`; // Corrected URL
    downloadLink.download = filename; // Ensure the file is downloaded with its original name
    downloadLink.click();
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this feedback?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5001/delete-feedback/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFeedback(feedback.filter(item => item.id !== id));
        setSuccessMessage('Feedback deleted successfully.');
      } else {
        throw new Error('Failed to delete feedback');
      }
    } catch (err) {
      setError('Error deleting feedback. Please try again.');
    }
  };

  // Get icon based on file type
  const getFileIcon = (filename) => {
    if (!filename) return FaFileAlt; // Default icon if no file
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return FaFilePdf;
      case 'doc':
      case 'docx':
        return FaFileWord;
      case 'xls':
      case 'xlsx':
        return FaFileExcel;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return FaFileImage;
      default:
        return FaFileAlt;
    }
  };

  // Get card color based on file type
  const getCardColor = (filename) => {
    if (!filename) return 'bg-secondary'; // Default color if no file
    const extension = filename.split('.').pop().toLowerCase();
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
      <h2 className="text-center mb-4">
        <FaFileAlt className="me-2" />Plagiarism Checking File List
      </h2>

      {/* Show success or error messages */}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Show loading message while fetching data */}
      {loading ? (
        <div className="text-center">
          <p>Loading feedback...</p>
        </div>
      ) : (
        <div className="row">
          {feedback.length > 0 ? (
            feedback.map((item) => {
              const FileIcon = getFileIcon(item.file_path); // Get icon based on file type
              const cardColor = getCardColor(item.file_path); // Get color based on file type

              return (
                <div key={item.id} className="col-md-4 mb-4">
                  <div className={`card text-white ${cardColor}`}>
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <FaUser className="me-2" size={24} />
                        <h5 className="card-title mb-0">
                          {item.name} ({item.roll_number})
                        </h5>
                      </div>
                      <p className="card-text">
                        <strong>Staff:</strong> {item.staff_name}
                      </p>
                      {item.file_path && (
                        <div className="d-flex justify-content-between align-items-center">
                          <button
                            className="btn btn-light"
                            onClick={() => handleDownload(item.file_path)}
                          >
                            <FileIcon className="me-2" />
                            Download
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="btn btn-danger"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center">No feedback available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;