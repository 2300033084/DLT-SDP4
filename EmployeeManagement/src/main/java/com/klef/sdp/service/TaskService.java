package com.klef.sdp.service;

import com.klef.sdp.enums.TaskStatus;
import com.klef.sdp.model.Employee;
import com.klef.sdp.model.Task;
import com.klef.sdp.repository.EmployeeRepo;
import com.klef.sdp.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private EmployeeRepo employeeRepo;

    public Task save(Task task) {
        return taskRepository.save(task);
    }

    public Optional<Task> findById(Long id) {
        return taskRepository.findById(id);
    }
    
    public List<Task> getTasksByEmployeeId(Long employeeId) {
        return taskRepository.findByEmployeeId(employeeId);
    }

    public Task assignTaskToEmployee(Long employeeId, Task taskDetails) {
        Employee employee = employeeRepo.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + employeeId));

        taskDetails.setEmployee(employee);
        taskDetails.setStatus(TaskStatus.NOT_STARTED); // Set initial status
        return taskRepository.save(taskDetails);
    }

    public Task updateTaskStatus(Long taskId, TaskStatus newStatus) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
        task.setStatus(newStatus);
        return taskRepository.save(task);
    }
}
