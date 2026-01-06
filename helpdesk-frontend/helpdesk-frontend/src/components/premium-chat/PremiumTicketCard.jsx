const PremiumTicketCard = ({ ticket }) => {
  return (
    <div className="premium-ticket ticket-animate">
      <div className="ticket-header">
        🎫 SUPPORT TICKET
      </div>

      <div className="ticket-divider" />

      <div className="ticket-row">
        <span>Ticket ID</span>
        <span>{ticket.id}</span>
      </div>

      <div className="ticket-row">
        <span>Category</span>
        <span>{ticket.category}</span>
      </div>

      <div className="ticket-row">
        <span>Priority</span>
        <span className={`priority ${ticket.priority.toLowerCase()}`}>
          {ticket.priority}
        </span>
      </div>

      <div className="ticket-row">
        <span>Status</span>
        <span className={`status ${ticket.status.toLowerCase()}`}>
          {ticket.status}
        </span>
      </div>

      <div className="ticket-divider" />

      <div className="ticket-footer">
        Assigned Team: {ticket.category} Support
      </div>
    </div>
  );
};

export default PremiumTicketCard;
