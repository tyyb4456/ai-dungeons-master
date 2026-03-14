import { motion } from 'framer-motion';
import { AlertTriangle, RotateCcw } from 'lucide-react';

function ErrorMessage({ error, onRetry }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000F08',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Space Mono', monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

        @keyframes em-scan {
          0%   { top: -1px; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 0.2; }
          100% { top: 100vh; opacity: 0; }
        }
        @keyframes em-flicker {
          0%,100% { opacity: 1; }
          90%  { opacity: 0.9; }
          93%  { opacity: 0.4; }
          96%  { opacity: 0.85; }
        }
        @keyframes em-pulse-glow {
          0%,100% { box-shadow: 0 0 0 0 rgba(251,54,64,0.35); }
          50%      { box-shadow: 0 0 0 8px rgba(251,54,64,0); }
        }
        @keyframes em-shake {
          0%,85%,100% { transform: translateX(0); }
          88%,94%     { transform: translateX(-5px); }
          91%,97%     { transform: translateX(5px); }
        }
        @keyframes em-spin {
          to { transform: rotate(360deg); }
        }

        .em-scanline {
          position: fixed; left: 0; right: 0; height: 1px;
          background: rgba(251,54,64,0.25);
          animation: em-scan 5s linear infinite;
          pointer-events: none; z-index: 99;
        }
        .em-title   { animation: em-flicker 4s infinite; }
        .em-icon    { animation: em-shake 4s ease-in-out infinite; }
        .em-card    { animation: em-pulse-glow 3s ease-in-out infinite; }

        .em-retry:hover {
          background: transparent !important;
          color: #FB3640 !important;
          box-shadow: 0 0 20px rgba(251,54,64,0.35) !important;
        }
        .em-retry:hover .em-retry-icon {
          animation: em-spin 0.5s ease-out forwards;
        }

.em-retry:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px rgba(0,0,0,0.6), 0 0 30px rgba(251,54,64,0.45) !important;
}
.em-retry:active {
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0px rgba(0,0,0,0.4) !important;
}
.em-retry-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,0.25), transparent);
  transition: left 0.5s ease;
  pointer-events: none;
}
.em-retry:hover .em-retry-shimmer {
  left: 150%;
}
      `}</style>

      {/* Scanline */}
      <div className="em-scanline" aria-hidden="true" />

      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        width: 500, height: 350,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(251,54,64,0.09) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <motion.div
        className="em-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: '100%',
          maxWidth: 420,
          border: '1px solid rgba(251,54,64,0.35)',
          background: 'rgba(251,54,64,0.05)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top red bar */}
        <div style={{ height: 2, background: '#FB3640' }} />

        {/* Subtle grid overlay */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(251,54,64,.025) 40px,rgba(251,54,64,.025) 41px)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Corner brackets */}
        {[
          { top: 8,    left: 8,    borderTop: '1px solid', borderLeft: '1px solid' },
          { top: 8,    right: 8,   borderTop: '1px solid', borderRight: '1px solid' },
          { bottom: 8, left: 8,    borderBottom: '1px solid', borderLeft: '1px solid' },
          { bottom: 8, right: 8,   borderBottom: '1px solid', borderRight: '1px solid' },
        ].map((s, i) => (
          <div key={i} aria-hidden="true" style={{
            position: 'absolute', width: 10, height: 10,
            borderColor: 'rgba(251,54,64,0.5)', ...s,
          }} />
        ))}

        {/* Content */}
        <div style={{ padding: '2.5rem 2rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>

          {/* Icon circle */}
          <div
            className="em-icon"
            style={{
              width: 72, height: 72, borderRadius: '50%',
              border: '2px solid rgba(251,54,64,0.4)',
              background: 'rgba(251,54,64,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: '#FB3640',
            }}
          >
            <AlertTriangle size={32} strokeWidth={1.5} />
          </div>

          {/* Title */}
          <h2
            className="em-title"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '2rem',
              letterSpacing: '.12em',
              color: '#FB3640',
              marginBottom: '.5rem',
            }}
          >
            SOMETHING WENT WRONG
          </h2>

          {/* Sub-label */}
          <div style={{
            fontSize: '.55rem', letterSpacing: '.25em', textTransform: 'uppercase',
            color: 'rgba(251,54,64,0.5)', marginBottom: '1.2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
          }}>
            <span style={{ display: 'inline-block', width: '1.5rem', height: 1, background: 'rgba(251,54,64,0.35)' }} />
            Error — System Failure
            <span style={{ display: 'inline-block', width: '1.5rem', height: 1, background: 'rgba(251,54,64,0.35)' }} />
          </div>

          {/* Error message */}
          <p style={{
            fontSize: '.72rem', lineHeight: 1.9,
            color: 'rgba(232,224,208,0.7)',
            marginBottom: '2rem',
            fontStyle: 'italic',
            borderLeft: '2px solid rgba(251,54,64,0.3)',
            paddingLeft: '.75rem',
            textAlign: 'left',
          }}>
            {error?.message || 'An unexpected error occurred in the narrative engine. The dungeon master has lost the thread. Please try again.'}
          </p>

          {/* Retry */}
          {onRetry && (
  <button
  onClick={onRetry}
  className="em-retry"
  style={{
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '1rem',
    letterSpacing: '.15em',
    padding: '1rem 2.5rem',
    border: '1px solid #FB3640',
    background: '#FB3640',
    color: '#000F08',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '.5rem',
    transition: 'all .2s ease',
    position: 'relative',
    overflow: 'hidden',
    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
    boxShadow: '4px 4px 0px rgba(0,0,0,0.5), 0 0 20px rgba(251,54,64,0.2)',
  }}
>
  <span className="em-retry-shimmer" />
  <RotateCcw size={16} strokeWidth={2} />
  TRY AGAIN
</button>
          )}

        </div>
      </motion.div>

    </div>
  );
}

export default ErrorMessage;