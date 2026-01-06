import { useState, useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { sendMessage } from "../services/api";

const ChatContainer = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you?", sender: "ai" },
  ]);

  const chatEndRef = useRef(null);

  // 🔥 Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (userMsg) => {
    setMessages((prev) => [...prev, { text: userMsg, sender: "user" }]);

    try {
      const res = await sendMessage(userMsg);

      setMessages((prev) => [
        ...prev,
        { text: res.data, sender: "ai" },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "⚠️ Sorry, something went wrong. Please try again.",
          sender: "ai",
        },
      ]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-body">
        {messages.map((m, i) => (
          <ChatBubble key={i} text={m.text} sender={m.sender} />
        ))}
        <div ref={chatEndRef} />
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatContainer;
