import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, Spinner, Badge, Alert } from 'react-bootstrap';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const employeeName = localStorage.getItem('userName') || 'Employee';
  const employeeId = localStorage.getItem('employeeId');
  const [dashboardData, setDashboardData] = useState({
    pendingLeaves: 0,
    attendanceSummary: { present: 0, absent: 0, leave: 0, totalWorkingDays: 0 },
    recentLeaves: [],
    teamMembers: 0,
    announcements: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  //const API_BASE_URL = 'http://localhost:8080';
  
  const baseUrl = `${import.meta.env.VITE_API_URL}`;


  // Fetch all dashboard data
  useEffect(() => {
    if (!employeeId) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        
        // Use Promise.all to fetch all data concurrently and more efficiently
        const [leaveResponse, attendanceResponse, employeeProfileResponse, announcementsResponse] = await Promise.all([
          axios.get(`${baseUrl}/api/leave-requests/employee/${employeeId}`),
          axios.get(`${baseUrl}/api/attendance/employee/${employeeId}/month?year=${currentYear}&month=${currentMonth}`),
          axios.get(`${baseUrl}/api/employees/profile/${employeeId}`),
          axios.get(`${baseUrl}/api/announcements`) // Fetching announcements
        ]);

        const allLeaveRequests = leaveResponse.data || [];
        const pendingLeaves = allLeaveRequests.filter(req => req.status === 'PENDING').length;

        const attendanceRecords = attendanceResponse.data || [];
        const presentDays = attendanceRecords.filter(a => a.status === 'PRESENT').length;
        const absentDays = attendanceRecords.filter(a => a.status === 'ABSENT').length;
        const leaveDays = attendanceRecords.filter(a => a.status === 'LEAVE').length;
        const totalMarkedDays = presentDays + absentDays + leaveDays;
        const attendancePercentage = totalMarkedDays > 0 ? (presentDays / totalMarkedDays) * 100 : 0;
        
        let teamMembersCount = 0;
        const employeeProfileData = employeeProfileResponse.data;
        if (employeeProfileData && employeeProfileData.manager && employeeProfileData.manager.id) {
          const managerId = employeeProfileData.manager.id;
          const teamMembersResponse = await axios.get(`${baseUrl}/api/employees/byManager/${managerId}`);
          teamMembersCount = teamMembersResponse.data ? teamMembersResponse.data.length : 0;
        }

        setDashboardData({
          pendingLeaves,
          attendanceSummary: {
            present: presentDays,
            absent: absentDays,
            leave: leaveDays,
            totalWorkingDays: totalMarkedDays,
            percentage: attendancePercentage
          },
          recentLeaves: allLeaveRequests.filter(req => req.status === 'PENDING').slice(0, 2),
          teamMembers: teamMembersCount,
          announcements: announcementsResponse.data || [],
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError('Failed to fetch dashboard data. Please check the network and API server.');
        setDashboardData({
          pendingLeaves: 0,
          attendanceSummary: { present: 0, absent: 0, leave: 0, totalWorkingDays: 0 },
          recentLeaves: [],
          teamMembers: 0,
          announcements: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [employeeId, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // The quickStats array now uses state values
  const quickStats = [
    { title: 'Pending Leaves', value: dashboardData.pendingLeaves, link: '/leave' },
    { title: 'Attendance This Month', value: `${dashboardData.attendanceSummary.present}/${dashboardData.attendanceSummary.totalWorkingDays}`, link: '/attendance' },
    { title: 'Upcoming Holidays', value: 'N/A', link: '#' },
    { title: 'Team Members', value: dashboardData.teamMembers, link: '#' }
  ];

  const getLinkClass = (path) =>
      `text-white hover-bg-primary-dark rounded ${
          location.pathname === path ? "active" : ""
      }`;

  return (
    <Container fluid className="dashboard-container px-0">
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={2} className="sidebar vh-100 sticky-top">
          <div className="sidebar-header p-3 text-center">
            <h4>HR Portal</h4>
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
            {/* New Nav.Item for My Tasks */}
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

        {/* Main Content Area */}
        <Col md={10} className="main-content p-4">
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
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" />
              <p className="mt-2">Loading dashboard data...</p>
            </div>
          ) : (
            <>
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
              <Row>
                <Col md={6} className="mb-4">
                  <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h5>Recent Leave Requests</h5>
                      <Button variant="link" as={Link} to="/leave">View All</Button>
                    </Card.Header>
                    <Card.Body>
                      {dashboardData.recentLeaves.length > 0 ? (
                        dashboardData.recentLeaves.map((request) => (
                          <div key={request.id} className="activity-item d-flex justify-content-between mb-3">
                            <div>
                              <strong>Leave Request #{request.id}</strong>
                              <div className="text-muted small">{formatDate(request.startDate)} - {formatDate(request.endDate)}</div>
                            </div>
                            <Badge bg="warning">Pending</Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted py-3">No recent leave requests.</div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

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
                          style={{ width: `${dashboardData.attendanceSummary.percentage}%` }}
                          aria-valuenow={dashboardData.attendanceSummary.percentage}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {Math.round(dashboardData.attendanceSummary.percentage)}% Present
                        </div>
                      </div>
                      <div className="d-flex justify-content-between small">
                        <span>Present: {dashboardData.attendanceSummary.present} days</span>
                        <span>Absent: {dashboardData.attendanceSummary.absent} days</span>
                        <span>Leave: {dashboardData.attendanceSummary.leave} days</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Card>
                    <Card.Header>
                      <h5>Company Announcements</h5>
                    </Card.Header>
                    <Card.Body>
                      {dashboardData.announcements.length > 0 ? (
                        dashboardData.announcements.map(announcement => (
                          <div key={announcement.id} className="announcement mb-3 border-bottom">
                            <h6>{announcement.title}</h6>
                            <p className="text-muted small mb-1">{announcement.content}</p>
                            <div className="text-end small text-muted">Posted: {new Date(announcement.date).toLocaleDateString()}</div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted py-3">No announcements found.</div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default EmployeeDashboard;
