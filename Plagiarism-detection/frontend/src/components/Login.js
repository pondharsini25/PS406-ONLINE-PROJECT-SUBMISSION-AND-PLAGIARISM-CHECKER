import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { FaUser, FaLock, FaUserPlus } from 'react-icons/fa'; // Import icons

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Replaces useHistory()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Login Response:", data); // Debugging

      if (response.status === 200) {
        if (!data.user) {
          throw new Error("Invalid response from server");
        }

        localStorage.setItem('user', JSON.stringify(data.user));

        if (data.user.role === 'staff') {
          navigate('/staff-dashboard');
        } else if (data.user.role === 'student') {
          navigate('/student-dashboard');
        } else {
          throw new Error("Unknown role");
        }
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="card shadow" style={{ width: '100%', maxWidth: '400px', border: 'none', borderRadius: '10px' }}>
        <div className="card-body p-4">
          <h2 className="card-title text-center mb-4" style={{ color: '#007bff' }}>Login</h2>
          {error && <p className="text-danger text-center">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text" style={{ backgroundColor: '#007bff', border: 'none', color: '#fff' }}>
                  <FaUser />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text" style={{ backgroundColor: '#007bff', border: 'none', color: '#fff' }}>
                  <FaLock />
                </span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 mb-3" style={{ backgroundColor: '#007bff', border: 'none' }}>
              Login
            </button>

            <div className="text-center">
              <p className="mb-0">Don't have an account?</p>
              <Link to="/register" className="btn btn-link" style={{ color: '#007bff' }}>
                <FaUserPlus className="me-2" />
                Register Here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;