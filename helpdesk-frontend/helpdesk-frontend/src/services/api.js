import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api/v1",
  headers: {
    "Content-Type": "text/plain",
  },
});

export const sendMessage = (message) => api.post("/chat", message);

export default api;
