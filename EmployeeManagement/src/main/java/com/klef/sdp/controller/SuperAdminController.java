package com.klef.sdp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.klef.sdp.model.Employee;
import com.klef.sdp.service.EmailService;
import com.klef.sdp.service.EmployeeService;
import com.klef.sdp.enums.Status; // Correct import for your custom Status enum

@CrossOrigin("*")
@RestController
public class SuperAdminController {
	@Autowired 
	private EmployeeService employeeservice;
	@Autowired
	private EmailService emailService;
	
    // This is the updated endpoint to handle both ACCEPTED and DEACTIVATED status changes.
	@PostMapping("/superadmin/updateEmployeeStatus/{id}")
	public ResponseEntity<String> updateEmployeeStatus(@PathVariable Long id, @RequestParam Status status) {
	    // The parameter `status` is already a valid enum, no conversion is needed.
	    Employee updatedEmployee = employeeservice.updateEmployeeStatus(id, status);

        // Send an email to the employee about the status change
        String subject = "Your Account Status Has Been Updated";
        String message = "Hello " + updatedEmployee.getName() + ",\n\n"
                + "Your account status has been updated to: " + updatedEmployee.getStatus() + ".\n"
                + "Please contact your manager for more details.\n\n"
                + "Best regards,\nAdmin Team";

        emailService.sendEmail(updatedEmployee.getEmail(), subject, message);
        
	    return ResponseEntity.ok("Employee status updated to " + status.toString() + " successfully.");
	}
}
