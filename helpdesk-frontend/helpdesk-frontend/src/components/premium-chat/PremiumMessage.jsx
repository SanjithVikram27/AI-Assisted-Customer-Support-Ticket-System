const PremiumMessage = ({ side, name, text }) => {
  const avatar =
    side === "left"
      ? "https://i.imgur.com/6VBx3io.png" // AI avatar
      : "https://i.imgur.com/QCNbOAo.png"; // User avatar

  return (
    <div className={`msg-row ${side}`}>
      {side === "left" && <img src={avatar} className="avatar" />}

      <div className="msg-content">
        <div className={`name ${side}`}>{name}</div>
        <div className={`bubble ${side}`}>{text}</div>
      </div>

      {side === "right" && <img src={avatar} className="avatar" />}
    </div>
  );
};

export default PremiumMessage;
