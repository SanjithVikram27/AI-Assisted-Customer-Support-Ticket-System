import { useState, useRef } from "react";

const BAR_COLORS = ["#cc44ff", "#a855f7", "#8b5cf6", "#6d6aff", "#4f91ff", "#22d3ee", "#06b6d4"];
const REST_HEIGHTS = [6, 10, 16, 20, 16, 10, 6];
const MAX_HEIGHTS = [20, 30, 38, 44, 38, 30, 20];
const BIN_INDICES = [1, 3, 5, 8, 11, 14, 17];

const ChatInput = ({ onSend }) => {
  const [value, setValue] = useState("");
  const [listening, setListening] = useState(false);
  const [barHeights, setBarHeights] = useState(REST_HEIGHTS);

  const recognitionRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const streamRef = useRef(null);
  const dataArrayRef = useRef(null);

  // ─── Cleanup ──────────────────────────────────────────────────────────────
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

  // ─── Animation loop ───────────────────────────────────────────────────────
  const animateWave = () => {
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    if (!analyser || !dataArray) return;

    analyser.getByteFrequencyData(dataArray);

    const heights = BIN_INDICES.map((bin, i) => {
      const ratio = (dataArray[bin] ?? 0) / 255;
      return REST_HEIGHTS[i] + ratio * (MAX_HEIGHTS[i] - REST_HEIGHTS[i]);
    });

    setBarHeights(heights);
    animFrameRef.current = requestAnimationFrame(animateWave);
  };

  // ─── Mic toggle ───────────────────────────────────────────────────────────
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      audioCtx.createMediaStreamSource(stream).connect(analyser);
      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

      animateWave();

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
    <div className="chat-input">
      <div className="input-wrapper">
        <input
          value={value}
          placeholder={listening ? "" : "Type your issue..."}
          onChange={(e) => setValue(e.target.value)}
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
        className={`mic-btn${listening ? " mic-listening" : ""}`}
        onClick={toggleMic}
        title={listening ? "Stop listening" : "Speak your issue"}
      >
        {listening ? "⏹" : "🎤"}
      </button>

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
