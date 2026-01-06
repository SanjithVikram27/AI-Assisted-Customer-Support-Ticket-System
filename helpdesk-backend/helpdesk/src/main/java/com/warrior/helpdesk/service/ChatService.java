package com.warrior.helpdesk.service;

import com.warrior.helpdesk.dto.TicketRequest;
import com.warrior.helpdesk.enums.*;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final GeminiService geminiService;
    private final ClassificationService classificationService;
    private final TicketService ticketService;

    public ChatService(
            GeminiService geminiService,
            ClassificationService classificationService,
            TicketService ticketService
    ) {
        this.geminiService = geminiService;
        this.classificationService = classificationService;
        this.ticketService = ticketService;
    }

    public String chat(String message) {

        if (message == null || message.isBlank()) {
            return geminiService.generateResponse(
                    "User said nothing. Greet and ask how to help."
            );
        }

        // 🧠 1️⃣ AI ALWAYS RESPONDS FIRST
        String aiReply = geminiService.generateResponse(message);

        // 🧠 2️⃣ Decide silently if this is a support issue
        TicketCategory category = classificationService.detectCategory(message);

        // GENERAL = not a support issue → pure AI
        if (category == TicketCategory.GENERAL) {
            return aiReply;
        }

        // 🧠 3️⃣ Support issue → create ticket silently
        SupportTeam team = classificationService.assignTeam(category);
        TicketPriority priority = detectPriority(message, category);

        TicketRequest ticket = TicketRequest.builder()
                .username("chat-user")
                .summary(message)
                .category(category)
                .priority(priority)
                .assignedTeam(team)
                .build();

        ticketService.createTicket(ticket);

        // 🧠 4️⃣ Merge AI + system action (THIS IS THE MAGIC)
        return aiReply + "\n\n"
                + "✅ I've created a **"
                + category.name().toLowerCase()
                + "** support ticket and routed it to our **"
                + team.name().replace("_", " ").toLowerCase()
                + "** team.";
    }

    private TicketPriority detectPriority(String text, TicketCategory category) {

        text = text.toLowerCase();

        if (text.contains("urgent")
                || text.contains("asap")
                || text.contains("blocked")
                || text.contains("fraud")
                || text.contains("deducted")) {
            return TicketPriority.HIGH;
        }

        if (text.contains("slow")
                || text.contains("delay")
                || text.contains("timeout")) {
            return TicketPriority.MEDIUM;
        }

        return category == TicketCategory.GENERAL
                ? TicketPriority.LOW
                : TicketPriority.MEDIUM;
    }
}
