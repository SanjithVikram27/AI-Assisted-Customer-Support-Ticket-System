package com.warrior.helpdesk.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ConversationMemoryService {

    private static final int MAX_MESSAGES = 10;

    // sessionId → messages
    private final Map<String, List<String>> memory = new HashMap<>();

    public void addMessage(String sessionId, String message) {
        memory.putIfAbsent(sessionId, new ArrayList<>());
        List<String> messages = memory.get(sessionId);

        messages.add(message);

        // Keep memory small
        if (messages.size() > MAX_MESSAGES) {
            messages.remove(0);
        }
    }

    public String getConversationContext(String sessionId) {
        List<String> messages = memory.getOrDefault(sessionId, List.of());
        return String.join("\n", messages);
    }
}
