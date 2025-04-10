import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import StudentDashboard from './components/StudentDashboard';
import StaffDashboard from './components/StaffDashboard';
import PlagiarismCheck from './components/PlagiarismCheck';
import StaffFileRequest from './components/StaffFileRequest';
import StudentFileSubmission from './components/StudentFileSubmission';
import StaffFeedback from './components/StaffFeedback';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import DocumentSend from './components/DocumentSend';
import FileUpload from './components/FileUpload';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import AssignTask from './components/AssignTask';
import Viewtask from './components/Viewtask';
function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/feedback" element={<FeedbackForm />} />
                <Route path="/feedback-list" element={<FeedbackList />} />
                <Route path="/files" element={<DocumentSend />} />
                <Route path="/upload" element={<FileUpload />} />
                <Route path="/login" element={<Login />} />
                <Route path="/student/dashboard" element={<Dashboard />} />
                <Route path="/staff/dashboard" element={<Dashboard />} />
                <Route path="/register" element={<Register />} />
                <Route path="/student-dashboard" element={<StudentDashboard />} />
                <Route path="/staff-dashboard" element={<StaffDashboard />} />
                <Route path="/plagiarism" element={<PlagiarismCheck />} />
                <Route path="/staff-file-request" element={<StaffFileRequest />} />
                <Route path="/student-file-submission" element={<StudentFileSubmission />} />
                <Route path="/staff-feedback" element={<StaffFeedback />} />
                <Route path="/assign-task" element={<AssignTask />} />
                <Route path="/view-task" element={<Viewtask/>} />
            </Routes>
        </Router>
    );
}

export default App;