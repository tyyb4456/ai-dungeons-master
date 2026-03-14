import { useEffect, useRef } from 'react';
import {
  Sword, Zap, Shield, Wand2, Sparkles,
  Star, Flame, Diamond, Swords, Crown,
} from 'lucide-react';

// Icons that orbit around the spinner
const ORBIT_ICONS = [Sword, Zap, Shield, Wand2, Sparkles, Star, Flame, Diamond, Swords, Crown];
const CYCLE_MESSAGES = ['LOADING', 'SUMMONING', 'FORGING', 'AWAKENING'];

// Orbit radius — distance from center of the 110px ring-wrap
// ring-wrap is 110px, orbit-layer extends 30px beyond via inset:-30px (170x170 total)
// so center is at (85, 85) within orbit-layer; we set orbit radius to 62px
const ORBIT_R = 62;
const ORBIT_CENTER = 85; // half of 170

function LoadingSpinner({ message = 'Loading...' }) {
  const labelRef = useRef(null);

  useEffect(() => {
    const el = labelRef.current;
    if (!el) return;
    const msgs = message !== 'Loading...'
      ? [message.toUpperCase()]
      : CYCLE_MESSAGES;
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

        @keyframes ls-spin       { to { transform: rotate(360deg); } }
        @keyframes ls-spin-rev   { to { transform: rotate(-360deg); } }
        @keyframes ls-orbit      { to { transform: rotate(360deg); } }
        @keyframes ls-pulse-core {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(0.55); opacity: 0.35; }
        }
        @keyframes ls-dotpulse {
          0%,100% { opacity: 0.2; transform: scale(0.8); }
          50%      { opacity: 1;   transform: scale(1.3); }
        }
        @keyframes ls-barwave {
          0%,100% { opacity: 0.3; transform: scaleY(0.5); }
          50%      { opacity: 1;   transform: scaleY(1); }
        }
        @keyframes ls-scan {
          0%   { top: 0;    opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.3; }
          100% { top: 100%; opacity: 0; }
        }

        /* Rings */
        .ls-ring-1 {
          position: absolute; inset: 0; border-radius: 50%;
          border: 2px solid transparent;
          border-top-color: #FB3640;
          border-right-color: rgba(251,54,64,0.3);
          animation: ls-spin 1.2s linear infinite;
        }
        .ls-ring-2 {
          position: absolute; inset: 14px; border-radius: 50%;
          border: 2px solid transparent;
          border-bottom-color: rgba(251,54,64,0.7);
          border-left-color: rgba(251,54,64,0.2);
          animation: ls-spin-rev 0.8s linear infinite;
        }
        .ls-ring-3 {
          position: absolute; inset: 28px; border-radius: 50%;
          border: 2px solid transparent;
          border-top-color: rgba(232,224,208,0.5);
          animation: ls-spin 1.6s linear infinite;
        }
        .ls-core {
          position: absolute; inset: 43px; border-radius: 50%;
          background: #FB3640;
          animation: ls-pulse-core 1.2s ease-in-out infinite;
        }

        /* Orbit layer — the whole thing rotates */
        .ls-orbit-layer {
          position: absolute;
          inset: -30px;            /* 170×170 wrapper around the 110×110 ring-wrap */
          animation: ls-orbit 9s linear infinite;
        }

        /* Each icon counter-rotates so it stays upright */
        .ls-orbit-icon {
          position: absolute;
          width: 14px; height: 14px;
          display: flex; align-items: center; justify-content: center;
          color: rgba(251,54,64,0.5);
          animation: ls-spin-rev 9s linear infinite;
          transition: color 0.2s;
        }

        /* Dots */
        .ls-dot {
          width: 4px; height: 4px; background: #FB3640;
          border-radius: 50%;
          animation: ls-dotpulse 1.2s ease-in-out infinite;
        }
        .ls-dot:nth-child(2) { animation-delay: 0.2s; }
        .ls-dot:nth-child(3) { animation-delay: 0.4s; }

        /* Bars */
        .ls-bar { width: 3px; background: rgba(251,54,64,0.5); border-radius: 2px; animation: ls-barwave 1s ease-in-out infinite; }
        .ls-bar:nth-child(1){ height: 8px;  animation-delay: 0s; }
        .ls-bar:nth-child(2){ height: 16px; animation-delay: 0.1s; }
        .ls-bar:nth-child(3){ height: 24px; animation-delay: 0.2s; }
        .ls-bar:nth-child(4){ height: 16px; animation-delay: 0.3s; }
        .ls-bar:nth-child(5){ height: 8px;  animation-delay: 0.4s; }

        /* Scanline */
        .ls-scanline {
          position: absolute; left: 0; right: 0; height: 1px;
          background: rgba(251,54,64,0.35);
          animation: ls-scan 2s linear infinite;
          pointer-events: none;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#000F08',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Scanline */}
        <div className="ls-scanline" aria-hidden="true" />

        {/* Ambient glow */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251,54,64,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', position: 'relative', zIndex: 1 }}>

          {/* Ring stack + orbiting Lucide icons */}
          <div style={{ position: 'relative', width: 110, height: 110 }}>

            {/* Orbit layer */}
            <div className="ls-orbit-layer">
              {ORBIT_ICONS.map((Icon, i) => {
                const angle = (i / ORBIT_ICONS.length) * 2 * Math.PI - Math.PI / 2;
                const x = ORBIT_CENTER + ORBIT_R * Math.cos(angle) - 7; // -7 = half of 14px icon
                const y = ORBIT_CENTER + ORBIT_R * Math.sin(angle) - 7;
                return (
                  <div
                    key={i}
                    className="ls-orbit-icon"
                    style={{ left: x, top: y }}
                  >
                    <Icon size={13} strokeWidth={1.5} />
                  </div>
                );
              })}
            </div>

            {/* Three spinning rings */}
            <div className="ls-ring-1" />
            <div className="ls-ring-2" />
            <div className="ls-ring-3" />

            {/* Pulsing red core */}
            <div className="ls-core" />
          </div>

          {/* Cycling label */}
          <div style={{ textAlign: 'center' }}>
            <span
              ref={labelRef}
              style={{
                display: 'block',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '1.4rem',
                letterSpacing: '0.25em',
                color: '#E8E0D0',
                marginBottom: 8,
              }}
            >
              LOADING
            </span>
            <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
              <div className="ls-dot" />
              <div className="ls-dot" />
              <div className="ls-dot" />
            </div>
          </div>

          {/* Audio visualizer bars */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
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