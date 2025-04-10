import React from 'react';
import { Link } from 'react-router-dom';
import { FaUpload, FaDownload, FaFileAlt, FaUser, FaChartLine, FaCog ,FaFilePdf} from 'react-icons/fa'; // Importing icons from react-icons

const Home = () => {
  // Dashboard card data
  const dashboardCards = [
    {
      title: 'Upload Plagiarism Documents',
      description: 'Upload and manage documents for evaluation or feedback.',
      icon: <FaUpload size={40} />,
      color: 'bg-primary',
      link: '/files',
    },
    {
      title: 'View Plagiarism Checking Files',
      description: 'Access and review all uploaded files and feedback.',
      icon: <FaDownload size={40} />,
      color: 'bg-success',
      link: '/feedback-list',
    },
    {
      title: 'Plagiarism Check',
      description: 'Check documents for plagiarism and generate reports.',
      icon: <FaFileAlt size={40} />,
      color: 'bg-danger',
      link: '/plagiarism',
    },
     {
          title: 'Assign Task',
          description: 'Upload and manage PDF documents.',
          icon: <FaFilePdf size={40} />,
          color: 'bg-danger',
          link: '/view-task',
        },
  ];

  return (
    <div className="container mt-5">
      {/* Dashboard Title */}
      <h2 className="text-center mb-4">
        <i className="fas fa-tachometer-alt me-2"></i>Staff Dashboard
      </h2>

      {/* Dashboard Cards */}
      <div className="row">
        {dashboardCards.map((card, index) => (
          <div key={index} className="col-md-4 mb-4">
            <Link to={card.link} className="text-decoration-none">
              <div className={`card text-white ${card.color} h-100`}>
                <div className="card-body text-center">
                  <div className="mb-3">{card.icon}</div>
                  <h5 className="card-title">{card.title}</h5>
                  <p className="card-text">{card.description}</p>
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