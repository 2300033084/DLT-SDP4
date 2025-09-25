package com.klef.sdp.controller;
import com.klef.sdp.enums.TaskStatus;
import com.klef.sdp.model.Task;
import com.klef.sdp.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.time.LocalDate;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    @Autowired
    private TaskService taskService;

    // Endpoint for a manager to create a task for a specific employee
    // It's a best practice to accept JSON payload in the request body
    @PostMapping(value = "/create/{employeeId}", consumes = "application/json")
    public ResponseEntity<Task> createTask(@PathVariable Long employeeId, @RequestBody Task task) {
        Task createdTask = taskService.assignTaskToEmployee(employeeId, task);
        return ResponseEntity.ok(createdTask);
    }
    
    // New endpoint to handle form-urlencoded data from the frontend
    // The @RequestParam annotation is used to extract data from form fields.
    @PostMapping("/create-form/{employeeId}")
    public ResponseEntity<Task> createTaskFromForm(
            @PathVariable Long employeeId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("dueDate") String dueDateString) {
        
        Task task = new Task();
        task.setTitle(title);
        task.setDescription(description);
        task.setDueDate(LocalDate.parse(dueDateString));
        
        Task createdTask = taskService.assignTaskToEmployee(employeeId, task);
        return ResponseEntity.ok(createdTask);
    }

    // Endpoint for an employee to view all their tasks
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Task>> getEmployeeTasks(@PathVariable Long employeeId) {
        List<Task> tasks = taskService.getTasksByEmployeeId(employeeId);
        return ResponseEntity.ok(tasks);
    }

    // Endpoint for an employee to update a task's status
    @PutMapping("/{taskId}/status")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable Long taskId, @RequestParam TaskStatus status) {
        Task updatedTask = taskService.updateTaskStatus(taskId, status);
        return ResponseEntity.ok(updatedTask);
    }
}
