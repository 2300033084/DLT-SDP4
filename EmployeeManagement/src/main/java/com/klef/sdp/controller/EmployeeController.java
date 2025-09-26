package com.klef.sdp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.klef.sdp.model.Employee;
import com.klef.sdp.service.EmployeeService;

import java.util.List;
import java.util.Optional;

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
}
