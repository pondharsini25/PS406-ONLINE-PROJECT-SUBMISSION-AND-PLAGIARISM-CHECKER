import React, { useState } from "react";
import axios from "axios";
import { Button, Form, Alert, Card } from "react-bootstrap";
import { Person, Lock, PersonFillGear, PersonCheck } from 'react-bootstrap-icons'; // Importing specific icons
import { Link } from 'react-router-dom'; // Import Link for navigation

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Reset error
    setSuccessMessage(""); // Reset success message

    try {
      const response = await axios.post("http://localhost:5001/register", {
        username,
        password,
        role,
      });
      setSuccessMessage(response.data.message); // Show success message
      setUsername(""); // Clear fields after success
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed"); // Handle error
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh", backgroundColor: '#f8f9fa' }}>
      <Card style={{ width: "100%", maxWidth: "400px", border: 'none', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <Card.Body className="p-4">
          <h2 className="text-center mb-4" style={{ color: '#007bff' }}>
            <PersonCheck className="me-2" />
            Register
          </h2>
          
          {/* Show success message */}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          {/* Show error message */}
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Label>
                <Person style={{ color: '#007bff' }} /> Username
              </Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <Lock style={{ color: '#007bff' }} /> Password
              </Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <PersonFillGear style={{ color: '#007bff' }} /> Role
              </Form.Label>
              <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="staff">Staff</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100 mb-3" style={{ backgroundColor: '#007bff', border: 'none' }}>
              Register
            </Button>

            <div className="text-center">
              <p className="mb-0">Already have an account?</p>
              <Link to="/login" className="btn btn-link" style={{ color: '#007bff' }}>
                <PersonCheck className="me-2" />
                Login Here
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;