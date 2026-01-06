import { useState } from "react";

const ChatInput = ({ onSend }) => {
  const [value, setValue] = useState("");

  return (
    <div className="chat-input">
      <input
        value={value}
        placeholder="Type your issue..."
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        onClick={() => {
          if (!value.trim()) return;
          onSend(value);
          setValue("");
        }}
      >
        ➤
      </button>
    </div>
  );
};

export default ChatInput;
