package com.warrior.helpdesk.service;

import com.warrior.helpdesk.dto.TicketRequest;
import com.warrior.helpdesk.dto.TicketResponse;
import com.warrior.helpdesk.entity.Ticket;
import com.warrior.helpdesk.enums.TicketStatus;
import com.warrior.helpdesk.exception.ResourceNotFoundException;
import com.warrior.helpdesk.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final NotificationService notificationService;

    public TicketService(TicketRepository ticketRepository,
                         NotificationService notificationService) {
        this.ticketRepository = ticketRepository;
        this.notificationService = notificationService;
    }

    // ─── CREATE ───────────────────────────────────────────────────────────────
    public TicketResponse createTicket(TicketRequest request) {

        Ticket ticket = Ticket.builder()
                .username(request.getUsername())
                .summary(request.getSummary())
                .priority(request.getPriority())
                .category(request.getCategory())
                .assignedTeam(request.getAssignedTeam())
                .status(TicketStatus.OPEN)
                .createdAt(LocalDateTime.now())
                .createdBy(request.getCreatedBy())
                .build();

        return mapToResponse(ticketRepository.save(ticket));
    }

    // ─── GET ALL ──────────────────────────────────────────────────────────────
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ─── GET BY ID ────────────────────────────────────────────────────────────
    public TicketResponse getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));
        return mapToResponse(ticket);
    }

    // ─── GET BY USER ─────────────────────────────────────────────────────────
    public List<TicketResponse> getTicketsByUser(String username) {
        return ticketRepository.findByCreatedBy(username)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ─── CLOSE ────────────────────────────────────────────────────────────────
    public void closeTicket(Long id, String closedBy) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));
        ticket.setStatus(TicketStatus.CLOSED);
        String resolver = closedBy != null && !closedBy.isBlank() ? closedBy : "admin";
        ticket.setClosedBy(resolver);
        ticket.setClosedAt(LocalDateTime.now());
        ticketRepository.save(ticket);

        // 🔔 Notify the ticket creator
        // Fallback chain: createdBy → username (robust against null/blank)
        String recipient = ticket.getCreatedBy();
        if (recipient == null || recipient.isBlank() || "chat-user".equals(recipient)) {
            recipient = ticket.getUsername();
        }

        System.out.println("[NOTIFICATION DEBUG] Ticket #" + id + " closed by: " + resolver);
        System.out.println("[NOTIFICATION DEBUG] createdBy=" + ticket.getCreatedBy()
                + ", username=" + ticket.getUsername() + ", resolved recipient=" + recipient);

        if (recipient != null && !recipient.isBlank() && !"chat-user".equals(recipient)) {
            notificationService.createNotification(
                    recipient,
                    "Your ticket #" + id + " has been resolved by " + resolver
            );
            System.out.println("[NOTIFICATION DEBUG] ✅ Notification created for: " + recipient);
        } else {
            System.out.println("[NOTIFICATION DEBUG] ⚠️ Skipped — no valid recipient");
        }
    }

    // ─── MAPPER ───────────────────────────────────────────────────────────────
    private TicketResponse mapToResponse(Ticket ticket) {
        return TicketResponse.builder()
                .id(ticket.getId())
                .username(ticket.getUsername())
                .summary(ticket.getSummary())
                .priority(ticket.getPriority())
                .category(ticket.getCategory())
                .assignedTeam(ticket.getAssignedTeam())
                .status(ticket.getStatus())
                .createdBy(ticket.getCreatedBy())
                .createdAt(ticket.getCreatedAt())
                .closedBy(ticket.getClosedBy())
                .closedAt(ticket.getClosedAt())
                .build();
    }
}
