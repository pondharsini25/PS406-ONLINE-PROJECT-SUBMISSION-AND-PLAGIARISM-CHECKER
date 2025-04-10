import React, { useState } from 'react';
import axios from 'axios';
import { FaComments } from 'react-icons/fa';

const StaffFeedback = () => {
  const [submissionId, setSubmissionId] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submissionId || !feedback) {
      setError('Please fill all fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/file-feedback', {
        submission_id: submissionId,
        feedback,
      });
      setSuccess('Feedback added successfully');
      setError('');
      setSubmissionId('');
      setFeedback('');
    } catch (err) {
      setError('Failed to add feedback');
    }
  };

  return (
    <div className="card p-4" style={{ maxWidth: '600px', margin: 'auto', marginTop: '50px' }}>
      <h2 className="text-center mb-4">
        <FaComments /> Provide Feedback
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="submissionId" className="form-label">
            Submission ID
          </label>
          <input
            type="text"
            className="form-control"
            id="submissionId"
            placeholder="Enter submission ID"
            value={submissionId}
            onChange={(e) => setSubmissionId(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="feedback" className="form-label">
            Feedback
          </label>
          <textarea
            className="form-control"
            id="feedback"
            placeholder="Enter feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Submit Feedback
        </button>
        {error && <p className="text-danger mt-3">{error}</p>}
        {success && <p className="text-success mt-3">{success}</p>}
      </form>
    </div>
  );
};

export default StaffFeedback;