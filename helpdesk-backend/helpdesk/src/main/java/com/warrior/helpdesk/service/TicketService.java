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

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
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

    // ─── CLOSE
    // ────────────────────────────────────────────────────────────────────────────
    public void closeTicket(Long id, String closedBy) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));
        ticket.setStatus(TicketStatus.CLOSED);
        ticket.setClosedBy(closedBy != null && !closedBy.isBlank() ? closedBy : "admin");
        ticket.setClosedAt(LocalDateTime.now());
        ticketRepository.save(ticket);
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
