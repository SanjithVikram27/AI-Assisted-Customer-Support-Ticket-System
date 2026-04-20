package com.warrior.helpdesk.repository;

import com.warrior.helpdesk.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUsernameOrderByCreatedAtDesc(String username);

    long countByUsernameAndIsReadFalse(String username);
}
