import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Button, Modal, Form, Spinner, Alert, Nav } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Manager/ManagerDashboard.css';

const SuperAdminDashboard = () => {
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        org: "",
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const fetchManagers = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:8080/managers/allManagers");
            setManagers(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching managers:", err);
            setError("Failed to fetch managers. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchManagers();
    }, []);

    const handleAddManager = () => {
        setModalMode("add");
        setFormData({ id: null, name: "", org: "", email: "", password: "" });
        setShowModal(true);
    };

    const handleEditManager = (manager) => {
        setModalMode("edit");
        setFormData({
            id: manager.id,
            name: manager.name,
            org: manager.org,
            email: manager.email,
            password: "", // Do not pre-fill password for security
        });
        setShowModal(true);
    };

    const handleDeleteManager = async (id) => {
        if (window.confirm("Are you sure you want to delete this manager?")) {
            try {
                await axios.delete(`http://localhost:8080/managers/delete/${id}`);
                fetchManagers();
            } catch (err) {
                console.error("Error deleting manager:", err);
                setError("Failed to delete manager.");
            }
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (modalMode === "add") {
                await axios.post("http://localhost:8080/managers/addManager", {
                    name: formData.name,
                    org: formData.org,
                    email: formData.email,
                    password: formData.password,
                });
            } else {
                await axios.put(`http://localhost:8080/managers/update/${formData.id}`, {
                    name: formData.name,
                    org: formData.org,
                    email: formData.email,
                    password: formData.password,
                });
            }
            setShowModal(false);
            fetchManagers();
        } catch (err) {
            console.error("Error submitting form:", err);
            setError(err.response?.data || "An unexpected error occurred.");
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
                            <Nav.Link as={Link} to="/superadmindashboard" className="text-white active bg-primary-dark rounded">
                                <i className="bi bi-speedometer2 me-2"></i>Dashboard
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

                {/* Main Content Area */}
                <Col md={10} className="main-content p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="text-primary fw-bold">Manager Management</h2>
                        <Button variant="primary" onClick={handleAddManager}>
                            Add New Manager
                        </Button>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Card className="shadow-sm">
                        <Card.Body>
                            {loading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" role="status" variant="primary" />
                                </div>
                            ) : (
                                <Table striped bordered hover responsive className="mb-0">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Organization</th>
                                            <th>Email</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {managers.map((manager) => (
                                            <tr key={manager.id}>
                                                <td>{manager.id}</td>
                                                <td>{manager.name}</td>
                                                <td>{manager.org}</td>
                                                <td>{manager.email}</td>
                                                <td>
                                                    <Button
                                                        variant="warning"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleEditManager(manager)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleDeleteManager(manager.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Add/Edit Manager Modal */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{modalMode === "add" ? "Add Manager" : "Edit Manager"}</Modal.Title>
                        </Modal.Header>
                        <Form onSubmit={handleFormSubmit}>
                            <Modal.Body>
                                <Form.Group className="mb-3">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Organization</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="org"
                                        value={formData.org}
                                        onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                {modalMode === "add" && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowModal(false)}>
                                    Close
                                </Button>
                                <Button variant="primary" type="submit">
                                    {modalMode === "add" ? "Add Manager" : "Save Changes"}
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                </Col>
            </Row>
        </Container>
    );
};

export default SuperAdminDashboard;
