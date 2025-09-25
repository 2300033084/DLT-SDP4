package com.klef.sdp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klef.sdp.model.Employee;



@Repository
public interface EmployeeRepo extends JpaRepository<Employee, Long>{
    List<Employee> findByManagerId(Long managerId);

	Employee findByEmail(String email);

}
