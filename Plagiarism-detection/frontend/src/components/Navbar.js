import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaFileAlt } from 'react-icons/fa'; // Import FaFileAlt for the document icon

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid d-flex justify-content-center">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <FaFileAlt className="me-2" /> {/* Document icon */}
          <span>Plagiarism Checker</span> {/* Centered title */}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;