import axios from "axios";

/**
 * Axios instance
 * Base URL comes from environment variable
 * Works for BOTH localhost and production
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000, // 🔥 IMPORTANT for Render cold start
});

/* ==============================
   CHAT API
   POST /api/v1/chat
================================ */
export const sendMessage = (message) => {
  // Attach logged-in username so backend can tag tickets
  const userRaw = localStorage.getItem("loggedInUser");
  const username = userRaw ? JSON.parse(userRaw).username : "guest";

  return api.post("/chat", message, {
    headers: {
      "Content-Type": "text/plain",
      "X-Username": username,
    },
  });
};

/* ==============================
   TICKETS API
   GET /api/v1/tickets
================================ */
export const fetchAllTickets = () => {
  return api.get("/tickets");
};

/* ==============================
   GET TICKET BY ID
   GET /api/v1/tickets/{id}
================================ */
export const fetchTicketById = (id) => {
  return api.get(`/tickets/${id}`);
};

export default api;
