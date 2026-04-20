package com.warrior.helpdesk.service;

import com.warrior.helpdesk.entity.Notification;
import com.warrior.helpdesk.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    // ─── CREATE ───────────────────────────────────────────────────────────────
    public Notification createNotification(String username, String message) {
        System.out.println("[NOTIFICATION] Creating notification for user: " + username);
        System.out.println("[NOTIFICATION] Message: " + message);

        Notification notification = Notification.builder()
                .username(username)
                .message(message)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        Notification saved = notificationRepository.save(notification);
        System.out.println("[NOTIFICATION] ✅ Saved with ID: " + saved.getId());
        return saved;
    }

    // ─── GET USER NOTIFICATIONS ──────────────────────────────────────────────
    public List<Notification> getUserNotifications(String username) {
        return notificationRepository.findByUsernameOrderByCreatedAtDesc(username);
    }

    // ─── MARK AS READ ────────────────────────────────────────────────────────
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + notificationId));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}
