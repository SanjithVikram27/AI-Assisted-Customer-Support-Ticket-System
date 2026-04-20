import { useState, useEffect, useRef } from "react";
import PremiumMessage from "./PremiumMessage";
import PremiumInput from "./PremiumInput";
import PremiumTicketCard from "./PremiumTicketCard";
import { sendMessage } from "../../services/api";

const CHAT_STORAGE_KEY = 'helpdesk_chat_messages';

const DEFAULT_WELCOME = [
  {
    side: "left",
    name: "AI Help Desk",
    text: "Hello! How can I help you today?",
  },
];

const PremiumChatLayout = () => {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { /* ignore parse errors */ }
    return DEFAULT_WELCOME;
  });

  const [isTyping, setIsTyping] = useState(false);
  const [time, setTime] = useState("");

  // ─── Auth guard — runs synchronously before first render ─────────────────
  const [loggedInUser] = useState(() => {
    const adminSession = localStorage.getItem("adminLoggedIn");
    if (adminSession) {
      window.location.replace("/dashboard.html");
      return null;
    }
    const raw = localStorage.getItem("loggedInUser");
    if (!raw) {
      window.location.replace("/portal.html");
      return null;
    }
    try { return JSON.parse(raw); }
    catch { window.location.replace("/portal.html"); return null; }
  });

  const bottomRef = useRef(null);

  // Guard — don’t render anything if redirecting
  if (!loggedInUser) return null;

  /* 🔥 Live time like phone */
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, "0");
      setTime(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  /* 💾 Persist chat messages to sessionStorage */
  useEffect(() => {
    try {
      sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch { /* storage full — silently ignore */ }
  }, [messages]);

  /* Auto scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    // User message
    setMessages((prev) => [
      ...prev,
      { side: "right", name: loggedInUser?.name || "You", text },
    ]);

    setIsTyping(true);

    try {
      const res = await sendMessage(text);
      const replyText = res.data;

      // 1️⃣ Always show AI reply
      setMessages((prev) => [
        ...prev,
        {
          side: "left",
          name: "AI Help Desk",
          text: replyText,
        },
      ]);

      // 🔊 Speak AI reply aloud (cleaned)
      const cleanForSpeech = (text) =>
        text
          .replace(/[\p{Emoji}\p{Extended_Pictographic}]/gu, "")
          .replace(/[^\p{L}\p{N}\p{Z}\p{P}]/gu, "")
          .replace(/\s+/g, " ")
          .trim();
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(cleanForSpeech(replyText)));

      // 2️⃣ FRONTEND-ONLY TICKET DETECTION (NO JSON)
      const lower = replyText.toLowerCase();

      if (
        lower.includes("created") &&
        lower.includes("support ticket")
      ) {
        let category = "GENERAL";

        if (lower.includes("account")) category = "ACCOUNT";
        else if (lower.includes("billing")) category = "BILLING";
        else if (lower.includes("technical")) category = "TECHNICAL";

        // Append ticket card
        setMessages((prev) => [
          ...prev,
          {
            side: "left",
            name: "AI Help Desk",
            ticket: {
              id: Math.floor(1000 + Math.random() * 9000),
              category,
              priority: "MEDIUM",
              status: "OPEN",
            },
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          side: "left",
          name: "AI Help Desk",
          text: "⚠️ Something went wrong.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="phone-frame">
      <div className="phone-body">

        {/* 🔋 STATUS BAR */}
        <div className="status-bar">
          <span className="time">{time}</span>

          <div className="status-icons">
            <span className="signal" />
            <span className="wifi" />
            <span className="bluetooth">ᛒ</span>
            <div className="battery">
              <div className="battery-level" />
            </div>
            <span className="battery-text">87%</span>
          </div>
        </div>

        {/* CAMERA DOT */}
        <div className="camera-dot" />

        {/* CHAT SCREEN */}
        <div className="chat-screen">
          <div className="chat-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              💎 AI-Assisted Customer Support System
              {loggedInUser && (
                <span style={{ fontSize: '0.7rem', display: 'block', opacity: 0.65, marginTop: '2px', fontWeight: 500 }}>
                  Hi, {loggedInUser.name} 👋
                </span>
              )}
            </div>

            {/* Logout / Back to Home */}
            <button
              title="Logout"
              onClick={() => {
                sessionStorage.removeItem(CHAT_STORAGE_KEY);
                localStorage.removeItem('loggedInUser');
                window.location.replace('/portal.html');
              }}
              style={{
                background: 'linear-gradient(135deg,#d6c28f,#b89b5e)',
                border: 'none',
                borderRadius: '14px',
                padding: '5px 12px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#2b2100',
                cursor: 'pointer',
                boxShadow: '0 3px 8px rgba(214,194,143,0.4)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              🚪 Logout
            </button>
          </div>

          <div className="messages">
            {messages.map((m, i) => (
              <div key={i}>
                {m.text && (
                  <PremiumMessage
                    side={m.side}
                    name={m.name}
                    text={m.text}
                  />
                )}

                {m.ticket && (
                  <PremiumTicketCard ticket={m.ticket} />
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <PremiumMessage
                side="left"
                name="AI Help Desk"
                text="Typing…"
              />
            )}

            <div ref={bottomRef} />
          </div>

          <PremiumInput onSend={handleSend} />
        </div>

      </div>
    </div>
  );
};

export default PremiumChatLayout;
