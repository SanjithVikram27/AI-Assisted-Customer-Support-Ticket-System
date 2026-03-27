/* ===================================================
   DASHBOARD MAIN SCRIPT — Admin only
   Restore original UI + click-ticket-for-details
=================================================== */

const API_BASE_URL =
    window.location.hostname === 'localhost'
        ? 'http://localhost:8081/api/v1'
        : 'https://ai-assisted-customer-support-ticket.onrender.com/api/v1';

const AUTH_BASE_URL =
    window.location.hostname === 'localhost'
        ? 'http://localhost:8081'
        : 'https://ai-assisted-customer-support-ticket.onrender.com';

// ─── Boot ─────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    const adminName = localStorage.getItem('adminLoggedIn') || 'Admin';
    document.getElementById('adminGreeting').textContent = '👋 ' + adminName;
    loadTickets();
    loadUsers();
});

// ─── LOGOUT ──────────────────────────────────────────────────────────────────
function adminLogout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.replace('index.html');
}

// ─── LOAD TICKETS ────────────────────────────────────────────────────────────
async function loadTickets() {
    const grid = document.getElementById('ticketGrid');

    try {
        const res = await fetch(`${API_BASE_URL}/tickets`);
        const tickets = await res.json();

        // Update analytics
        document.getElementById('totalCount').textContent = tickets.length;
        document.getElementById('openCount').textContent = tickets.filter(t => t.status === 'OPEN').length;
        document.getElementById('closedCount').textContent = tickets.filter(t => t.status === 'CLOSED').length;
        document.getElementById('highCount').textContent = tickets.filter(t => t.priority === 'HIGH').length;

        grid.innerHTML = '';

        if (tickets.length === 0) {
            grid.innerHTML = '<p style="padding:24px;color:rgba(200,190,240,0.5);">No tickets yet.</p>';
            return;
        }

        // Sort newest first
        tickets.sort((a, b) => b.id - a.id).forEach(t => renderCard(t, grid));

    } catch (err) {
        grid.innerHTML = '<p style="padding:24px;color:#ff8888;">⚠️ Could not load tickets. Is the backend running?</p>';
        console.error(err);
    }
}

function renderCard(t, container) {
    const card = document.createElement('div');
    card.className = 'ticket-card';
    card.style.cursor = 'pointer';

    const priorityClass = (t.priority || 'MEDIUM').toLowerCase();
    const isClosed = t.status === 'CLOSED';

    card.innerHTML = `
    <h3>#${t.id} — ${t.category || '—'}</h3>
    <p><strong>Priority:</strong> <span class="badge ${priorityClass}">${t.priority || '—'}</span></p>
    <p><strong>Status:</strong> ${isClosed
            ? '<span class="closed-text">✅ Closed</span>'
            : '<span style="color:#88c0ff;font-weight:700;">🔵 Open</span>'}</p>
    <p><strong>Team:</strong> ${t.assignedTeam || '—'}</p>
    <p><strong>Submitted by:</strong> ${t.createdBy || '—'}</p>
    <p style="font-size:0.75rem;color:rgba(200,190,240,0.5);margin-top:8px;">🖱 Click to view details</p>
  `;

    // Click card → open detail modal
    card.addEventListener('click', () => openTicketModal(t));

    container.appendChild(card);
}

