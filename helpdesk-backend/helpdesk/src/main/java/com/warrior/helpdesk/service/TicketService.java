package com.warrior.helpdesk.service;

import com.warrior.helpdesk.dto.TicketRequest;
import com.warrior.helpdesk.dto.TicketResponse;
import com.warrior.helpdesk.entity.Ticket;
import com.warrior.helpdesk.enums.SupportTeam;
import com.warrior.helpdesk.enums.TicketCategory;
import com.warrior.helpdesk.enums.TicketStatus;
import com.warrior.helpdesk.repository.TicketRepository;
import com.warrior.helpdesk.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final ClassificationService classificationService;

    public TicketService(TicketRepository ticketRepository,
                         ClassificationService classificationService) {
        this.ticketRepository = ticketRepository;
        this.classificationService = classificationService;
    }

    // CREATE
    public TicketResponse createTicket(TicketRequest request) {

        TicketCategory category =
                classificationService.detectCategory(request.getSummary());

        SupportTeam team =
                classificationService.assignTeam(category);

        Ticket ticket = Ticket.builder()
                .username(request.getUsername())
                .summary(request.getSummary())
                .priority(request.getPriority())
                .category(category)
                .assignedTeam(team)
                .status(TicketStatus.OPEN)
                .createdAt(LocalDateTime.now())
                .build();

        Ticket savedTicket = ticketRepository.save(ticket);

        return mapToResponse(savedTicket);
    }

    // GET ALL
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public TicketResponse getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Ticket", "id", id)
                );

        return mapToResponse(ticket);
    }

    // MAPPER
    private TicketResponse mapToResponse(Ticket ticket) {
        return TicketResponse.builder()
                .id(ticket.getId())
                .username(ticket.getUsername())
                .summary(ticket.getSummary())
                .priority(ticket.getPriority())
                .category(ticket.getCategory())
                .assignedTeam(ticket.getAssignedTeam())
                .status(ticket.getStatus())
                .build();
    }

    public void closeTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Ticket", "id", id)
                );

        ticket.setStatus(TicketStatus.CLOSED);
        ticketRepository.save(ticket);
    }

}
