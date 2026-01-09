import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api/v1",
});

/* ===========================
   CHAT API (TEXT)
=========================== */
export const sendMessage = (message) =>
  api.post("/chat", message, {
    headers: {
      "Content-Type": "text/plain",
    },
  });

/* ===========================
   TICKETS API (JSON)
=========================== */
export const fetchAllTickets = () =>
  api.get("/tickets");

export const fetchTicketById = (id) =>
  api.get(`/tickets/${id}`);

export default api;
