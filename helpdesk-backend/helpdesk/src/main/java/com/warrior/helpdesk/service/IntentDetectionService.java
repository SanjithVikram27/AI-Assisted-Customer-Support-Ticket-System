package com.warrior.helpdesk.service;

import com.warrior.helpdesk.enums.UserIntent;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IntentDetectionService {

    private static final List<String> GREETINGS = List.of(
            "hi", "hello", "hey", "hai", "What's up?",
            "good morning", "good afternoon", "good evening"
    );

    private static final List<String> KNOWLEDGE_PATTERNS = List.of(
            "what is", "who is", "explain", "define",
            "how does", "why", "tell me about"
    );

    public UserIntent detect(String message) {

        if (message == null || message.trim().isEmpty()) {
            return UserIntent.GREETING;
        }

        String text = message.toLowerCase().trim();

        // 1️⃣ PURE GREETING ONLY
        if (isPureGreeting(text)) {
            return UserIntent.GREETING;
        }

        // 2️⃣ KNOWLEDGE / THEORY
        if (isKnowledge(text)) {
            return UserIntent.KNOWLEDGE;
        }

        // 3️⃣ EVERYTHING ELSE IS SUPPORT
        return UserIntent.SUPPORT;
    }

    private boolean isPureGreeting(String text) {
        return GREETINGS.stream().anyMatch(
                g -> text.equals(g)
                        || text.equals(g + "!")
                        || text.equals(g + ".")
        );
    }

    private boolean isKnowledge(String text) {
        return KNOWLEDGE_PATTERNS.stream().anyMatch(text::startsWith);
    }
}
