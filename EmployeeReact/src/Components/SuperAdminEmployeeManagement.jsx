import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Spinner, Nav, Button, Alert, Accordion, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Manager/ManagerDashboard.css';

const SuperAdminEmployeeManagement = () => {
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const baseUrl = `${import.meta.env.VITE_API_URL}`;

    const fetchManagersWithEmployees = async () => {
        try {
            setLoading(true);
            const managersResponse = await axios.get(`${baseUrl}/manager/allManagers`);
            const managersData = managersResponse.data;

            const managersWithEmployees = await Promise.all(
                managersData.map(async (manager) => {
                    const employeesResponse = await axios.get(`${baseUrl}/api/employees/byManager/${manager.id}`);
                    return {
                        ...manager,
                        employees: employeesResponse.data || []
                    };
                })
            );
            setManagers(managersWithEmployees);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch data. Please check the API server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchManagersWithEmployees();
    }, []);

    const handleUpdateEmployeeStatus = async (employeeId, status) => {
        try {
            const url = `${baseUrl}/api/employees/updateEmployeeStatus/${employeeId}`;
            const response = await axios.post(url, null, { params: { status } });

            fetchManagersWithEmployees(); // Refresh list
            alert(response.data);
        } catch (err) {
            console.error("Error updating employee status:", err);
            alert("Failed to update employee status.");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <Container fluid className="dashboard-container">
            <Row className="g-0">
                {/* Sidebar */}
                <Col md={2} className="sidebar bg-primary text-white vh-100 sticky-top">
                    <div className="sidebar-header p-4 text-center">
                        <h4 className="text-white">Admin Portal</h4>
                    </div>
                    <Nav className="flex-column p-3">
                        <Nav.Item className="mb-2">
                            <Nav.Link as={Link} to="/superadmindashboard" className={`text-white hover-bg-primary-dark rounded ${location.pathname === '/superadmindashboard' ? 'active bg-primary-dark' : ''}`}>
                                <i className="bi bi-person-gear me-2"></i>Manager Management
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="mb-2">
                            <Nav.Link as={Link} to="/superadmin/employees" className={`text-white hover-bg-primary-dark rounded ${location.pathname === '/superadmin/employees' ? 'active bg-primary-dark' : ''}`}>
                                <i className="bi bi-people-fill me-2"></i>Employee Management
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="mb-2">
                            <Nav.Link as={Link} to="/superadmin/announcements" className={`text-white hover-bg-primary-dark rounded ${location.pathname === '/superadmin/announcements' ? 'active bg-primary-dark' : ''}`}>
                                <i className="bi bi-megaphone me-2"></i>Announcements
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
                        <h2 className="text-primary fw-bold">Centralized Employee Management</h2>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" role="status" variant="primary" />
                            <p className="mt-2">Loading employee data...</p>
                        </div>
                    ) : (
                        <Accordion defaultActiveKey="0">
                            {managers.map((manager, index) => (
                                <Accordion.Item eventKey={index.toString()} key={manager.id} className="mb-3">
                                    <Accordion.Header>
                                        <div className="d-flex w-100 align-items-center justify-content-between pe-3">
                                            <span>
                                                <i className="bi bi-person-badge-fill me-2"></i>
                                                Manager: {manager.name} ({manager.employees.length} Employees)
                                            </span>
                                            <Badge bg="secondary">{manager.org}</Badge>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        {manager.employees.length > 0 ? (
                                            <div className="table-responsive">
                                                <Table striped bordered hover className="mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>ID</th>
                                                            <th>Name</th>
                                                            <th>Email</th>
                                                            <th>Status</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {manager.employees.map((employee) => (
                                                            <tr key={employee.id}>
                                                                <td>{employee.id}</td>
                                                                <td>{employee.name}</td>
                                                                <td>{employee.email}</td>
                                                                <td>
                                                                    <Badge bg={
                                                                        employee.status === 'ACCEPTED' ? 'success' :
                                                                        employee.status === 'PENDING' ? 'warning' :
                                                                        employee.status === 'REJECTED' ? 'danger' : 'secondary'
                                                                    }>
                                                                        {employee.status}
                                                                    </Badge>
                                                                </td>
                                                                <td>
                                                                    {employee.status === "PENDING" && (
                                                                        <>
                                                                            <Button
                                                                                variant="success"
                                                                                size="sm"
                                                                                className="me-2"
                                                                                onClick={() => handleUpdateEmployeeStatus(employee.id, "ACCEPTED")}
                                                                            >
                                                                                Accept
                                                                            </Button>
                                                                            <Button
                                                                                variant="warning"
                                                                                size="sm"
                                                                                onClick={() => handleUpdateEmployeeStatus(employee.id, "REJECTED")}
                                                                            >
                                                                                Reject
                                                                            </Button>
                                                                        </>
                                                                    )}
                                                                    {employee.status === "ACCEPTED" && (
                                                                        <Button
                                                                            variant="danger"
                                                                            size="sm"
                                                                            onClick={() => handleUpdateEmployeeStatus(employee.id, "DEACTIVATED")}
                                                                        >
                                                                            Deactivate
                                                                        </Button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        ) : (
                                            <div className="text-center text-muted py-3">No employees found for this manager.</div>
                                        )}
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default SuperAdminEmployeeManagement;
