import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Nav, Alert, Spinner, Table, Badge } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./ManagerDashboard.css";

const ManagerTaskAssignment = () => {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    dueDate: new Date(),
    employeeId: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const managerId = localStorage.getItem("managerId");
  const managerName = localStorage.getItem("userName") || "Manager";
  //const API_BASE_URL = "http://localhost:8080";
  const baseUrl = `${import.meta.env.VITE_API_URL}`;


  // Helper function for active link highlighting
  const getLinkClass = (path) =>
    `text-white hover-bg-primary-dark rounded ${
      location.pathname === path ? "active bg-primary-dark" : ""
    }`;

  const fetchEmployeesAndTasks = async () => {
    try {
      setLoading(true);
      const employeesResponse = await axios.get(`${baseUrl}/api/employees/byManager/${managerId}`);
      const employeesData = employeesResponse.data;
      setEmployees(employeesData);

      const allTasks = [];
      // Fetch tasks for each employee under the manager
      await Promise.all(
        employeesData.map(async (employee) => {
          const tasksResponse = await axios.get(`${baseUrl}/api/tasks/employee/${employee.id}`);
          tasksResponse.data.forEach(task => allTasks.push({ ...task, employeeName: employee.name }));
        })
      );
      setTasks(allTasks);

    } catch (err) {
      setError("Failed to fetch data. Please check the API server.");
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (managerId) {
      fetchEmployeesAndTasks();
    } else {
      navigate("/login");
    }
  }, [managerId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setTaskData((prev) => ({ ...prev, dueDate: date }));
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post(
        `${baseUrl}/api/tasks/create/${taskData.employeeId}`,
        {
          title: taskData.title,
          description: taskData.description,
          dueDate: taskData.dueDate.toISOString().split("T")[0],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      alert("Task assigned successfully!");
      fetchEmployeesAndTasks(); // Refresh data
      setTaskData({
        title: "",
        description: "",
        dueDate: new Date(),
        employeeId: "",
      });
    } catch (err) {
      console.error("Error assigning task:", err);
      setError(err.response?.data?.message || "Failed to assign task.");
    }
  };
  
  const handleTaskDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`${baseUrl}/api/tasks/${taskId}`);
        fetchEmployeesAndTasks(); // Refresh data
        alert("Task deleted successfully!");
      } catch (err) {
        console.error("Error deleting task:", err);
        alert("Failed to delete task.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NOT_STARTED': return 'secondary';
      case 'IN_PROGRESS': return 'primary';
      case 'COMPLETED': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <Container fluid className="dashboard-container">
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={2} className="sidebar bg-primary text-white vh-100 sticky-top">
          <div className="sidebar-header p-4 text-center">
            <h4 className="text-white">Manager Portal</h4>
            <div className="employee-info mt-4">
              <div
                className="avatar bg-white text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: "70px", height: "70px" }}
              >
                <span className="fs-3 fw-bold">{managerName.charAt(0)}</span>
              </div>
              <h5 className="mb-0 text-white">{managerName}</h5>
              <small className="text-white-50">Manager</small>
            </div>
          </div>
          <Nav className="flex-column p-3">
            <Nav.Item className="mb-2">
              <Nav.Link
                as={Link}
                to="/managerdashboard"
                className={getLinkClass("/managerdashboard")}
              >
                <i className="bi bi-speedometer2 me-2"></i>Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mb-2">
              <Nav.Link
                as={Link}
                to="/leave/approvals"
                className={getLinkClass("/leave/approvals")}
              >
                <i className="bi bi-calendar-event me-2"></i>Leave Approvals
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mb-2">
              <Nav.Link
                as={Link}
                to="/attendance/manage"
                className={getLinkClass("/attendance/manage")}
              >
                <i className="bi bi-clock-history me-2"></i>Attendance
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mb-2">
              <Nav.Link
                as={Link}
                to="/manager/tasks"
                className={getLinkClass("/manager/tasks")}
              >
                <i className="bi bi-list-task me-2"></i>Task Management
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mb-2">
              <Nav.Link
                as={Link}
                to="#"
                className={getLinkClass("/manager/team")}
              >
                <i className="bi bi-people-fill me-2"></i>Team Management
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mt-4">
              <Button
                variant="outline-light"
                size="sm"
                className="w-100"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-left me-2"></i>Logout
              </Button>
            </Nav.Item>
          </Nav>
        </Col>

        {/* Main Content */}
        <Col md={10} className="main-content p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-primary fw-bold">Task Management</h2>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Row>
            {/* Task Assignment Form */}
            <Col md={12} lg={4} className="mb-4">
                <Card className="shadow-sm p-4">
                    <Card.Header className="bg-white border-0">
                        <h4 className="fw-bold">Assign New Task</h4>
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleTaskSubmit}>
                            <Form.Group className="mb-3" controlId="formTaskTitle">
                                <Form.Label>Task Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={taskData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formTaskDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={taskData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formTaskDueDate">
                                <Form.Label>Due Date</Form.Label>
                                <DatePicker
                                    selected={taskData.dueDate}
                                    onChange={handleDateChange}
                                    className="form-control"
                                    dateFormat="yyyy-MM-dd"
                                    minDate={new Date()}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formAssignedTo">
                                <Form.Label>Assign to</Form.Label>
                                <Form.Select
                                    name="employeeId"
                                    value={taskData.employeeId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select an Employee</option>
                                    {employees.map((employee) => (
                                        <option key={employee.id} value={employee.id}>
                                            {employee.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100">
                                Assign Task
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
            
            {/* Task List Table */}
            <Col md={12} lg={8} className="mb-4">
                <Card className="shadow-sm">
                    <Card.Header className="bg-white border-0">
                        <h4 className="fw-bold">My Team's Tasks</h4>
                    </Card.Header>
                    <Card.Body>
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" role="status" variant="primary" />
                            </div>
                        ) : tasks.length > 0 ? (
                            <div className="table-responsive">
                                <Table striped bordered hover className="mb-0">
                                    <thead>
                                        <tr>
                                            <th>Task</th>
                                            <th>Assigned To</th>
                                            <th>Due Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map((task) => (
                                            <tr key={task.id}>
                                                <td>
                                                    <strong>{task.title}</strong>
                                                    <p className="text-muted small mb-0">{task.description}</p>
                                                </td>
                                                <td>{task.employeeName}</td>
                                                <td>{task.dueDate}</td>
                                                <td>
                                                    <Badge bg={getStatusBadge(task.status)}>
                                                        {task.status.replace('_', ' ')}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Button variant="danger" size="sm" onClick={() => handleTaskDelete(task.id)}>
                                                        <i className="bi bi-trash me-1"></i>Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center text-muted py-3">No tasks found for your team.</div>
                        )}
                    </Card.Body>
                </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ManagerTaskAssignment;
