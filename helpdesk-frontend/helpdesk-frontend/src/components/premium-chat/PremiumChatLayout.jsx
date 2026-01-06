import { useState, useEffect, useRef } from "react";
import PremiumMessage from "./PremiumMessage";
import PremiumInput from "./PremiumInput";
import PremiumTicketCard from "./PremiumTicketCard";
import { sendMessage } from "../../services/api";

const PremiumChatLayout = () => {
  const [messages, setMessages] = useState([
    {
      side: "left",
      name: "AI Help Desk",
      text: "Hello! How can I help you today?",
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [time, setTime] = useState("");
  const bottomRef = useRef(null);

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

  /* Auto scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    // User message
    setMessages((prev) => [
      ...prev,
      { side: "right", name: "You", text },
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
          <div className="chat-header">
            💎 AI-Assisted Customer Support System
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
