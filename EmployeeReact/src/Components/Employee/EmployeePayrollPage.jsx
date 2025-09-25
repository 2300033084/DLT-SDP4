import { useState, useEffect } from 'react';
import { Container, Card, Table, Alert, Spinner, Button, Row, Col, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EmployeePayrollPage = () => {
  const [payrollData, setPayrollData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [employeeId, setEmployeeId] = useState(null);
  const [dailyWage, setDailyWage] = useState(15);
  const navigate = useNavigate();
  const employeeName = localStorage.getItem('employeeName') || 'Employee';

  // Get employee ID from localStorage
  useEffect(() => {
    const storedEmployeeId = localStorage.getItem('employeeId');
    const storedDailyWage = localStorage.getItem('dailyWage');
    
    if (!storedEmployeeId) {
      navigate('/login');
      return;
    }
    
    setEmployeeId(storedEmployeeId);
    if (storedDailyWage) {
      setDailyWage(parseFloat(storedDailyWage));
    }
  }, [navigate]);

  // Fetch payroll data
  useEffect(() => {
    if (!employeeId) return;

    const fetchPayrollData = async () => {
      setLoading(true);
      setError('');
      try {
        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth() + 1;
        
        // Fetch attendance data for the selected month
        const attendanceResponse = await axios.get(`/api/attendance/employee/${employeeId}/month?year=${year}&month=${month}`);
        
        // Calculate payroll based on attendance
        const presentDays = attendanceResponse.data.filter(a => a.status === 'PRESENT').length;
        const leaveDays = attendanceResponse.data.filter(a => a.status === 'LEAVE').length;
        const absentDays = attendanceResponse.data.filter(a => a.status === 'ABSENT').length;
        
        // Basic salary calculation (present days * daily wage)
        const basicSalary = presentDays * dailyWage;
        
        // Calculate deductions and net salary
        const payroll = {
          month: selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' }),
          presentDays,
          leaveDays,
          absentDays,
          dailyWage,
          basicSalary,
          totalDeductions: absentDays * dailyWage * 0.5, // Example: deduct half day wage for absent days
          netSalary: basicSalary - (absentDays * dailyWage * 0.5)
        };
        
        setPayrollData(payroll);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch payroll data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPayrollData();
  }, [employeeId, selectedMonth, dailyWage]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handlePrintPayslip = () => {
    window.print();
  };

  return (
    <Container fluid className="dashboard-container px-0">
      {/* Sidebar and Main Content Layout */}
      <Row className="g-0">
        {/* Sidebar (unchanged from your original code) */}
        <Col md={2} className="sidebar bg-dark text-white vh-100 sticky-top">
          {/* ... your existing sidebar code ... */}
          <div className="mt-4">
            <Button variant="outline-light" onClick={handleLogout} className="w-100">
              Logout
            </Button>
          </div>
        </Col>

        {/* Main Content Area */}
        <Col md={10} className="main-content p-4">
          <h2 className="mb-4">My Payroll</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}

          <div className="mb-4">
            <Form.Group>
              <Form.Label>Select Month</Form.Label>
              <DatePicker
                selected={selectedMonth}
                onChange={(date) => setSelectedMonth(date)}
                className="form-control"
                dateFormat="MMMM yyyy"
                showMonthYearPicker
              />
            </Form.Group>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : payrollData ? (
            <Card className="mb-4 printable-area">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5>Payroll for {payrollData.month}</h5>
                <Button variant="primary" onClick={handlePrintPayslip}>
                  <i className="bi bi-printer me-2"></i>Print Payslip
                </Button>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <h6 className="mb-3">Employee Information</h6>
                    <Table borderless>
                      <tbody>
                        <tr>
                          <th>Name:</th>
                          <td>{employeeName}</td>
                        </tr>
                        <tr>
                          <th>Employee ID:</th>
                          <td>{employeeId}</td>
                        </tr>
                        <tr>
                          <th>Pay Period:</th>
                          <td>{payrollData.month}</td>
                        </tr>
                      </tbody>
                    </Table>
                    
                    <h6 className="mt-4 mb-3">Attendance Summary</h6>
                    <Table bordered>
                      <tbody>
                        <tr>
                          <th>Present Days</th>
                          <td>{payrollData.presentDays}</td>
                        </tr>
                        <tr>
                          <th>Leave Days</th>
                          <td>{payrollData.leaveDays}</td>
                        </tr>
                        <tr>
                          <th>Absent Days</th>
                          <td>{payrollData.absentDays}</td>
                        </tr>
                        <tr>
                          <th>Daily Wage</th>
                          <td>₹{payrollData.dailyWage.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col md={6}>
                    <h6 className="mb-3">Salary Breakdown</h6>
                    <Table bordered>
                      <tbody>
                        <tr>
                          <th>Basic Salary</th>
                          <td>₹{payrollData.basicSalary.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <th>Total Deductions</th>
                          <td>₹{payrollData.totalDeductions.toFixed(2)}</td>
                        </tr>
                        <tr className="table-primary">
                          <th>Net Salary</th>
                          <td>₹{payrollData.netSalary.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ) : (
            <Alert variant="info">No payroll data available for selected month</Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default EmployeePayrollPage;