package com.klef.sdp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klef.sdp.model.SuperAdmin;

@Repository
public interface SuperAdminRepo extends JpaRepository<SuperAdmin, Long> {
    SuperAdmin findByEmail(String email);
}
