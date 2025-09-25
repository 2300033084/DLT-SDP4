package com.klef.sdp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.klef.sdp.model.Employee;
import com.klef.sdp.model.Manager;
import com.klef.sdp.model.SuperAdmin;
import com.klef.sdp.service.EmployeeService;
import com.klef.sdp.service.ManagerService;
import com.klef.sdp.service.SuperAdminService;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/auth")
public class LoginController {

    @Autowired
    private ManagerService managerService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private SuperAdminService superAdminService; // Added

    @PostMapping("/login")
    public Map<String, Object> login(@RequestParam String email, @RequestParam String password) {
        Map<String, Object> response = new HashMap<>();

        // Check in Super Admin Table
        SuperAdmin superAdmin = superAdminService.findByEmail(email);
        if (superAdmin != null && superAdmin.getPassword().equals(password)) {
            response.put("id", superAdmin.getId());
            response.put("role", "SUPER_ADMIN");
            response.put("name", "Super Admin"); // Added a name for the super admin
            return response;
        }

        // Check in Manager Table
        Manager manager = managerService.findByEmail(email);
        if (manager != null && manager.getPassword().equals(password)) {
            response.put("id", manager.getId());
            response.put("role", "MANAGER");
            response.put("name", manager.getName()); // Added name
            return response;
        }

        // Check in Employee Table
        Employee employee = employeeService.findByEmail(email);
        if (employee != null && employee.getPassword().equals(password)) {
            if (employee.getStatus() == com.klef.sdp.enums.Status.ACCEPTED) { // Ensure employee is approved
                response.put("id", employee.getId());
                response.put("role", "EMPLOYEE");
                response.put("name", employee.getName()); // Added name
                return response;
            } else {
                response.put("error", "Your account is pending/rejected. Contact admin.");
                return response;
            }
        }

        // Invalid Login
        response.put("error", "Invalid credentials.");
        return response;
    }
}
