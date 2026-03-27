package com.warrior.helpdesk.dto;

import com.warrior.helpdesk.enums.*;
import lombok.*;

import java.time.LocalDateTime;

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

    private TicketStatus status;
    private String createdBy; // ✅ submitting user
    private LocalDateTime createdAt; // ✅ when it was created
    private String closedBy; // ✅ admin who resolved
    private LocalDateTime closedAt; // ✅ when it was resolved
}
