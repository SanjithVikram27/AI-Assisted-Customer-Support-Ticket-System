const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8081/api/v1"
    : "https://ai-assisted-customer-support-ticket.onrender.com/api/v1";

async function loadTickets() {
  const res = await fetch(`${API_BASE_URL}/tickets`);
  const tickets = await res.json();

  renderAnalytics(tickets);
  renderTickets(tickets);
}


/* ================= RENDER TICKETS ================= */

function renderTickets(tickets) {
  const container = document.getElementById("tickets");
  container.innerHTML = "";

  tickets.forEach(t => {
    const card = document.createElement("div");
    card.className = "ticket-card";

    // Open summary modal when card is clicked
    card.onclick = () => openTicketModal(t.summary);

    card.innerHTML = `
      <h3>#${t.id} - ${t.category}</h3>

      <p><strong>Priority:</strong>
        <span class="badge ${t.priority.toLowerCase()}">
          ${t.priority}
        </span>
      </p>

      <p><strong>Status:</strong>
        <span class="${t.status.toLowerCase()}">
          ${t.status}
        </span>
      </p>

      <p><strong>Team:</strong> ${t.assignedTeam}</p>

      ${
        t.status === "OPEN"
          ? `<button class="resolve-btn"
                onclick="event.stopPropagation(); resolveWithAdmin(${t.id})">
                Resolve
             </button>`
          : `<span class="closed-text">✔ Closed</span>`
      }
    `;

    container.appendChild(card);
  });
}

/* ================= ANALYTICS ================= */

function renderAnalytics(tickets) {
  const analytics = document.getElementById("analytics");

  const total = tickets.length;
  const open = tickets.filter(t => t.status === "OPEN").length;
  const closed = tickets.filter(t => t.status === "CLOSED").length;
  const high = tickets.filter(t => t.priority === "HIGH").length;

  analytics.innerHTML = `
    <div class="analytics-card">
      <h2>${total}</h2>
      <span>Total Tickets</span>
    </div>
    <div class="analytics-card">
      <h2>${open}</h2>
      <span>Open</span>
    </div>
    <div class="analytics-card">
      <h2>${closed}</h2>
      <span>Closed</span>
    </div>
    <div class="analytics-card">
      <h2>${high}</h2>
      <span>High Priority</span>
    </div>
  `;
}

/* ================= ADMIN RESOLVE FLOW ================= */

function resolveWithAdmin(ticketId) {
  // store ticket id temporarily
  sessionStorage.setItem("resolveTicketId", ticketId);

  // go to admin login page
  window.location.href = "admin-login.html";
}

/* ================= MODAL ================= */

function openTicketModal(summary) {
  document.getElementById("modalSummaryText").innerText = summary;
  document.getElementById("ticketModal").style.display = "flex";
}

function closeTicketModal() {
  document.getElementById("ticketModal").style.display = "none";
}

/* ================= NAVIGATION ================= */

function goBack() {
  window.location.href = "/";
}

/* ================= INIT ================= */

loadTickets();
