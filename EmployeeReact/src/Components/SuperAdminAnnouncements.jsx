import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Button, Form, Spinner, Alert, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Manager/ManagerDashboard.css'; // Re-using styling for consistency

const SuperAdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ title: "", content: "" });
    const navigate = useNavigate();
    const API_BASE_URL = 'http://localhost:8080';

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/announcements`);
            setAnnouncements(response.data);
        } catch (err) {
            console.error("Error fetching announcements:", err);
            setError("Failed to fetch announcements. Please check the API server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await axios.post(`${API_BASE_URL}/api/announcements/create`, formData);
            fetchAnnouncements(); // Refresh the list
            setFormData({ title: "", content: "" }); // Clear the form
            alert("Announcement created successfully!");
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
                            <Nav.Link as={Link} to="/superadmindashboard" className="text-white hover-bg-primary-dark rounded">
                                <i className="bi bi-person-gear me-2"></i>Manager Management
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="mb-2">
                            <Nav.Link as={Link} to="/superadmin/employees" className="text-white hover-bg-primary-dark rounded">
                                <i className="bi bi-people-fill me-2"></i>Employee Management
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="mb-2">
                            <Nav.Link as={Link} to="/superadmin/announcements" className="text-white active bg-primary-dark rounded">
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
                <Col md={10} className="main-content p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="text-primary fw-bold">Company Announcements</h2>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Row>
                        <Col md={6}>
                            <Card className="mb-4 shadow-sm">
                                <Card.Header>Create New Announcement</Card.Header>
                                <Card.Body>
                                    <Form onSubmit={handleFormSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Content</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={4}
                                                name="content"
                                                value={formData.content}
                                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                        <Button variant="primary" type="submit" disabled={loading}>
                                            {loading ? <Spinner animation="border" size="sm" /> : "Publish Announcement"}
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="shadow-sm">
                                <Card.Header>Recent Announcements</Card.Header>
                                <Card.Body>
                                    {loading ? (
                                        <div className="text-center py-3">
                                            <Spinner animation="border" variant="primary" />
                                        </div>
                                    ) : (
                                        announcements.length > 0 ? (
                                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                                {announcements.map((announcement) => (
                                                    <div key={announcement.id} className="mb-3 border-bottom pb-2">
                                                        <h5 className="text-primary">{announcement.title}</h5>
                                                        <p>{announcement.content}</p>
                                                        <div className="text-end text-muted small">Posted: {new Date(announcement.date).toLocaleDateString()}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center text-muted py-3">No announcements found.</div>
                                        )
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

export default SuperAdminAnnouncements;
