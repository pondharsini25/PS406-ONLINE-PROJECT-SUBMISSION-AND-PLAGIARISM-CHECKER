import React from 'react';
import { Link } from 'react-router-dom';
import { FaUpload, FaDownload, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFile } from 'react-icons/fa'; // Importing icons from react-icons

const Home = () => {
  // Sample data for cards
  const features = [
    {
      title: 'Upload Plagiarism Checking Documents',
      description: 'Easily upload your documents for Plagiarism Report file or evaluation.',
      icon: <FaUpload size={40} />,
      color: 'bg-primary',
      link: '/feedback',
    },
    {
      title: 'View Results',
      description: 'Access your uploaded files and PlagiarismChecking results.',
      icon: <FaDownload size={40} />,
      color: 'bg-success',
      link: '/files',
    },
    {
      title: 'View Task',
      description: 'Upload and manage PDF documents.',
      icon: <FaFilePdf size={40} />,
      color: 'bg-danger',
      link: '/assign-task',
    },
    {
      title: 'Word Files',
      description: 'Upload and manage Word documents.',
      icon: <FaFileWord size={40} />,
      color: 'bg-info',
      link: '/feedback',
    },
    {
      title: 'Excel Files',
      description: 'Upload and manage Excel spreadsheets.',
      icon: <FaFileExcel size={40} />,
      color: 'bg-warning',
      link: '/feedback',
    },
    {
      title: 'Image Files',
      description: 'Upload and manage image files.',
      icon: <FaFileImage size={40} />,
      color: 'bg-secondary',
      link: '/feedback',
    },
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Welcome to the Plagiarism Checker</h2>

      {/* Feature Cards */}
      <div className="row">
        {features.map((feature, index) => (
          <div key={index} className="col-md-4 mb-4">
            <Link to={feature.link} className="text-decoration-none">
              <div className={`card text-white ${feature.color}`}>
                <div className="card-body text-center">
                  <div className="mb-3">{feature.icon}</div>
                  <h5 className="card-title">{feature.title}</h5>
                  <p className="card-text">{feature.description}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;