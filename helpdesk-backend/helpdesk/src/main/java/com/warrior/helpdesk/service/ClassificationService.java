package com.warrior.helpdesk.service;

import com.warrior.helpdesk.enums.TicketCategory;
import com.warrior.helpdesk.enums.SupportTeam;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassificationService {

    // 🔹 BILLING / PAYMENTS
    private static final List<String> BILLING_KEYWORDS = List.of(
            "payment", "paid", "refund", "refunded", "billing", "bill",
            "invoice", "charged", "chargeback", "deducted", "transaction",
            "upi", "credit card", "debit card", "net banking", "wallet",
            "emi", "subscription", "pricing", "amount"
    );

    // 🔹 TECHNICAL ISSUES
    private static final List<String> TECHNICAL_KEYWORDS = List.of(
            "error", "crash", "bug", "issue", "problem", "not working",
            "failed", "failure", "loading", "stuck", "freeze", "hang",
            "timeout", "server down", "slow", "lag", "glitch",
            "exception", "blank screen", "response time"
    );

    // 🔹 ACCOUNT / ACCESS
    private static final List<String> ACCOUNT_KEYWORDS = List.of(
            "login", "logout", "sign in", "sign out", "password",
            "username", "account", "profile", "locked", "blocked",
            "disabled", "verification", "otp", "authentication",
            "authorization", "email change", "mobile change",
            "reset password", "credentials", "security"
    );

    // 🎯 Detect category from conversation summary
    public TicketCategory detectCategory(String summary) {
        String text = summary.toLowerCase();

        if (containsAny(text, BILLING_KEYWORDS)) {
            return TicketCategory.BILLING;
        }

        if (containsAny(text, ACCOUNT_KEYWORDS)) {
            return TicketCategory.ACCOUNT;
        }

        if (containsAny(text, TECHNICAL_KEYWORDS)) {
            return TicketCategory.TECHNICAL;
        }

        return TicketCategory.GENERAL;
    }


    // 🎯 Assign support team
    public SupportTeam assignTeam(TicketCategory category) {
        return switch (category) {
            case BILLING -> SupportTeam.PAYMENTS;
            case TECHNICAL -> SupportTeam.TECH_SUPPORT;
            case ACCOUNT -> SupportTeam.ACCOUNT_SUPPORT;
            default -> SupportTeam.GENERAL_SUPPORT;
        };
    }

    // 🧠 Utility: checks keyword presence
    private boolean containsAny(String text, List<String> keywords) {
        return keywords.stream().anyMatch(text::contains);
    }
}
