package com.warrior.helpdesk.dto;

import com.warrior.helpdesk.enums.*;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TicketResponse {

    private Long id;
    private String username;
    private String summary;

    private TicketPriority priority;
    private TicketCategory category;
    private SupportTeam assignedTeam;

    private TicketStatus status;   // ✅ ENUM
}
