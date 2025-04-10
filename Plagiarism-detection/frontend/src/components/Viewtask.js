import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '@fortawesome/fontawesome-free/css/all.min.css'; // FontAwesome icons
import 'bootstrap/dist/css/bootstrap.min.css';

const AssignTask = () => {
  const [staffName, setStaffName] = useState('');
  const [department, setDepartment] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [year, setYear] = useState(1); // Default year is 1
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editTaskIndex, setEditTaskIndex] = useState(null);
  
  // Filter states
  const [filterYear, setFilterYear] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterText, setFilterText] = useState('');

  // Load tasks from local storage when the component mounts
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, []);

  // Save tasks to local storage
  const saveToLocalStorage = (newTasks) => {
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  // Handle the form submission to add or edit a task
  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = {
      staffName,
      department,
      taskTitle,
      deadline,
      year,
      subject,
      description,
    };

    let updatedTasks;
    if (editTaskIndex !== null) {
      // Edit the task
      updatedTasks = [...tasks];
      updatedTasks[editTaskIndex] = newTask;
    } else {
      // Add a new task
      updatedTasks = [...tasks, newTask];
    }

    setTasks(updatedTasks);
    saveToLocalStorage(updatedTasks);

    // Reset form fields and close modal
    resetForm();
  };

  // Reset the form after submitting or closing the modal
  const resetForm = () => {
    setStaffName('');
    setDepartment('');
    setTaskTitle('');
    setDeadline('');
    setYear(1);
    setSubject('');
    setDescription('');
    setEditTaskIndex(null);
    setModalIsOpen(false);
  };

  // Helper function to get the icon based on the year
  const getYearIcon = (year) => {
    switch (year) {
      case 1:
        return <i className="fas fa-calendar-day" style={{ color: 'rgb(241, 196, 15)' }}></i>;
      case 2:
        return <i className="fas fa-calendar-week" style={{ color: 'rgb(39, 174, 96)' }}></i>;
      case 3:
        return <i className="fas fa-calendar-alt" style={{ color: 'rgb(52, 152, 219)' }}></i>;
      case 4:
        return <i className="fas fa-calendar-check" style={{ color: 'rgb(231, 76, 60)' }}></i>;
      default:
        return <i className="fas fa-calendar" style={{ color: 'rgb(52, 152, 219)' }}></i>;
    }
  };

  // Filtering tasks based on selected filters
  const filteredTasks = tasks.filter((task) => {
    const yearMatch = filterYear ? task.year.toString() === filterYear : true;
    const departmentMatch = filterDepartment
      ? task.department.toLowerCase().includes(filterDepartment.toLowerCase())
      : true;
    const textMatch =
      filterText
        ? task.taskTitle.toLowerCase().includes(filterText.toLowerCase()) ||
          task.description.toLowerCase().includes(filterText.toLowerCase())
        : true;

    return yearMatch && departmentMatch && textMatch;
  });

  return (
    <div
      className="container-fluid"
      style={{
        backgroundColor: 'rgb(26, 32, 44)', // Dark background color
        color: 'white', // White text color for contrast
        minHeight: '100vh', // Full viewport height
      }}
    >
      <div className="text-center mb-4">
        <button
          className="btn btn-lg"
          onClick={() => setModalIsOpen(true)}
          style={{
            backgroundColor: 'rgb(52, 152, 219)',
            border: 'none',
            fontSize: '18px',
            padding: '10px 20px',
          }}
        >
          <i
            className="fas fa-plus-circle"
            style={{ fontSize: '20px', marginRight: '10px', color: 'white' }}
          ></i>
          Assign Task
        </button>
      </div>

      {/* Filter Section */}
      <div className="d-flex justify-content-between mb-4">
        {/* Year Filter */}
        <div className="d-flex align-items-center">
          <label className="me-2" style={{ color: 'white' }}>Year: </label>
          <select
            className="form-select"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            style={{ maxWidth: '120px' }}
          >
            <option value="">All Years</option>
            <option value="1">1 Year</option>
            <option value="2">2 Years</option>
            <option value="3">3 Years</option>
            <option value="4">4 Years</option>
          </select>
        </div>

        {/* Department Filter */}
        <div className="d-flex align-items-center">
          <label className="me-2" style={{ color: 'white' }}>Department: </label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by Department"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            style={{ maxWidth: '250px' }}
          />
        </div>

        {/* Text Filter */}
        <div className="d-flex align-items-center">
          <label className="me-2" style={{ color: 'white' }}>Search: </label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by Title or Description"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ maxWidth: '250px' }}
          />
        </div>
      </div>

      {/* Modal to add or edit a new task */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Assign Task"
        style={{
          content: {
            backgroundColor: 'rgb(255, 255, 255)',
            borderRadius: '10px',
            padding: '30px',
            maxWidth: '600px',
            margin: 'auto',
          },
        }}
      >
        <h2 className="text-center mb-4" style={{ color: 'rgb(34, 193, 195)' }}>
          {editTaskIndex === null ? 'Assign Task' : 'Edit Task'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              <i
                className="fas fa-user"
                style={{ color: 'rgb(52, 152, 219)', marginRight: '5px' }}
              ></i>
              Staff Name:
            </label>
            <input
              type="text"
              className="form-control"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              <i
                className="fas fa-briefcase"
                style={{ color: 'rgb(39, 174, 96)', marginRight: '5px' }}
              ></i>
              Department:
            </label>
            <input
              type="text"
              className="form-control"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              <i
                className="fas fa-file-alt"
                style={{ color: 'rgb(241, 196, 15)', marginRight: '5px' }}
              ></i>
              Task Title:
            </label>
            <input
              type="text"
              className="form-control"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              <i
                className="fas fa-calendar-alt"
                style={{ color: 'rgb(231, 76, 60)', marginRight: '5px' }}
              ></i>
              Deadline:
            </label>
            <input
              type="date"
              className="form-control"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Year:</label>
            <select className="form-select" value={year} onChange={(e) => setYear(e.target.value)}>
              <option value={1}>1 Year</option>
              <option value={2}>2 Years</option>
              <option value={3}>3 Years</option>
              <option value={4}>4 Years</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">
              <i
                className="fas fa-book"
                style={{ color: 'rgb(52, 152, 219)', marginRight: '5px' }}
              ></i>
              Subject:
            </label>
            <input
              type="text"
              className="form-control"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <i
                className="fas fa-comment-dots"
                style={{ color: 'rgb(39, 174, 96)', marginRight: '5px' }}
              ></i>
              Description:
            </label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              required
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="btn btn-success btn-lg"
              style={{
                backgroundColor: 'rgb(39, 174, 96)',
                border: 'none',
                padding: '10px 20px',
              }}
            >
              <i
                className="fas fa-save"
                style={{ fontSize: '20px', marginRight: '10px', color: 'white' }}
              ></i>
              {editTaskIndex === null ? 'Save Task' : 'Update Task'}
            </button>
            <button
              type="button"
              className="btn btn-danger btn-lg ms-3"
              onClick={() => setModalIsOpen(false)}
              style={{
                backgroundColor: 'rgb(231, 76, 60)',
                border: 'none',
                padding: '10px 20px',
              }}
            >
              <i
                className="fas fa-times-circle"
                style={{ fontSize: '20px', marginRight: '10px', color: 'white' }}
              ></i>
              Close
            </button>
          </div>
        </form>
      </Modal>

      {/* Display filtered tasks */}
      <h3 className="text-center mt-5" style={{ color: 'rgb(34, 193, 195)' }}>Assigned Tasks</h3>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {filteredTasks.map((task, index) => (
          <div key={index} className="col">
            <div
              className="card"
              style={{
                borderLeft: '8px solid rgb(52, 152, 219)', // Left blue border
                border: 'none',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                padding: '10px', // Reduced padding for small cards
                marginBottom: '20px',
                maxWidth: '300px', // Maximum width for smaller cards
                margin: 'auto',
              }}
            >
              <div className="card-body" style={{ color: 'black' }}>
                <h5 className="card-title" style={{ color: 'rgb(52, 152, 219)', fontWeight: 'bold' }}>
                  {task.taskTitle}
                </h5>
                <p className="card-text" style={{ color: 'rgb(39, 174, 96)' }}>
                  <i
                    className="fas fa-user fa-2x"
                    style={{ marginRight: '10px' }}
                  ></i>
                  {task.staffName}
                </p>
                <p className="card-text" style={{ color: 'rgb(231, 76, 60)' }}>
                  <i
                    className="fas fa-briefcase fa-2x"
                    style={{ marginRight: '10px' }}
                  ></i>
                  {task.department}
                </p>
                <p className="card-text" style={{ color: 'rgb(241, 196, 15)' }}>
                  <i
                    className="fas fa-calendar-check fa-2x"
                    style={{ marginRight: '10px' }}
                  ></i>
                  {task.deadline}
                </p>
                <p className="card-text" style={{ color: 'rgb(52, 152, 219)' }}>
                  <i
                    className="fas fa-book fa-2x"
                    style={{ marginRight: '10px' }}
                  ></i>
                  {task.subject}
                </p>
                <p className="card-text" style={{ color: 'rgb(39, 174, 96)' }}>
                  <i
                    className="fas fa-comment-dots fa-2x"
                    style={{ marginRight: '10px' }}
                  ></i>
                  {task.description}
                </p>
                <p className="card-text" style={{ color: 'rgb(231, 76, 60)' }}>
                  <span className="me-2">{getYearIcon(task.year)}</span>
                  Year: {task.year} {task.year === 1 ? 'Year' : 'Years'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignTask;
