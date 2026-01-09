import { useState } from "react";

const PremiumInput = ({ onSend }) => {
  const [value, setValue] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const send = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="input-bar">
      {/* PLUS BUTTON */}
      <button
        className="icon-btn"
        onClick={() => setShowMenu(!showMenu)}
      >
        +
      </button>

      {/* MENU */}
      {showMenu && (
        <div className="menu-popup">
          <button
            onClick={() => window.open("/dashboard.html", "_self")}
          >
            📊 Ticket Dashboard
          </button>
        </div>
      )}

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
