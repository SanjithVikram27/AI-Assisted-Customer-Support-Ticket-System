import { useState, useEffect, useRef, useCallback } from "react";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "../services/notificationApi";
import "./NotificationBell.css";

// ─── Relative time helper ────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const NotificationBell = ({ username }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // ─── Fetch notifications ──────────────────────────────────────────────────
  const loadNotifications = useCallback(async () => {
    if (!username) return;
    try {
      const res = await fetchNotifications(username);
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, [username]);

  // Initial fetch + auto-refresh every 15 seconds
  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  // ─── Mark as read ──────────────────────────────────────────────────────────
  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  // ─── Count unread ──────────────────────────────────────────────────────────
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="notification-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="notification-bell-wrapper" ref={wrapperRef}>
        {/* 🔔 Bell Button */}
        <button
          className="notification-bell-btn"
          onClick={() => setIsOpen((prev) => !prev)}
          title="Notifications"
        >
          🔔
          {unreadCount > 0 && (
            <span className="notification-badge">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* 📋 Dropdown Panel */}
        {isOpen && (
          <div className="notification-dropdown">
            <div className="notification-dropdown-header">
              📬 Notifications
            </div>

            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="notification-empty">
                  <div className="notification-empty-icon">🔕</div>
                  No notifications yet
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`notification-card ${
                      notif.read ? "read" : "unread"
                    }`}
                  >
                    <div className="notification-message">{notif.message}</div>
                    <div className="notification-meta">
                      <span className="notification-time">
                        {timeAgo(notif.createdAt)}
                      </span>
                      {!notif.read && (
                        <button
                          className="notification-mark-read-btn"
                          onClick={() => handleMarkAsRead(notif.id)}
                        >
                          ✓ Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationBell;
