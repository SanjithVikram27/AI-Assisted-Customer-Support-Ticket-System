import { useEffect, useState } from "react";
import api from "../services/api";

const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("ALL");

const DashboardPage = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    api.get("/tickets")
      .then(res => setTickets(res.data))
      .catch(err => console.error(err));
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
  const text = searchTerm.toLowerCase();

  const matchesSearch =
    ticket.summary.toLowerCase().includes(text) ||
    ticket.category.toLowerCase().includes(text) ||
    ticket.assignedTeam.toLowerCase().includes(text);

  const matchesStatus =
    statusFilter === "ALL" || ticket.status === statusFilter;

  return matchesSearch && matchesStatus;
});

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Ticket Dashboard</h2>

      <button
        onClick={() => (window.location.href = "/")}
        style={{ marginBottom: 20 }}
      >
        ⬅ Back to Chat
      </button>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Team</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.category}</td>
              <td>{t.priority}</td>
              <td>{t.assignedTeam}</td>
              <td>{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardPage;
