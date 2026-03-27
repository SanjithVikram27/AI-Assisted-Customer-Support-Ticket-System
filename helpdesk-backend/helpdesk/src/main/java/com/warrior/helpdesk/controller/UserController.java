package com.warrior.helpdesk.controller;

import com.warrior.helpdesk.dto.UserRequest;
import com.warrior.helpdesk.dto.UserResponse;
import com.warrior.helpdesk.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ─── POST /api/auth/register ─────────────────────────────────────────────────
    @PostMapping("/api/auth/register")
    public ResponseEntity<UserResponse> register(@RequestBody UserRequest request) {
        UserResponse user = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    // ─── POST /api/auth/login
    // ─────────────────────────────────────────────────────
    @PostMapping("/api/auth/login")
    public ResponseEntity<UserResponse> login(@RequestBody UserRequest request) {
        UserResponse user = userService.login(request);
        return ResponseEntity.ok(user);
    }

    // ─── GET /api/users (admin only — checked via X-ADMIN header) ────────────────
    @GetMapping("/api/users")
    public ResponseEntity<List<UserResponse>> getAllUsers(
            @RequestHeader(value = "X-ADMIN", defaultValue = "false") String isAdmin) {
        if (!"true".equals(isAdmin)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