// ─── TICKET DETAIL MODAL ─────────────────────────────────────────────────────
function openTicketModal(t) {
    const isClosed = t.status === 'CLOSED';
    const createdDate = t.createdAt
        ? new Date(t.createdAt).toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })
        : '—';

    document.getElementById('modalContent').innerHTML = `
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:5px 12px 5px 0;color:rgba(214,194,143,0.75);font-weight:700;white-space:nowrap;">Ticket ID</td>    <td>#${t.id}</td></tr>
      <tr><td style="padding:5px 12px 5px 0;color:rgba(214,194,143,0.75);font-weight:700;white-space:nowrap;">Category</td>     <td>${t.category || '—'}</td></tr>
      <tr><td style="padding:5px 12px 5px 0;color:rgba(214,194,143,0.75);font-weight:700;white-space:nowrap;">Priority</td>     <td><span class="badge ${(t.priority || 'medium').toLowerCase()}">${t.priority || '—'}</span></td></tr>
      <tr><td style="padding:5px 12px 5px 0;color:rgba(214,194,143,0.75);font-weight:700;white-space:nowrap;">Status</td>       <td>${isClosed ? '✅ Closed' : '🔵 Open'}</td></tr>
      <tr><td style="padding:5px 12px 5px 0;color:rgba(214,194,143,0.75);font-weight:700;white-space:nowrap;">Assigned Team</td><td>${t.assignedTeam || '—'}</td></tr>
      <tr><td style="padding:5px 12px 5px 0;color:rgba(214,194,143,0.75);font-weight:700;white-space:nowrap;">Submitted By</td> <td>${t.createdBy || '—'}</td></tr>
      <tr><td style="padding:5px 12px 5px 0;color:rgba(214,194,143,0.75);font-weight:700;white-space:nowrap;">Date</td>         <td>${createdDate}</td></tr>
      <tr><td style="padding:5px 12px 5px 0;color:rgba(214,194,143,0.75);font-weight:700;white-space:nowrap;vertical-align:top;">Issue</td>
          <td style="font-style:italic;color:#f7d774;font-size:1rem;font-weight:600;line-height:1.6;">"${t.summary || '—'}"</td></tr>
    </table>
    ${isClosed ? `
      <div style="margin-top:16px;padding:12px 16px;background:rgba(212,175,55,0.08);border:1px solid rgba(212,175,55,0.25);border-left:3px solid #d4af37;border-radius:12px;">
        <div style="font-size:0.7rem;font-weight:700;color:rgba(212,175,55,0.55);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;">✅ Resolution Info</div>
        <div style="font-size:0.85rem;color:rgba(255,240,190,0.85);">
          Closed by <strong style="color:#f7d774;">Admin ${t.closedBy || 'admin'}</strong>
          ${t.closedAt
                ? ` on <strong style="color:#f7d774;">${new Date(t.closedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong>`
                : ''}
        </div>
      </div>` : ''}
  `;

    // Action buttons
    const actions = document.getElementById('modalActions');
    actions.innerHTML = '';

    if (!isClosed) {
        const resolveBtn = document.createElement('button');
        resolveBtn.className = 'resolve-btn';
        resolveBtn.textContent = '🔒 Resolve Ticket';
        resolveBtn.onclick = () => triggerResolve(t.id);
        actions.appendChild(resolveBtn);
    }

    const closeBtn = document.createElement('button');
    closeBtn.className = 'closed-text';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.border = 'none';
    closeBtn.textContent = '← Back';
    closeBtn.onclick = closeModal;
    actions.appendChild(closeBtn);

    document.getElementById('ticketModal').style.display = 'flex';
}

function closeTicketModal(event) {
    // Close only if clicking the backdrop (not the modal-box itself)
    if (event && event.target !== document.getElementById('ticketModal')) return;
    document.getElementById('ticketModal').style.display = 'none';
}

// Called by ← Back and ✕ buttons (no event guard needed)
function closeModal() {
    document.getElementById('ticketModal').style.display = 'none';
}

// ─── RESOLVE FLOW (original: redirect through admin-login → confirm-resolve) ──
function triggerResolve(ticketId) {
    sessionStorage.setItem('resolveTicketId', ticketId);
    window.location.href = 'admin-login.html';
}

// ─── LOAD USERS ──────────────────────────────────────────────────────────────
async function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    try {
        const res = await fetch(`${AUTH_BASE_URL}/api/users`, {
            headers: { 'X-ADMIN': 'true' }
        });

        if (!res.ok) throw new Error('Status ' + res.status);

        const users = await res.json();
        if (!users || users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="padding:20px;color:rgba(200,190,240,0.5);text-align:center;">No registered users yet.</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        users.forEach((u, i) => {
            const date = u.createdAt
                ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                : '—';
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td style="padding:12px 16px;">${i + 1}</td>
        <td style="padding:12px 16px;">${u.name || '—'}</td>
        <td style="padding:12px 16px;font-family:monospace;">${u.username || '—'}</td>
        <td style="padding:12px 16px;"><span class="badge low">${u.role || 'USER'}</span></td>
        <td style="padding:12px 16px;">${date}</td>
      `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        // Fallback to localStorage (Phase 1 users)
        try {
            const raw = localStorage.getItem('users');
            const users = raw ? JSON.parse(raw) : [];
            if (users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="padding:20px;color:rgba(200,190,240,0.5);text-align:center;">No users found.</td></tr>';
                return;
            }
            tbody.innerHTML = '';
            users.forEach((u, i) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
          <td style="padding:12px 16px;">${i + 1}</td>
          <td style="padding:12px 16px;">${u.name || '—'}</td>
          <td style="padding:12px 16px;font-family:monospace;">${u.username || '—'}</td>
          <td style="padding:12px 16px;"><span class="badge low">USER</span></td>
          <td style="padding:12px 16px;">—</td>
        `;
                tbody.appendChild(tr);
            });
        } catch { /* silent */ }
    }
}
