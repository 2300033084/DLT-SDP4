import React from 'react';
import { Container, Row, Col, Card, Button, Nav } from 'react-bootstrap';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const employeeName = localStorage.getItem('userName') || 'Employee';

  // Quick stats data - you would fetch these from your API
  const quickStats = [
    { title: 'Pending Leaves', value: 2, link: '/leave' },
    { title: 'Attendance This Month', value: '18/22', link: '/attendance' },
    { title: 'Upcoming Holidays', value: 1, link: '#' },
    { title: 'Team Members', value: 15, link: '#' }
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Container fluid className="dashboard-container px-0">
      {/* Sidebar and Main Content Layout */}
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={2} className="sidebar bg-dark text-white vh-100 sticky-top">
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
              <Nav.Link as={Link} to="/employeedashboard" className="text-white">
                <i className="bi bi-speedometer2 me-2"></i>Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/leave" className="text-white">
                <i className="bi bi-calendar-event me-2"></i>Leave Management
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/attendance" className="text-white">
                <i className="bi bi-clock-history me-2"></i>Attendance
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/payroll" className="text-white">
                <i className="bi bi-cash-stack me-2"></i>Payroll
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/profile" className="text-white">
                <i className="bi bi-person-lines-fill me-2"></i>Profile
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/documents" className="text-white">
                <i className="bi bi-file-earmark-text me-2"></i>Documents
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
          {/* Top Navigation */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Dashboard</h2>
            <div className="d-flex align-items-center">
              <span className="me-3">
                <i className="bi bi-bell-fill text-primary"></i>
              </span>
              <span className="me-3">
                <i className="bi bi-envelope-fill text-primary"></i>
              </span>
              <span className="text-muted">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            </div>

          {/* Quick Stats */}
          <Row className="mb-4">
            {quickStats.map((stat, index) => (
              <Col key={index} md={3} className="mb-3">
                <Card
                  as={Link} 
                  to={stat.link} 
                  className="h-100 stat-card text-decoration-none"
                >
                  <Card.Body className="text-center">
                    <h5 className="text-muted">{stat.title}</h5>
                    <h2 className="text-primary">{stat.value}</h2>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Recent Activities and Content Sections */}
          <Row>
            {/* Recent Leave Requests */}
            <Col md={6} className="mb-4">
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5>Recent Leave Requests</h5>
                  <Button variant="link" as={Link} to="/leave">View All</Button>
                </Card.Header>
                <Card.Body>
                  <div className="activity-list">
                    {[1, 2].map((item) => (
                      <div key={item} className="activity-item d-flex justify-content-between mb-3">
                        <div>
                          <strong>Leave Request #{item}</strong>
                          <div className="text-muted small">Dec {10 + item}, 2023 - Dec {12 + item}, 2023</div>
                        </div>
                        <span className={`badge ${item === 1 ? 'bg-warning' : 'bg-success'}`}>
                          {item === 1 ? 'Pending' : 'Approved'}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Attendance Summary */}
            <Col md={6} className="mb-4">
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5>Attendance Summary</h5>
                  <Button variant="link" as={Link} to="/attendance">View All</Button>
                </Card.Header>
                <Card.Body>
                  <div className="progress mb-3">
                    <div 
                      className="progress-bar bg-success" 
                      role="progressbar" 
                      style={{ width: '82%' }}
                      aria-valuenow="82" 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    >
                      82% Present
                    </div>
                  </div>
                  <div className="d-flex justify-content-between small">
                    <span>Present: 18 days</span>
                    <span>Absent: 2 days</span>
                    <span>Leave: 2 days</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Additional Sections */}
          <Row>
            <Col md={12}>
              <Card>
                <Card.Header>
                  <h5>Company Announcements</h5>
                </Card.Header>
                <Card.Body>
                  <div className="announcement">
                    <h6>Holiday Notice</h6>
                    <p className="text-muted small">December 25th will be a company-wide holiday for Christmas celebrations.</p>
                    <div className="text-end small text-muted">Posted: Dec 1, 2023</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Outlet for nested routes */}
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default EmployeeDashboard;
