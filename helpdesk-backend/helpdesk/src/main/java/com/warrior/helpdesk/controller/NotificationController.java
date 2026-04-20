package com.warrior.helpdesk.controller;

import com.warrior.helpdesk.entity.Notification;
import com.warrior.helpdesk.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // ─── GET NOTIFICATIONS FOR A USER ────────────────────────────────────────
    @GetMapping("/{username}")
    public List<Notification> getUserNotifications(@PathVariable String username) {
        return notificationService.getUserNotifications(username);
    }

    // ─── MARK A NOTIFICATION AS READ ─────────────────────────────────────────
    @PutMapping("/read/{id}")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}
