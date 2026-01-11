import axios from "axios";

/**
 * Axios instance
 * Base URL comes from environment variable
 * Works for BOTH localhost and production
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

/* ============================
   CHAT API
   POST /api/v1/chat
============================ */
export const sendMessage = (message) => {
  return api.post("/chat", message, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};

/* ============================
   TICKETS API
   GET /api/v1/tickets
============================ */
export const fetchAllTickets = () => {
  return api.get("/tickets");
};

/* ============================
   GET TICKET BY ID
   GET /api/v1/tickets/{id}
============================ */
export const fetchTicketById = (id) => {
  return api.get(`/tickets/${id}`);
};

export default api;
