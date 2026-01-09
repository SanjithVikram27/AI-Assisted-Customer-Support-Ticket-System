package com.warrior.helpdesk.service;

import com.warrior.helpdesk.dto.TicketRequest;
import com.warrior.helpdesk.dto.TicketResponse;
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

        TicketResponse savedTicket = ticketService.createTicket(ticket);

// 4️⃣ 🔥 BUILD FINAL RESPONSE WITH PARAGRAPH SEPARATION
        String ticketMessage =
                "✅🎫 I've created a 🔹" + category.name().toLowerCase() +
                        "🔹 support ticket and routed it to our 🔸" +
                        team.name().replace("_", " ").toLowerCase() +
                        "🔸 team.";

        return aiReply + "\n\n" + ticketMessage;
    }

    private TicketPriority detectPriority(String text, TicketCategory category) {

        text = text.toLowerCase();

        /* 🔴 HIGH PRIORITY — business blocking / security / money / access */
        if (
            // Urgency & severity
                text.contains("urgent") ||
                        text.contains("asap") ||
                        text.contains("immediately") ||
                        text.contains("critical") ||
                        text.contains("emergency") ||

                        // Access / blocked
                        text.contains("blocked") ||
                        text.contains("locked") ||
                        text.contains("cannot login") ||
                        text.contains("can't login") ||
                        text.contains("login failed") ||
                        text.contains("access denied") ||

                        // Security & fraud
                        text.contains("fraud") ||
                        text.contains("hacked") ||
                        text.contains("breach") ||
                        text.contains("suspicious") ||
                        text.contains("unauthorized") ||
                        text.contains("security issue") ||

                        // Payment / money loss
                        text.contains("money deducted") ||
                        text.contains("amount deducted") ||
                        text.contains("charged twice") ||
                        text.contains("double charged") ||
                        text.contains("payment failed") ||
                        text.contains("refund not received") ||
                        text.contains("transaction failed") ||
                        text.contains("balance missing") ||

                        // App completely down
                        text.contains("app not working") ||
                        text.contains("system down") ||
                        text.contains("service unavailable") ||
                        text.contains("crash") ||
                        text.contains("keeps crashing")
        ) {
            return TicketPriority.HIGH;
        }

        /* 🟡 MEDIUM PRIORITY — degraded experience / partial failure */
        if (
            // Performance
                text.contains("slow") ||
                        text.contains("delay") ||
                        text.contains("lag") ||
                        text.contains("loading") ||
                        text.contains("timeout") ||
                        text.contains("takes too long") ||

                        // Feature issues
                        text.contains("not responding") ||
                        text.contains("not opening") ||
                        text.contains("sometimes works") ||
                        text.contains("intermittent") ||
                        text.contains("fails occasionally") ||

                        // Data / sync issues
                        text.contains("not updating") ||
                        text.contains("sync issue") ||
                        text.contains("data mismatch") ||
                        text.contains("incorrect data") ||

                        // Non-blocking account issues
                        text.contains("profile issue") ||
                        text.contains("details not updating") ||
                        text.contains("settings not saved")
        ) {
            return TicketPriority.MEDIUM;
        }

        /* 🟢 LOW PRIORITY — informational / cosmetic / general */
        if (
                text.contains("how to") ||
                        text.contains("guide") ||
                        text.contains("help me understand") ||
                        text.contains("clarification") ||
                        text.contains("question") ||
                        text.contains("doubt") ||
                        text.contains("information") ||
                        text.contains("feature request") ||
                        text.contains("suggestion") ||
                        text.contains("enhancement") ||
                        text.contains("ui issue") ||
                        text.contains("cosmetic")
        ) {
            return TicketPriority.LOW;
        }

        /* 🧠 SMART DEFAULT */
        return category == TicketCategory.GENERAL
                ? TicketPriority.LOW
                : TicketPriority.MEDIUM;
    }

}
