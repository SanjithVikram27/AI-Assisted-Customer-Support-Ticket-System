import { useState } from "react";

const PremiumInput = ({ onSend }) => {
  const [value, setValue] = useState("");

  const send = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="input-bar">
      <button className="icon-btn">＋</button>

      <input
        placeholder="Type a message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
      />

      <button className="icon-btn send" onClick={send}>
        ➤
      </button>
    </div>
  );
};

export default PremiumInput;
