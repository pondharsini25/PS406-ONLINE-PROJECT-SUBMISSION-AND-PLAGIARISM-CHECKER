import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [actionStatus, setActionStatus] = useState({}); // To keep track of each file's action status and reason
  const [reason, setReason] = useState(''); // Reason for rejection

  // Fetch uploaded files from the backend
  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5001/files');
      setFiles(response.data.files);
    } catch (error) {
      console.error('Error fetching files', error);
    }
  };

  // Handle file download
  const handleDownload = (filename) => {
    const downloadLink = document.createElement('a');
    downloadLink.href = `http://localhost:5001/download/${filename}`;
    downloadLink.download = filename;
    downloadLink.click();
  };

  // Handle accepting or rejecting a file
  const handleAction = (fileId, status) => {
    const updatedStatus = { ...actionStatus, [fileId]: { status, reason } };
    setActionStatus(updatedStatus);
    localStorage.setItem('fileActions', JSON.stringify(updatedStatus)); // Save to localStorage
  };

  useEffect(() => {
    // Fetch previously saved actions from localStorage
    const savedActions = JSON.parse(localStorage.getItem('fileActions')) || {};
    setActionStatus(savedActions);
    fetchFiles();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Uploaded Files</h1>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll Number</th>
            <th>Score</th>
            <th>File</th>
            <th>Action</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {files.length > 0 ? (
            files.map((file) => (
              <tr key={file.id}>
                <td>{file.name}</td>
                <td>{file.roll_number}</td>
                <td>{file.score}</td>
                <td>{file.filename}</td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => handleDownload(file.filename)}
                  >
                    Download
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAction(file.id, 'Accepted')}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-danger ms-2"
                    onClick={() => handleAction(file.id, 'Rejected')}
                  >
                    Reject
                  </button>
                </td>
                <td>
                  {actionStatus[file.id]?.status === 'Rejected' && (
                    <div>
                      <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter reason"
                        className="form-control"
                      />
                      <button
                        className="btn btn-warning mt-2"
                        onClick={() => handleAction(file.id, 'Rejected', reason)}
                      >
                        Submit Reason
                      </button>
                    </div>
                  )}
                  {actionStatus[file.id]?.status === 'Accepted' && (
                    <span>Accepted</span>
                  )}
                  {actionStatus[file.id]?.status === 'Rejected' && !reason && (
                    <span className="text-danger">Reason pending</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No files uploaded yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FileUpload;
