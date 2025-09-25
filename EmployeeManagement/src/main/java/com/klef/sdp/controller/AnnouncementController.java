package com.klef.sdp.controller;

import com.klef.sdp.model.Announcement;
import com.klef.sdp.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    // Endpoint for Super Admin to create a new announcement
    @PostMapping("/create")
    public ResponseEntity<String> createAnnouncement(@RequestBody Announcement announcement) {
        announcementService.save(announcement);
        return ResponseEntity.ok("Announcement created successfully.");
    }

    // Endpoint for all roles to view announcements
    @GetMapping
    public ResponseEntity<List<Announcement>> getAllAnnouncements() {
        List<Announcement> announcements = announcementService.getAllAnnouncements();
        return ResponseEntity.ok(announcements);
    }
}
