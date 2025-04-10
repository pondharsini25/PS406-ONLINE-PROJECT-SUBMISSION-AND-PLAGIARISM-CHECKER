import React, { useState } from 'react';
import axios from 'axios';
import { FaDownload, FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaFilePdf, FaFileWord, FaFileAlt, FaSpinner } from 'react-icons/fa'; // Import FontAwesome icons

const PlagiarismCheck = () => {
  const [file, setFile] = useState(null);
  const [customInstructions, setCustomInstructions] = useState('');
  const [summarize, setSummarize] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper function to determine the file icon based on the file extension
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <FaFilePdf className="text-danger" />;
      case 'docx':
        return <FaFileWord className="text-primary" />;
      case 'txt':
        return <FaFileAlt className="text-secondary" />;
      default:
        return <FaFileAlt className="text-dark" />;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a file.');
      return;
    }

    setLoading(true); // Set loading to true while processing

    const formData = new FormData();
    formData.append('file', file);
    formData.append('custom_instructions', customInstructions);
    formData.append('summarize', summarize);

    try {
      console.log("Sending file to backend...");  // Log the file upload
      const response = await axios.post('http://localhost:5000/plagiarism', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Response from backend:", response.data);  // Log the response
      setResult(response.data);
      setError('');
    } catch (err) {
      console.error("Error occurred:", err);  // Log the error
      setError('An error occurred while processing the file.');
    } finally {
      setLoading(false); // Set loading to false after request is finished
    }
  };

  return (
    <div className="card p-4" style={{ maxWidth: '600px', margin: 'auto', marginTop: '50px' }}>
      <h2 className="text-center mb-4 text-primary"><FaInfoCircle /> Plagiarism Check</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Custom Instructions"
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={summarize}
            onChange={(e) => setSummarize(e.target.checked)}
          />
          <label className="form-check-label">Summarize Text</label>
        </div>
        <button type="submit" className="btn btn-success w-100">
          {loading ? (
            <>
              <FaSpinner className="spin" /> Checking Plagiarism...
            </>
          ) : (
            <>
              <FaCheckCircle /> Check Plagiarism
            </>
          )}
        </button>
      </form>

      {error && (
        <p className="text-danger mt-3">
          <FaExclamationCircle /> {error}
        </p>
      )}

      {file && (
        <div className="mt-3">
          <p>
            <strong>File:</strong> {getFileIcon(file.type.split('/')[1])} {file.name}
          </p>
        </div>
      )}

      {result && (
        <div className="mt-4">
          <h3 className="text-info">
            <FaInfoCircle /> Plagiarism Result:
          </h3>
          <pre>{result.plagiarism_result}</pre>

          {result.summary && (
            <div>
              <h3 className="text-info">
                <FaInfoCircle /> Summary:
              </h3>
              <pre>{result.summary}</pre>
            </div>
          )}

          {result.download_url && (
            <div className="mt-3">
              <h4>Download the Results:</h4>
              <a href={`http://localhost:5000${result.download_url}`} className="btn btn-primary" download>
                <FaDownload /> Download Results
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlagiarismCheck;
