package com.klef.sdp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.sdp.model.Manager;
import com.klef.sdp.repository.ManagerRepo;



@Service
public class ManagerService {

	@Autowired
	private ManagerRepo repo;
    
	public void addManager(Manager manager) {
		repo.save(manager);
	}
    
	public List<Manager> getManagers() {
		return repo.findAll();
	}
    
	public Manager findByEmail(String email) {
	    return repo.findByEmail(email);
	}

    public Manager findById(Long id) {
        Optional<Manager> optionalManager = repo.findById(id);
        return optionalManager.orElse(null);
    }
    
    public void updateManager(Manager manager) {
        repo.save(manager);
    }
    
    public void deleteManager(Long id) {
        repo.deleteById(id);
    }
}
