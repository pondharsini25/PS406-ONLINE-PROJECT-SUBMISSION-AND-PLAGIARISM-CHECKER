import React, { useState } from 'react';
import axios from 'axios';

const StaffFileRequest = () => {
  const [title, setTitle] = useState('');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/file-request', {
        title,
        student_id: studentId,
      });
      setSuccess('File request created successfully');
      setError('');
      setTitle('');
      setStudentId('');
    } catch (err) {
      setError('Failed to create file request');
    }
  };

  return (
    <div className="card p-4" style={{ maxWidth: '600px', margin: 'auto', marginTop: '50px' }}>
      <h2 className="text-center mb-4">Create File Request</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Create Request</button>
      </form>
      {error && <p className="text-danger mt-3">{error}</p>}
      {success && <p className="text-success mt-3">{success}</p>}
    </div>
  );
};

export default StaffFileRequest;