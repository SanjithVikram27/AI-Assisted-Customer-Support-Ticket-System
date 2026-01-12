package com.warrior.helpdesk.controller;

import com.warrior.helpdesk.dto.TicketResponse;
import com.warrior.helpdesk.entity.Ticket;
import com.warrior.helpdesk.service.TicketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")

public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // DASHBOARD: GET ALL TICKETS
    @GetMapping
    public List<TicketResponse> getAllTickets() {
        return ticketService.getAllTickets();
    }

    // OPTIONAL: GET TICKET BY ID
    @GetMapping("/{id}")
    public TicketResponse getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id);
    }

    @PutMapping("/{id}/close")
    public ResponseEntity<Void> closeTicket(
            @PathVariable Long id,
            @RequestHeader("X-ADMIN") String admin
    ) {
        // simple admin check for now
        if (!"true".equals(admin)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        ticketService.closeTicket(id);
        return ResponseEntity.ok().build();
    }


}

