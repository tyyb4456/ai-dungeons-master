import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Sparkles, Eye, Cross, AlertTriangle } from 'lucide-react';

/* ─── class definitions ───────────────────────────── */
const CLASSES = [
  { name: 'Warrior', icon: '⚔',  description: 'Melee fighter' },
  { name: 'Mage',    icon: '✦',  description: 'Arcane master' },
  { name: 'Rogue',   icon: '◈',  description: 'Stealthy cunning' },
  { name: 'Cleric',  icon: '☩',  description: 'Divine healer' },
];



const SETTINGS = [
  'Dark Fantasy Medieval Kingdom',
  'Ancient Egyptian Desert',
  'Futuristic Cyberpunk City',
  'Mystical Enchanted Forest',
];

/* ─── design tokens ───────────────────────────────── */
const T = {
  night:  '#000F08',
  imp:    '#FB3640',
  impDim: 'rgba(251,54,64,.1)',
  impGlw: 'rgba(251,54,64,.35)',
  cream:  '#E8E0D0',
  muted:  'rgba(232,224,208,.45)',
  border: 'rgba(251,54,64,.2)',
  fh:     "'Bebas Neue',sans-serif",
  fm:     "'Space Mono',monospace",
};

/* ─── FieldLabel ──────────────────────────────────── */
function FieldLabel({ children }) {
  return (
    <div style={{ fontSize: '.6rem', letterSpacing: '.3em', textTransform: 'uppercase', color: T.muted, display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.75rem' }}>
      <span style={{ display: 'inline-block', width: '.8rem', height: 1, background: T.imp }} />
      {children}
    </div>
  );
}

/* ─── main component ──────────────────────────────── */
function CharacterCreation({ onStartGame }) {
  const [playerName,     setPlayerName]     = useState('');
  const [characterClass, setCharacterClass] = useState('Warrior');
  const [setting,        setSetting]        = useState(SETTINGS[0]);

  const hasName = playerName.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasName) {
      onStartGame({ playerName: playerName.trim(), characterClass, setting });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: T.night, color: T.cream, fontFamily: T.fm, fontSize: 13, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', position: 'relative', overflow: 'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        @keyframes cc-scan{0%{top:-1px;opacity:0}5%{opacity:1}95%{opacity:.2}100%{top:100vh;opacity:0}}
        @keyframes cc-flicker{0%,100%{opacity:1}92%{opacity:.85}94%{opacity:.5}96%{opacity:.9}}
        @keyframes cc-pulse{0%,100%{box-shadow:0 0 0 0 rgba(251,54,64,.35)}50%{box-shadow:0 0 0 6px rgba(251,54,64,0)}}
        .cc-scanline{position:fixed;left:0;right:0;height:1px;background:rgba(251,54,64,.2);animation:cc-scan 7s linear infinite;pointer-events:none;z-index:999;}
        .cc-title{animation:cc-flicker 5s infinite;}
        .cc-class-btn{transition:border-color .15s,background .15s;}
        .cc-class-btn:hover{border-color:rgba(251,54,64,.5)!important;background:rgba(251,54,64,.08)!important;}
        .cc-class-btn.active{animation:cc-pulse 2s ease-in-out infinite;}
        .cc-input:focus{border-color:#FB3640!important;box-shadow:0 0 0 2px rgba(251,54,64,.15)!important;}
        .cc-select:focus{border-color:#FB3640!important;outline:none;}
        .cc-submit-ghost:hover:not(:disabled){background:transparent!important;color:#FB3640!important;box-shadow:0 0 20px rgba(251,54,64,.35)!important;}

        .cc-btn-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s ease;
  pointer-events: none;
}
.cc-submit-ghost:hover:not(:disabled) .cc-btn-shimmer {
  left: 150%;
}
.cc-submit-ghost:hover:not(:disabled) {
  transform: translate(-2px, -2px) !important;
  box-shadow: 6px 6px 0px rgba(0,0,0,0.6), 0 0 30px rgba(232,224,208,0.25) !important;
  background: var(--cream, #E8E0D0) !important;
  color: #000F08 !important;
}
.cc-submit-ghost:active:not(:disabled) {
  transform: translate(1px, 1px) !important;
  box-shadow: 2px 2px 0px rgba(0,0,0,0.4) !important;
}
      `}</style>

      <div className="cc-scanline" aria-hidden="true" />

      {/* ambient glow */}
      <div aria-hidden="true" style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse,rgba(251,54,64,.06) 0%,transparent 65%)', pointerEvents: 'none' }} />

      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '2.5rem' }}
      >
        <div style={{ fontSize: '.6rem', letterSpacing: '.4em', textTransform: 'uppercase', color: T.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.75rem', marginBottom: '.75rem' }}>
          <span style={{ display: 'inline-block', width: '2rem', height: 1, background: T.imp }} />
          Character Creation
          <span style={{ display: 'inline-block', width: '2rem', height: 1, background: T.imp }} />
        </div>
<h1 className="cc-title" style={{ fontFamily: T.fh, fontSize: 'clamp(3rem,8vw,5rem)', letterSpacing: '.1em', lineHeight: 1 }}>
  <span style={{ color: T.imp }}>FORGE YOUR </span>
  <span style={{ color: T.cream }}>LEGEND</span>
</h1>
        <p style={{ fontSize: '.65rem', letterSpacing: '.18em', textTransform: 'uppercase', color: T.muted, marginTop: '.6rem', fontStyle: 'italic' }}>
          // Every choice echoes through eternity //
        </p>
      </motion.div>

      {/* ── CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: .1 }}
        style={{ width: '100%', maxWidth: 560, border: `1px solid ${T.border}`, background: 'rgba(0,0,0,.4)', position: 'relative' }}
      >
        {/* top red bar */}
        <div style={{ height: 2, background: T.imp }} />

        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>

          {/* ── NAME ── */}
          <div style={{ marginBottom: '1.8rem' }}>
            <FieldLabel>Hero's Name</FieldLabel>
            <input
              className="cc-input"
              type="text"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              placeholder="Enter your name..."
              maxLength={50}
              required
              style={{
                width: '100%',
                padding: '.75rem 1rem',
                background: 'rgba(0,0,0,.5)',
                border: `1px solid ${T.border}`,
                color: T.cream,
                fontFamily: T.fm,
                fontSize: '.75rem',
                letterSpacing: '.08em',
                outline: 'none',
                transition: 'border-color .15s, box-shadow .15s',
              }}
            />
          </div>

          {/* ── CLASS ── */}
          <div style={{ marginBottom: '1.8rem' }}>
            <FieldLabel>Choose Class</FieldLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '.5rem' }}>
              {CLASSES.map((cls, i) => (
                <motion.button
                  key={cls.name}
                  type="button"
                  className={`cc-class-btn${characterClass === cls.name ? ' active' : ''}`}
                  onClick={() => setCharacterClass(cls.name)}
                  whileTap={{ scale: .97 }}
                  style={{
                    border: `1px solid ${characterClass === cls.name ? T.imp : T.border}`,
                    padding: '.9rem .5rem',
                    background: characterClass === cls.name ? T.impDim : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '.4rem',
                    color: T.cream,
                  }}
                >
                  <div style={{ fontSize: '1.4rem', lineHeight: 1, color: characterClass === cls.name ? T.imp : T.muted, transition: 'color .15s' }}>
                    {cls.icon}
                  </div>
                  <div style={{ fontFamily: T.fh, fontSize: '.9rem', letterSpacing: '.08em' }}>{cls.name}</div>
                  <div style={{ fontSize: '.5rem', letterSpacing: '.1em', textTransform: 'uppercase', color: T.muted, textAlign: 'center', lineHeight: 1.5 }}>
                    {cls.description}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* ── WORLD ── */}
          <div style={{ marginBottom: 0 }}>
            <FieldLabel>Choose World</FieldLabel>
            <div style={{ position: 'relative' }}>
              <select
                className="cc-select"
                value={setting}
                onChange={e => setSetting(e.target.value)}
                style={{
                  width: '100%',
                  padding: '.75rem 2rem .75rem 1rem',
                  background: 'rgba(0,0,0,.5)',
                  border: `1px solid ${T.border}`,
                  color: T.cream,
                  fontFamily: T.fm,
                  fontSize: '.7rem',
                  letterSpacing: '.08em',
                  cursor: 'pointer',
                  appearance: 'none',
                  transition: 'border-color .15s',
                }}
              >
                {SETTINGS.map(s => <option key={s} value={s} style={{ background: T.night }}>{s}</option>)}
              </select>
              {/* custom arrow */}
              <div aria-hidden="true" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <svg width="10" height="6" viewBox="0 0 10 6"><path d="M0 0l5 6 5-6z" fill="rgba(251,54,64,.6)" /></svg>
              </div>
            </div>
          </div>

          {/* ── SUBMIT ── */}
<motion.button
  type="submit"
  disabled={!hasName}
  className="cc-submit-ghost"
  whileTap={hasName ? { scale: .98 } : {}}
  style={{
    width: '100%',
    padding: '1.1rem',
    marginTop: '2rem',
    fontFamily: T.fh,
    fontSize: '1.1rem',
    letterSpacing: '.15em',
    border: `1px solid ${hasName ? T.cream : T.border}`,
    background: hasName ? T.cream : 'rgba(255,255,255,.04)',
    color: hasName ? T.night : T.muted,
    cursor: hasName ? 'pointer' : 'not-allowed',
    transition: 'all .2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '.6rem',
    position: 'relative',
    overflow: 'hidden',
    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
    boxShadow: hasName ? `4px 4px 0px rgba(0,0,0,0.5), 0 0 20px rgba(232,224,208,0.15)` : 'none',
  }}
>
  <span className="cc-btn-shimmer" />
  <span style={{ display: 'flex' }}>{hasName ? <Sword size={16} /> : <AlertTriangle size={16} />}</span>
  {hasName ? 'BEGIN ADVENTURE' : 'ENTER YOUR NAME FIRST'}
</motion.button>

        </form>
      </motion.div>

      {/* ── FOOTER ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: .25 }}
        style={{ marginTop: '1.5rem', fontSize: '.55rem', letterSpacing: '.3em', textTransform: 'uppercase', color: T.muted, textAlign: 'center' }}
      >
        Your choices shape your destiny
      </motion.p>

    </div>
  );
}

export default CharacterCreation;