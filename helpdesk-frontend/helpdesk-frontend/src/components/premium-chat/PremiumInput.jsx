import { useState, useRef } from "react";

// Bar colour palette: purple → blue → cyan (7 bars)
const BAR_COLORS = ["#cc44ff", "#a855f7", "#8b5cf6", "#6d6aff", "#4f91ff", "#22d3ee", "#06b6d4"];
// Natural resting heights (shown when not listening or silent)
const REST_HEIGHTS = [6, 10, 16, 20, 16, 10, 6];
// Max heights each bar can reach
const MAX_HEIGHTS = [18, 26, 34, 38, 34, 26, 18];
// Frequency bin indices sampled from the analyser (out of 32 bins with fftSize=64)
const BIN_INDICES = [1, 3, 5, 8, 11, 14, 17];

const PremiumInput = ({ onSend }) => {
  const [value, setValue] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [listening, setListening] = useState(false);
  const [barHeights, setBarHeights] = useState(REST_HEIGHTS);

  const recognitionRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const streamRef = useRef(null);
  const dataArrayRef = useRef(null);

  const send = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  // ─── Cleanup all audio resources ────────────────────────────────────────────
  const stopAudio = () => {
    cancelAnimationFrame(animFrameRef.current);
    analyserRef.current?.disconnect();
    audioCtxRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    analyserRef.current = null;
    audioCtxRef.current = null;
    streamRef.current = null;
    setBarHeights(REST_HEIGHTS);
  };

  // ─── Animation loop — reads mic freq data, maps to bar heights ────────────
  const animateWave = () => {
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    if (!analyser || !dataArray) return;

    analyser.getByteFrequencyData(dataArray);

    const heights = BIN_INDICES.map((bin, i) => {
      const amplitude = dataArray[bin] ?? 0;           // 0–255
      const ratio = amplitude / 255;
      return REST_HEIGHTS[i] + ratio * (MAX_HEIGHTS[i] - REST_HEIGHTS[i]);
    });

    setBarHeights(heights);
    animFrameRef.current = requestAnimationFrame(animateWave);
  };

  // ─── Mic toggle ─────────────────────────────────────────────────────────────
  const toggleMic = async () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Try Chrome.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      stopAudio();
      return;
    }

    try {
      // 1. Get mic stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 2. Build AudioContext + AnalyserNode
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;                              // 32 frequency bins
      audioCtx.createMediaStreamSource(stream).connect(analyser);
      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

      // 3. Start animation loop
      animateWave();

      // 4. Start speech recognition
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setListening(true);
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setValue((prev) => (prev ? prev + " " + transcript : transcript));
      };
      recognition.onerror = () => { setListening(false); stopAudio(); };
      recognition.onend = () => { setListening(false); stopAudio(); };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      alert("Microphone access denied. Please allow mic access to use voice input.");
    }
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

      {/* MENU — User-only: My Tickets */}
      {showMenu && (
        <div className="menu-popup">
          <button
            onClick={() => { window.location.href = "/my-tickets.html"; }}
          >
            🎫 My Tickets
          </button>
        </div>
      )}

      <div className="input-wrapper">
        <input
          placeholder={listening ? "" : "Type a message..."}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        {listening && (
          <div className="voice-waveform">
            {barHeights.map((h, i) => (
              <span
                key={i}
                className="wave-bar"
                style={{ height: `${h}px`, background: BAR_COLORS[i] }}
              />
            ))}
          </div>
        )}
      </div>

      {/* MIC BUTTON — voice input */}
      <button
        className={`icon-btn mic-btn${listening ? " mic-listening" : ""}`}
        onClick={toggleMic}
        title={listening ? "Stop listening" : "Speak a message"}
      >
        {listening ? "⏹" : "🎤"}
      </button>

      <button className="icon-btn send" onClick={send}>
        ➤
      </button>
    </div>
  );
};

export default PremiumInput;
