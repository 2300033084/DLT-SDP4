import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Nav, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Manager/ManagerDashboard.css'; // Reuse ManagerDashboard styles for consistency

const ProfilePage = () => {
    const [userData, setUserData] = useState({ name: '', email: '', org: '', password: '' });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const id = localStorage.getItem('id');
    const role = localStorage.getItem('role');
    const userName = localStorage.getItem('userName') || 'User';

    const isEmployee = role === 'EMPLOYEE';
    const API_BASE_URL = 'http://localhost:8080';
    // Determine the correct API endpoint based on the user role
    const API_URL = isEmployee 
        ? `${API_BASE_URL}/api/employees/profile/${id}` 
        : `${API_BASE_URL}/manager/profile/${id}`;
    
    // Determine the base dashboard link for the sidebar
    const baseRoute = isEmployee ? '/employeedashboard' : '/managerdashboard';


    useEffect(() => {
        if (!id || !role) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await axios.get(API_URL);
                setUserData({
                    name: response.data.name,
                    email: response.data.email,
                    org: response.data.org || '', // Org for Employee/Manager
                    password: '' // Never fetch or pre-fill password
                });
            } catch (err) {
                setError('Failed to fetch profile data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id, role, API_URL, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSaving(true);

        try {
            await axios.put(API_URL, {
                name: userData.name,
                password: userData.password, // Backend will only use this if not empty
            });

            // Update local storage name to reflect change in sidebar/dashboard
            localStorage.setItem('userName', userData.name);
            
            setSuccess('Profile updated successfully!');
            setUserData(prev => ({ ...prev, password: '' })); // Clear password field
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };
    
    // Reusable Sidebar component logic
    const DashboardSidebar = () => {
        const employeeNavItems = [
            { to: baseRoute, icon: 'bi-speedometer2', label: 'Dashboard' },
            { to: '/leave', icon: 'bi-calendar-event', label: 'Leave Management' },
            { to: '/attendance', icon: 'bi-clock-history', label: 'Attendance' },
            { to: '/payroll', icon: 'bi-cash-stack', label: 'Payroll' },
            { to: '/profile', icon: 'bi-person-lines-fill', label: 'Profile', isActive: true },
            { to: '/documents', icon: 'bi-file-earmark-text', label: 'Documents' },
        ];
        
        const managerNavItems = [
            { to: baseRoute, icon: 'bi-speedometer2', label: 'Dashboard' },
            { to: '/leave/approvals', icon: 'bi-calendar-event', label: 'Leave Approvals' },
            { to: '/attendance/manage', icon: 'bi-clock-history', label: 'Attendance' },
            { to: '/managerprofile', icon: 'bi-person-lines-fill', label: 'Profile', isActive: true },
            { to: '#', icon: 'bi-people-fill', label: 'Team Management' },
            { to: '#', icon: 'bi-graph-up', label: 'Reports' },
        ];

        const navItems = isEmployee ? employeeNavItems : managerNavItems;
        const portalName = isEmployee ? 'EMPLOYEE Portal' : 'Manager Portal';
        const bgColor = isEmployee ? 'bg-dark' : 'bg-primary';

        return (
            <Col md={2} className={`sidebar ${bgColor} text-white vh-100 sticky-top`}>
                <div className="sidebar-header p-3 text-center">
                    <h4>{portalName}</h4>
                    <div className="employee-info mt-3">
                        <div className={`avatar ${isEmployee ? 'bg-primary' : 'bg-white text-primary'} rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2`} 
                             style={{ width: '60px', height: '60px' }}>
                            <span className="fs-4">{userName.charAt(0)}</span>
                        </div>
                        <h6 className="mb-0">{userName}</h6>
                        <small className="text-muted">{role}</small>
                    </div>
                </div>

                <Nav className="flex-column p-3">
                    {navItems.map((item, index) => (
                        <Nav.Item key={index} className="mb-2">
                            <Nav.Link 
                                as={Link} 
                                to={item.to} 
                                className={`text-white hover-bg-primary-dark rounded ${item.isActive ? 'active bg-primary-dark' : ''}`}
                            >
                                <i className={`bi ${item.icon} me-2`}></i>{item.label}
                            </Nav.Link>
                        </Nav.Item>
                    ))}
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
        );
    };

    return (
        <Container fluid className="dashboard-container px-0">
            <Row className="g-0">
                <DashboardSidebar />
                <Col md={10} className="main-content p-4">
                    <h2 className="mb-4">My Profile</h2>
                    
                    {loading ? (
                        <div className="text-center py-5"><Spinner animation="border" /></div>
                    ) : (
                        <Card>
                            <Card.Body>
                                {error && <Alert variant="danger">{error}</Alert>}
                                {success && <Alert variant="success">{success}</Alert>}
                                
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Full Name</Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    name="name"
                                                    value={userData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Email Address</Form.Label>
                                                <Form.Control 
                                                    type="email" 
                                                    name="email"
                                                    value={userData.email}
                                                    readOnly 
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>New Password (Leave blank to keep current)</Form.Label>
                                                <Form.Control 
                                                    type="password" 
                                                    name="password"
                                                    value={userData.password}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter new password"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Organization</Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    name="org"
                                                    value={userData.org}
                                                    readOnly 
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    
                                    <Button variant="primary" type="submit" disabled={isSaving}>
                                        {isSaving ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                                Saving...
                                            </>
                                        ) : 'Update Profile'}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;