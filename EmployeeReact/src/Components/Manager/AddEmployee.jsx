import React, { useState } from "react";
import axios from "axios";

const AddEmployee = ({ managerId }) => {
  console.log("Received Manager ID in AddEmployee:", managerId);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleAddEmployee = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/employees/addEmployee?managerId=${managerId}`,
        {
          name,
          email,
          password,
          manager: managerId ? { id: managerId } : null, // Ensure correct structure
        },
        {
          headers: { "Content-Type": "application/json" }, // Explicitly set JSON headers
        }
      );

      console.log("Employee added successfully:", response.data);
      setMessage("Employee added successfully!");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(managerId);
      console.error(
        "Error adding employee:",
        error.response?.data || error.message
      );
      setMessage("Failed to add employee. Please try again.");
    }
  };

  return (
    <div className="employee-card p-4 mt-3 shadow">
      <h2 className="text-center text-success">Add Employee</h2>
      {message && (
        <div className={`alert ${message.includes("successfully") ? "alert-success" : "alert-danger"} text-center`}>
          {message}
        </div>
      )}
      <div className="mb-3">
        <label className="form-label">Employee Name</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter employee name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Employee Email</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter employee email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="btn btn-primary w-100" onClick={handleAddEmployee}>
        Add Employee
      </button>
    </div>
  );
};

export default AddEmployee;