package com.klef.sdp.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.sdp.model.SuperAdmin;
import com.klef.sdp.repository.SuperAdminRepo;

@Service
public class SuperAdminService {
    @Autowired
    private SuperAdminRepo repo;

    public SuperAdmin findByEmail(String email) {
        return repo.findByEmail(email);
    }

    // You can add other service methods here if needed, like addSuperAdmin, etc.
}
