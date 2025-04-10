import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:5001";

const Dashboard = () => {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem("token");
            const role = localStorage.getItem("role");

            if (!token || !role) {
                navigate("/login");
                return;
            }

            try {
                const res = await axios.get(`${API_URL}/${role}/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMessage(res.data.message);
            } catch (err) {
                console.error("Error fetching dashboard data", err);
                setMessage("Access denied. Please log in again.");
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/login");
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>
                    <i className="bi bi-person-circle"></i> Dashboard
                </h2>
                <p style={styles.message}>{message}</p>
                <button className="btn btn-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i> Logout
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f8f9fa",
    },
    card: {
        backgroundColor: "white",
        padding: "2rem",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        textAlign: "center",
        width: "100%",
        maxWidth: "400px",
    },
    title: {
        marginBottom: "1rem",
    },
    message: {
        fontSize: "1.2rem",
        fontWeight: "bold",
        marginBottom: "1.5rem",
    },
};

export default Dashboard;
