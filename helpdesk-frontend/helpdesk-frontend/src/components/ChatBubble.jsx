const ChatBubble = ({ text, sender }) => {
  const label = sender === "user" ? "YOU" : "AI HELP DESK";

  return (
    <div className={`message ${sender}`}>
      <span className="label">{label}</span>
      <div className="bubble">{text}</div>
    </div>
  );
};

export default ChatBubble;
