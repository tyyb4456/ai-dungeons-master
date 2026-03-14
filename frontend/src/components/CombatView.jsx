
import { useEffect, useRef } from "react";
import { Sword, Sparkles, Zap, Shield, Diamond } from "lucide-react";

const RUNE_ICONS = [
  Sword,
  Sparkles,
  Shield,
  Diamond,
  Zap,
  Sparkles,
  Sword,
  Diamond,
  Shield,
  Sparkles,
];

const CYCLE_MESSAGES = ["LOADING", "SUMMONING", "FORGING", "AWAKENING"];

function LoadingSpinner({ message = "Loading..." }) {
  const labelRef = useRef(null);

  useEffect(() => {
    const el = labelRef.current;
    if (!el) return;

    const msgs =
      message !== "Loading..." ? [message.toUpperCase()] : CYCLE_MESSAGES;

    let i = 0;

    const t = setInterval(() => {
      i = (i + 1) % msgs.length;
      el.textContent = msgs[i];
    }, 2000);

    return () => clearInterval(t);
  }, [message]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

        @keyframes ls-spin { to { transform: rotate(360deg); } }
        @keyframes ls-spin-rev { to { transform: rotate(-360deg); } }

        @keyframes ls-pulse-core {
          0%,100% { transform:scale(1); opacity:1; }
          50% { transform:scale(0.6); opacity:0.4; }
        }

        @keyframes ls-dotpulse {
          0%,100% { opacity:0.2; transform:scale(0.8); }
          50% { opacity:1; transform:scale(1.3); }
        }

        @keyframes ls-barwave {
          0%,100% { opacity:0.3; transform:scaleY(0.5); }
          50% { opacity:1; transform:scaleY(1); }
        }

        @keyframes ls-scan {
          0% { top:0; opacity:0; }
          10% { opacity:1; }
          90% { opacity:0.3; }
          100% { top:100%; opacity:0; }
        }

        @keyframes ls-rune-spin {
          to { transform: rotate(-360deg); }
        }

        .ls-ring-1 {
          position:absolute;
          inset:0;
          border-radius:50%;
          border:2px solid transparent;
          border-top-color:#FB3640;
          border-right-color:rgba(251,54,64,0.3);
          animation: ls-spin 1.2s linear infinite;
        }

        .ls-ring-2 {
          position:absolute;
          inset:12px;
          border-radius:50%;
          border:2px solid transparent;
          border-bottom-color:rgba(251,54,64,0.7);
          border-left-color:rgba(251,54,64,0.2);
          animation: ls-spin-rev 0.8s linear infinite;
        }

        .ls-ring-3 {
          position:absolute;
          inset:24px;
          border-radius:50%;
          border:2px solid transparent;
          border-top-color:rgba(232,224,208,0.6);
          animation: ls-spin 1.6s linear infinite;
        }

        .ls-core {
          position:absolute;
          inset:38px;
          border-radius:50%;
          background:#FB3640;
          animation: ls-pulse-core 1.2s ease-in-out infinite;
        }

        .ls-runes {
          position:absolute;
          inset:-18px;
          animation: ls-rune-spin 8s linear infinite;
        }

        .ls-dot {
          width:4px;
          height:4px;
          background:#FB3640;
          border-radius:50%;
          animation: ls-dotpulse 1.2s ease-in-out infinite;
        }

        .ls-dot:nth-child(2) { animation-delay:0.2s; }
        .ls-dot:nth-child(3) { animation-delay:0.4s; }

        .ls-bar {
          width:3px;
          background:rgba(251,54,64,0.5);
          border-radius:2px;
          animation: ls-barwave 1s ease-in-out infinite;
        }

        .ls-bar:nth-child(1){ height:8px; animation-delay:0s; }
        .ls-bar:nth-child(2){ height:16px; animation-delay:0.1s; }
        .ls-bar:nth-child(3){ height:24px; animation-delay:0.2s; }
        .ls-bar:nth-child(4){ height:16px; animation-delay:0.3s; }
        .ls-bar:nth-child(5){ height:8px; animation-delay:0.4s; }

        .ls-scanline {
          position:absolute;
          left:0;
          right:0;
          height:1px;
          background:rgba(251,54,64,0.35);
          animation: ls-scan 2s linear infinite;
          pointer-events:none;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#000F08",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Scanline */}
        <div className="ls-scanline" />

        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(251,54,64,0.07) 0%, transparent 65%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Ring stack */}
          <div style={{ position: "relative", width: 100, height: 100 }}>
            <div className="ls-ring-1" />
            <div className="ls-ring-2" />
            <div className="ls-ring-3" />
            <div className="ls-core" />

            {/* Lucide rune circle */}
            <div className="ls-runes">
              {RUNE_ICONS.map((Icon, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: 12,
                    textAlign: "center",
                    transformOrigin: "6px 74px",
                    transform: `rotate(${i * 36}deg)`,
                  }}
                >
                  <Icon size={12} color="rgba(251,54,64,0.5)" />
                </div>
              ))}
            </div>
          </div>

          {/* Label */}
          <div style={{ textAlign: "center" }}>
            <span
              ref={labelRef}
              style={{
                display: "block",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.4rem",
                letterSpacing: "0.25em",
                color: "#E8E0D0",
                marginBottom: 8,
              }}
            >
              LOADING
            </span>

            <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
              <div className="ls-dot" />
              <div className="ls-dot" />
              <div className="ls-dot" />
            </div>
          </div>

          {/* Audio bars */}
          <div style={{ display: "flex", gap: 4, alignItems: "flex-end" }}>
            <div className="ls-bar" />
            <div className="ls-bar" />
            <div className="ls-bar" />
            <div className="ls-bar" />
            <div className="ls-bar" />
          </div>
        </div>
      </div>
    </>
  );
}

export default LoadingSpinner;
