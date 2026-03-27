package com.warrior.helpdesk.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ─── 404 — Resource not found ─────────────────────────────────────────────
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFound(
            ResourceNotFoundException ex) {
        return buildError(ex.getMessage(), 404, HttpStatus.NOT_FOUND);
    }

    // ─── ResponseStatusException (401, 409, 403, 400 etc.) ───────────────────
    // MUST be declared before the generic Exception handler to take priority
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleResponseStatus(
            ResponseStatusException ex) {
        return buildError(ex.getReason(), ex.getStatusCode().value(),
                HttpStatus.valueOf(ex.getStatusCode().value()));
    }

    // ─── Generic fallback — true 500s only ────────────────────────────────────
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        ex.printStackTrace();
        return buildError("Internal Server Error", 500, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ─── Helper ──────────────────────────────────────────────────────────────
    private ResponseEntity<Map<String, Object>> buildError(
            String message, int statusCode, HttpStatus httpStatus) {
        Map<String, Object> body = new HashMap<>();
        body.put("message", message);
        body.put("status", statusCode);
        body.put("timestamp", LocalDateTime.now());
        return ResponseEntity.status(httpStatus).body(body);
    }
}
