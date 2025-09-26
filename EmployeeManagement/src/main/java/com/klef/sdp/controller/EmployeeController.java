package com.klef.sdp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.klef.sdp.model.Employee;
import com.klef.sdp.model.Manager;
import com.klef.sdp.service.EmployeeService;

import java.util.List;
import java.util.Optional;
import com.klef.sdp.enums.Status;
//import com.klef.sdp.service.EmployeeService;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/employees") 
public class EmployeeController {
    
    @Autowired
    private EmployeeService employeeService;

    // Endpoint to fetch all employees under a specific manager
    @GetMapping("/docker")
    public String dockerTest()
    {
        return "Docker is working fine";
    }
    @GetMapping("/byManager/{managerId}")
    public ResponseEntity<List<Employee>> getEmployeesByManager(@PathVariable Long managerId) {
        List<Employee> employees = employeeService.getEmployeesByManager(managerId);
        return ResponseEntity.ok(employees);
    }
    
    // Endpoint to fetch employee profile by ID
    @GetMapping("/profile/{id}")
    public ResponseEntity<Employee> getEmployeeProfile(@PathVariable Long id) {
        Optional<Employee> employee = employeeService.getEmployeeById(id);
        return employee.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Endpoint to update employee profile by ID
    @PutMapping("/profile/{id}")
    public ResponseEntity<Employee> updateEmployeeProfile(
            @PathVariable Long id,
            @RequestBody Employee employeeDetails) {
        try {
            Employee updatedEmployee = employeeService.updateEmployeeProfile(id, employeeDetails);
            return ResponseEntity.ok(updatedEmployee);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); 
        }
    }
    @PostMapping("/addEmployee")
    public ResponseEntity<String> addEmployee(@RequestBody Employee employee, @RequestParam Long managerId) {
        // 1. Fetch Manager to link the relationship and trigger the @PrePersist logic for 'org'
        Manager manager = employeeService.findManagerById(managerId);
        if (manager == null) {
            return ResponseEntity.badRequest().body("Manager not found");
        }
        
        // 2. Set the relationship
        employee.setManager(manager);
        
        // 3. Save the new employee
        employeeService.addEmployee(employee);
        
        return ResponseEntity.ok("Employee added successfully!");
    }
    @PostMapping("/updateEmployeeStatus/{employeeId}")
public ResponseEntity<String> updateEmployeeStatus(
        @PathVariable Long employeeId,
        @RequestParam String status) {
    try {
        Employee employee = employeeService.getEmployeeById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Convert string to enum
        Status newStatus = Status.valueOf(status.toUpperCase());
        employee.setStatus(newStatus);

        employeeService.addEmployee(employee);


        return ResponseEntity.ok("Employee status updated to " + newStatus);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body("Invalid status value. Use PENDING, ACCEPTED, REJECTED, or DEACTIVATED.");
    } catch (Exception e) {
        return ResponseEntity.badRequest().body("Error updating employee status: " + e.getMessage());
    }
}

}

