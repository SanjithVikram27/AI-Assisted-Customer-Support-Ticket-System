package com.warrior.helpdesk.service;

import com.warrior.helpdesk.model.ChatSession;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ChatSessionService {

    private final Map<String, ChatSession> sessions = new HashMap<>();

    public ChatSession getSession(String userId) {
        return sessions.computeIfAbsent(userId, k -> new ChatSession());
    }

    public void clearSession(String userId) {
        sessions.remove(userId);
    }
}
