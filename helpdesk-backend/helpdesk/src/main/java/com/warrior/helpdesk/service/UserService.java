package com.warrior.helpdesk.service;

import com.warrior.helpdesk.dto.UserRequest;
import com.warrior.helpdesk.dto.UserResponse;
import com.warrior.helpdesk.entity.User;
import com.warrior.helpdesk.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ─── REGISTER ────────────────────────────────────────────────────────────────
    public UserResponse register(UserRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is required.");
        }
        if (request.getPassword() == null || request.getPassword().length() < 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 8 characters.");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken.");
        }

        User user = User.builder()
                .name(request.getName())
                .username(request.getUsername())
                .password(request.getPassword()) // plain text for now — no JWT requirement
                .role("USER")
                .createdAt(LocalDateTime.now())
                .build();

        return mapToResponse(userRepository.save(user));
    }

    // ─── LOGIN
    // ────────────────────────────────────────────────────────────────────
    public UserResponse login(UserRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid username or password."));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password.");
        }

        return mapToResponse(user);
    }

    // ─── GET ALL USERS (admin)
    // ────────────────────────────────────────────────────
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ─── MAPPER ──────────────────────────────────────────────────────────────────
    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
