package com.warrior.helpdesk.dto;

import com.warrior.helpdesk.enums.*;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TicketRequest {
    private String username;
    private String summary;
    private TicketPriority priority;
    private TicketCategory category;
    private SupportTeam assignedTeam;
}
