import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentFileSubmission = () => {
  const [file, setFile] = useState(null);
  const [requestId, setRequestId] = useState('');
  const [fileRequests, setFileRequests] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch file requests for the logged-in student
  useEffect(() => {
    const fetchFileRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/student-file-requests');
        setFileRequests(response.data);
      } catch (err) {
        setError('Failed to fetch file requests');
      }
    };
    fetchFileRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !requestId) {
      setError('Please fill all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('request_id', requestId);

    try {
      const response = await axios.post('http://localhost:5000/file-submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('File submitted successfully');
      setError('');
      setFile(null);
      setRequestId('');
    } catch (err) {
      setError('Failed to submit file');
    }
  };

  return (
    <div className="card p-4" style={{ maxWidth: '600px', margin: 'auto', marginTop: '50px' }}>
      <h2 className="text-center mb-4">Submit File</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <select
            className="form-select"
            value={requestId}
            onChange={(e) => setRequestId(e.target.value)}
          >
            <option value="">Select a file request</option>
            {fileRequests.map((req) => (
              <option key={req.id} value={req.id}>
                {req.title} ({req.status})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Submit File</button>
      </form>
      {error && <p className="text-danger mt-3">{error}</p>}
      {success && <p className="text-success mt-3">{success}</p>}
    </div>
  );
};

export default StudentFileSubmission;