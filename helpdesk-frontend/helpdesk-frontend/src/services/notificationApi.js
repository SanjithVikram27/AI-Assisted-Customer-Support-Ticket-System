import api from "./api";

/* ==============================
   NOTIFICATIONS API
   GET  /api/v1/notifications/{username}
   PUT  /api/v1/notifications/read/{id}
================================ */

export const fetchNotifications = (username) => {
  return api.get(`/notifications/${username}`);
};

export const markNotificationAsRead = (id) => {
  return api.put(`/notifications/read/${id}`);
};
