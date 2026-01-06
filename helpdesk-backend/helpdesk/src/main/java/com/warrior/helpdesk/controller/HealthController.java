package com.warrior.helpdesk.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
    @GetMapping("/health")
    public String healthCheck(){
        return "Helpdesk Backend is running";
    }
}
