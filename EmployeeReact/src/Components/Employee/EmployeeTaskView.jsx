import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert, Spinner, Nav, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './EmployeeDashboard.css';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

const EmployeeTaskView = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const employeeId = localStorage.getItem('employeeId');
    const employeeName = localStorage.getItem('userName') || 'Employee';
    //const API_BASE_URL = 'http://localhost:8080';

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${baseUrl}/api/tasks/employee/${employeeId}`);
            setTasks(response.data);
        } catch (err) {
            setError("Failed to fetch tasks. Please check the API server.");
            console.error("Task fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (employeeId) {
            fetchTasks();
        } else {
            navigate('/login');
        }
    }, [employeeId, navigate]);

    const handleUpdateStatus = async (taskId, newStatus) => {
        try {
            await axios.put(`${baseUrl}/api/tasks/${taskId}/status?status=${newStatus}`);
            fetchTasks(); // Refresh the task list
            alert(`Task status updated to ${newStatus}.`);
        } catch (err) {
            console.error("Error updating task status:", err);
            alert("Failed to update task status.");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'NOT_STARTED': return 'secondary';
            case 'IN_PROGRESS': return 'primary';
            case 'COMPLETED': return 'success';
            default: return 'secondary';
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };
    
    const getLinkClass = (path) => {
        return `text-white hover-bg-primary-dark rounded ${location.pathname === path ? 'active bg-primary-dark' : ''}`;
    };

    return (
        <Container fluid className="dashboard-container px-0">
            <Row className="g-0">
                <Col md={2} className="sidebar vh-100 sticky-top">
                    <div className="sidebar-header p-3 text-center">
                        <h4>EMPLOYEE Portal</h4>
                        <div className="employee-info mt-3">
                            <div className="avatar bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
                                 style={{ width: '60px', height: '60px' }}>
                                <span className="fs-4">{employeeName.charAt(0)}</span>
                            </div>
                            <h6 className="mb-0">{employeeName}</h6>
                            <small className="text-muted">Employee</small>
                        </div>
                    </div>
                    <Nav className="flex-column p-3">
                        <Nav.Item>
                            <Nav.Link as={Link} to="/employeedashboard" className={getLinkClass("/employeedashboard")}>
                                <i className="bi bi-speedometer2 me-2"></i>Dashboard
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/leave" className={getLinkClass("/leave")}>
                                <i className="bi bi-calendar-event me-2"></i>Leave Management
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/attendance" className={getLinkClass("/attendance")}>
                                <i className="bi bi-clock-history me-2"></i>Attendance
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/payroll" className={getLinkClass("/payroll")}>
                                <i className="bi bi-cash-stack me-2"></i>Payroll
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/tasks" className={getLinkClass("/tasks")}>
                                <i className="bi bi-list-task me-2"></i>My Tasks
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/profile" className={getLinkClass("/profile")}>
                                <i className="bi bi-person-lines-fill me-2"></i>Profile
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/documents" className={getLinkClass("/documents")}>
                                <i className="bi bi-file-earmark-text me-2"></i>Documents
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <div className="logout-container">
                        <Button
                            variant="outline-light"
                            size="sm"
                            className="w-100"
                            onClick={handleLogout}
                        >
                            <i className="bi bi-box-arrow-left me-2"></i>Logout
                        </Button>
                    </div>
                </Col>
                <Col md={10} className="main-content p-4">
                    <h2 className="mb-4 text-primary">My Tasks</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" role="status" variant="primary" />
                        </div>
                    ) : (
                        <Card className="shadow-sm">
                            <Card.Body>
                                {tasks.length > 0 ? (
                                    <div className="table-responsive">
                                        <Table striped bordered hover className="mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Description</th>
                                                    <th>Due Date</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tasks.map(task => (
                                                    <tr key={task.id}>
                                                        <td>{task.title}</td>
                                                        <td>{task.description}</td>
                                                        <td>{task.dueDate}</td>
                                                        <td>
                                                            <Badge bg={getStatusBadge(task.status)}>
                                                                {task.status}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            {task.status !== 'COMPLETED' && (
                                                                <>
                                                                    <Button 
                                                                        variant="success" 
                                                                        size="sm" 
                                                                        className="me-2"
                                                                        onClick={() => handleUpdateStatus(task.id, 'COMPLETED')}
                                                                    >
                                                                        Complete
                                                                    </Button>
                                                                    {task.status === 'NOT_STARTED' && (
                                                                        <Button 
                                                                            variant="primary" 
                                                                            size="sm"
                                                                            onClick={() => handleUpdateStatus(task.id, 'IN_PROGRESS')}
                                                                        >
                                                                            Start
                                                                        </Button>
                                                                    )}
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="text-center text-muted py-3">No tasks assigned.</div>
                                )}
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default EmployeeTaskView;
