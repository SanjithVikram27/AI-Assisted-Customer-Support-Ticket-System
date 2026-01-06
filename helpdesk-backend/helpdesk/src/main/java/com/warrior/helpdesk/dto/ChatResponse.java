package com.warrior.helpdesk.dto;

import com.warrior.helpdesk.enums.SupportTeam;

public class ChatResponse {

    private String message;
    private boolean ticketCreated;
    private SupportTeam assignedTeam;

    public static ChatResponse chat(String msg) {
        ChatResponse r = new ChatResponse();
        r.message = msg;
        r.ticketCreated = false;
        return r;
    }

    public static ChatResponse ticket(String msg, SupportTeam team) {
        ChatResponse r = new ChatResponse();
        r.message = msg;
        r.ticketCreated = true;
        r.assignedTeam = team;
        return r;
    }

    public String getMessage() { return message; }
    public boolean isTicketCreated() { return ticketCreated; }
    public SupportTeam getAssignedTeam() { return assignedTeam; }
}
