package com.warrior.helpdesk.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String username;

    private String password;

    private String role; // "USER" or "ADMIN" — set explicitly in service/builder

    private LocalDateTime createdAt;

    // Explicit all-args constructor required by @Builder when @AllArgsConstructor
    // is absent
    public User(Long id, String name, String username, String password,
            String role, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.password = password;
        this.role = role != null ? role : "USER";
        this.createdAt = createdAt;
    }
}
