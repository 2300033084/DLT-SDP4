import { useState, useEffect } from 'react';
import { 
  Container, 
  Card, 
  Form, 
  Button, 
  Table, 
  Alert, 
  Modal, 
  Row, 
  Col, 
  ButtonGroup,
  Nav,
  Badge,
  Spinner
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ManagerDashboard.css';

const ManagerAttendancePage = () => {
  const [attendances, setAttendances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    status: 'PRESENT'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const managerName = localStorage.getItem("managerName") || "Manager";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Fetch employees and attendance records
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch employees
        const empResponse = await axios.get('/employees/allEmployees');
        setEmployees(empResponse.data);

        // Fetch attendance for selected date
        const dateStr = selectedDate.toISOString().split('T')[0];
        const attResponse = await axios.get(`/api/attendance/date/${dateStr}`);
        setAttendances(attResponse.data);
      } catch (error) {
        console.error('Error fetching employees or attendance:', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      await axios.post(`/api/attendance?employeeId=${formData.employeeId}&date=${dateStr}&status=${formData.status}`);

      // Refresh attendance data
      const response = await axios.get(`/api/attendance/date/${dateStr}`);
      setAttendances(response.data);
      
      setSuccess('Attendance marked successfully!');
      setShowModal(false);
      setFormData({ employeeId: '', status: 'PRESENT' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance');
    }
  };

  const handleBulkStatusChange = async (status) => {
    if (!window.confirm(`Mark all employees as ${status} for ${selectedDate.toISOString().split('T')[0]}?`)) {
      return;
    }

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      await axios.post('/api/attendance/bulk', {
        date: dateStr,
        status: status
      });

      // Refresh attendance data
      const response = await axios.get(`/api/attendance/date/${dateStr}`);
      setAttendances(response.data);
      
      setSuccess(`All employees marked as ${status} successfully!`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update attendance');
    }
  };

  async function updateAttendanceStatus(id, status) {
    try {
      await axios.put(`/api/attendance/${id}/status?status=${status}`);
      
      // Refresh attendance data
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await axios.get(`/api/attendance/date/${dateStr}`);
      setAttendances(response.data);
      
      setSuccess(`Attendance status updated to ${status}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update attendance');
    }
  }

  return (
    <Container fluid className="dashboard-container">
      <Row className="g-0">
        {/* Sidebar - Consistent with ManagerLeavePage */}
        <Col md={2} className="sidebar bg-primary text-white vh-100 sticky-top">
          <div className="sidebar-header p-4 text-center">
            <h4 className="text-white">HR Portal</h4>
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
              <Nav.Link as={Link} to="/managerdashboard" className="text-white hover-bg-primary-dark rounded">
                <i className="bi bi-speedometer2 me-2"></i>Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mb-2">
              <Nav.Link as={Link} to="/leave/approvals" className="text-white hover-bg-primary-dark rounded">
                <i className="bi bi-calendar-event me-2"></i>Leave Approvals
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mb-2">
              <Nav.Link as={Link} to="/attendance/manage" className="text-white active bg-primary-dark rounded">
                <i className="bi bi-clock-history me-2"></i>Attendance
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mb-2">
              <Nav.Link href="#" className="text-white hover-bg-primary-dark rounded">
                <i className="bi bi-people-fill me-2"></i>Team Management
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mb-2">
              <Nav.Link href="#" className="text-white hover-bg-primary-dark rounded">
                <i className="bi bi-graph-up me-2"></i>Reports
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
        <Col md={10} className="main-content p-4 bg-light">
          {/* Top Navigation */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-primary">Attendance Management</h2>
            <div className="d-flex align-items-center">
              <Button variant="outline-primary" size="sm" className="me-2">
                <i className="bi bi-bell-fill"></i>
              </Button>
              <Button variant="outline-primary" size="sm" className="me-3">
                <i className="bi bi-envelope-fill"></i>
              </Button>
              <span className="text-muted">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Select Date</Form.Label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  className="form-control"
                  maxDate={new Date()}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex align-items-end">
              <ButtonGroup>
                <Button variant="success" onClick={() => handleBulkStatusChange('PRESENT')}>
                  Mark All Present
                </Button>
                <Button variant="danger" onClick={() => handleBulkStatusChange('ABSENT')}>
                  Mark All Absent
                </Button>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                  Add Individual
                </Button>
              </ButtonGroup>
            </Col>
          </Row>

          <Card className="shadow-sm border-0" style={{ width: '500px' }}>
            <Card.Body className="p-3" style={{ marginLeft: '0px' }}>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading attendance records...</p>
                </div>
              ) : attendances.length > 0 ? (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Employee</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendances.map(attendance => (
                        <tr key={attendance.id}>
                          <td>{attendance.employee?.name || `Employee ${attendance.employeeId}`}</td>
                          <td>{attendance.date}</td>
                          <td>
                            <Badge 
                              bg={
                                attendance.status === 'PRESENT' ? 'success' : 
                                attendance.status === 'LEAVE' ? 'info' : 'danger'
                              }
                              className="rounded-pill"
                            >
                              {attendance.status}
                            </Badge>
                          </td>
                          <td>
                            <ButtonGroup size="sm">
                              <Button 
                                variant="outline-success" 
                                onClick={() => updateAttendanceStatus(attendance.id, 'PRESENT')}
                                disabled={attendance.status === 'PRESENT'}
                              >
                                Present
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                onClick={() => updateAttendanceStatus(attendance.id, 'ABSENT')}
                                disabled={attendance.status === 'ABSENT'}
                              >
                                Absent
                              </Button>
                              <Button 
                                variant="outline-info" 
                                onClick={() => updateAttendanceStatus(attendance.id, 'LEAVE')}
                                disabled={attendance.status === 'LEAVE'}
                              >
                                Leave
                              </Button>
                            </ButtonGroup>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-calendar-x text-muted fs-1"></i>
                  <h5 className="mt-3">No attendance records found</h5>
                  <p className="text-muted">
                    No attendance data available for the selected date
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Add Attendance Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Mark Attendance</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Employee</Form.Label>
                  <Form.Select 
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="PRESENT">Present</option>
                    <option value="ABSENT">Absent</option>
                    <option value="LEAVE">Leave</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={selectedDate.toISOString().split('T')[0]} 
                    readOnly 
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default ManagerAttendancePage;