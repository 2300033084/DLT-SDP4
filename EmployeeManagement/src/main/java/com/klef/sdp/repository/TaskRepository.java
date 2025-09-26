package com.klef.sdp.repository;

import com.klef.sdp.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    // Corrected method name below
    List<Task> findByEmployee_Id(Long employeeId);
}