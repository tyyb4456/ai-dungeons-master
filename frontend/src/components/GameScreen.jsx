import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gameApi } from '../services/api';
import { Sword, Sparkles, Eye, Cross, AlertTriangle } from 'lucide-react';

/* ─── shared design tokens ────────────────────────── */
const T = {
  night:   '#000F08',
  imp:     '#FB3640',
  impDim:  'rgba(251,54,64,.1)',
  impGlow: 'rgba(251,54,64,.3)',
  cream:   '#E8E0D0',
  muted:   'rgba(232,224,208,.45)',
  border:  'rgba(251,54,64,.18)',
  gold:    '#FFB830',
  blue:    '#5088FF',
  orange:  '#FF9020',
  fh:      "'Bebas Neue',sans-serif",
  fm:      "'Space Mono',monospace",
  success: '#4ade80',
};

/* ─── ResourceBar ─────────────────────────────────── */
function ResourceBar({ label, current, max, color }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  return (
    <div style={{ marginBottom: '.65rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: '.55rem', letterSpacing: '.2em', textTransform: 'uppercase', color: T.muted }}>{label}</span>
        <span style={{ fontFamily: T.fh, fontSize: '.8rem', color }}>{current}/{max}</span>
      </div>
      <div style={{ height: 5, background: 'rgba(255,255,255,.06)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: .5 }}
          style={{ height: '100%', background: color, position: 'relative' }}
        >
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,.7)' }} />
        </motion.div>
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <div style={{ fontSize: '.6rem', letterSpacing: '.3em', textTransform: 'uppercase', color: T.muted, display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.75rem' }}>
      <span style={{ display: 'inline-block', width: '.8rem', height: 1, background: T.imp }} />
      {children}
    </div>
  );
}

/* ─── SectionHead ─────────────────────────────────── */
function SectionHead({ children, color = T.imp }) {
  return (
    <div style={{ fontFamily: T.fh, fontSize: '.65rem', letterSpacing: '.35em', color, display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '1rem' }}>
      {children}
      <span style={{ flex: 1, height: 1, background: color === T.gold ? 'rgba(255,184,48,.15)' : T.border, display: 'block' }} />
    </div>
  );
}

/* ─── main component ──────────────────────────────── */
function GameScreen({ sessionId, initialGameData, onCombatStart }) {
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(initialGameData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);

  const handleAction = async (action) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await gameApi.takeAction(sessionId, action);
      if (response.game_over) {
        alert(`Game Over\n\n${response.message}\n\nFinal Level: ${response.final_stats?.level ?? 'N/A'}`);
        navigate('/');
        return;
      }
      setGameData(prev => ({
        ...prev,
        current_scene:     response.current_scene,
        available_actions: response.available_actions,
        player_stats:      response.player_stats,
        dice_roll:         response.dice_roll,
        outcome:           response.outcome,
      }));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process action');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartCombat = async () => {
    try {
      await gameApi.startCombat(sessionId, 'random', 1, 1);
      onCombatStart();
      navigate('/combat');
    } catch (err) {
      setError('Failed to start combat');
    }
  };

  const handleBackToHome = () => {
    if (window.confirm('End your adventure?')) navigate('/');
  };

  const ps = gameData.player_stats;
  const xpPct = Math.max(0, Math.min(100, (ps.xp / ps.xp_to_next) * 100));

  return (
    <div style={{ minHeight: '100vh', background: T.night, color: T.cream, fontFamily: T.fm, fontSize: 13, position: 'relative', overflow: 'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        @keyframes gs-scan{0%{top:-1px;opacity:0}5%{opacity:1}95%{opacity:.2}100%{top:100vh;opacity:0}}
        @keyframes gs-spin{to{transform:rotate(360deg)}}
        @keyframes gs-flicker{0%,100%{opacity:1}92%{opacity:.85}94%{opacity:.6}96%{opacity:.9}}
        @keyframes gs-dot{0%,100%{opacity:.2}50%{opacity:1}}
        @keyframes gs-dice{0%{transform:rotate(0) scale(1)}50%{transform:rotate(180deg) scale(1.3)}100%{transform:rotate(360deg) scale(1)}}
        .gs-scanline{position:fixed;left:0;right:0;height:1px;background:rgba(251,54,64,.2);animation:gs-scan 7s linear infinite;pointer-events:none;z-index:999;}
        .gs-act-btn{transition:border-color .15s,background .15s;position:relative;overflow:hidden;}
        .gs-act-btn::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:#FB3640;transform:scaleY(0);transition:transform .15s;transform-origin:bottom;}
        .gs-act-btn:hover:not(:disabled){border-color:rgba(251,54,64,.5)!important;background:rgba(251,54,64,.08)!important;}
        .gs-act-btn:hover:not(:disabled)::before{transform:scaleY(1);}
        .gs-act-btn:hover .gs-act-arrow{transform:translateX(4px);color:#FB3640!important;}
        .gs-act-btn .gs-act-arrow{transition:transform .15s,color .15s;}
        .gs-back:hover{color:#FB3640!important;border-color:#FB3640!important;}
        .gs-combat-btn:hover{background:#FB3640!important;color:#000F08!important;border-color:#FB3640!important;}
        .gs-inv-item:hover{border-color:rgba(251,54,64,.4)!important;color:#E8E0D0!important;}
        @media(max-width:600px){
          .gs-grid{grid-template-columns:1fr!important;}
          .gs-sidebar{border-right:none!important;border-bottom:1px solid rgba(251,54,64,.18)!important;position:static!important;}
        }

.gs-combat-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px rgba(0,0,0,0.6), 0 0 30px rgba(232,224,208,0.3) !important;
}
.gs-combat-btn:active {
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0px rgba(0,0,0,0.4) !important;
}
.gs-combat-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,0.25), transparent);
  transition: left 0.5s ease;
  pointer-events: none;
}
.gs-combat-btn:hover .gs-combat-shimmer {
  left: 150%;
}

.gs-inv-item:hover {
  border-color: rgba(251,54,64,.5) !important;
  color: rgba(232,224,208,.8) !important;
}

/* hide scrollbar on sidebar but keep scroll */
.gs-sidebar::-webkit-scrollbar { width: 3px; }
.gs-sidebar::-webkit-scrollbar-track { background: transparent; }
.gs-sidebar::-webkit-scrollbar-thumb { background: rgba(251,54,64,.3); }

      `}</style>

      <div className="gs-scanline" aria-hidden="true" />

      {/* ── HEADER ── */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          background: 'rgba(0,0,0,.5)',
          borderBottom: `1px solid ${T.border}`,
          padding: '.9rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(251,54,64,.025) 60px,rgba(251,54,64,.025) 61px)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 1 }}>
          <button
            className="gs-back"
            onClick={handleBackToHome}
            style={{ fontFamily: T.fh, fontSize: '.65rem', letterSpacing: '.2em', textTransform: 'uppercase', color: T.muted, cursor: 'crosshair', background: 'none', border: `1px solid ${T.border}`, padding: '.4rem .8rem', transition: 'all .15s' }}
          >
            ← Exit
          </button>
<div style={{ fontFamily: T.fh, fontSize: '1.6rem', letterSpacing: '.12em', animation: 'gs-flicker 4s infinite' }}>
  <span style={{ color: T.imp }}>AI⚔</span>
  <span style={{ color: T.cream }}>DM</span>
</div>
        </div>
        <div style={{ fontSize: '.55rem', letterSpacing: '.2em', textTransform: 'uppercase', color: T.muted, position: 'relative', zIndex: 1 }}>
          Session: {sessionId.slice(0, 8)}...
        </div>
      </motion.header>

{/* ── GRID ── */}
<div className="gs-grid" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: 'calc(100vh - 56px)' }}>

  {/* ── SIDEBAR ── */}
  <motion.aside
    initial={{ x: -30, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    style={{
      borderRight: `1px solid ${T.border}`,
      padding: '1.2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.2rem',
      background: 'rgba(0,0,0,.25)',
      position: 'sticky',
      top: 56,
      alignSelf: 'start',
      height: 'calc(100vh - 56px)',
      overflowY: 'auto',
    }}
    className="gs-sidebar"
  >
    {/* name */}
    <div>
      <FieldLabel>Character</FieldLabel>
      <div style={{ fontFamily: T.fh, fontSize: '1.5rem', letterSpacing: '.08em', lineHeight: 1 }}>
        {ps.name || 'Hero'}
      </div>
      <div style={{ fontSize: '.55rem', letterSpacing: '.18em', textTransform: 'uppercase', color: T.imp, marginTop: 2 }}>
        {ps.characterClass} · Level {ps.level}
      </div>
    </div>

    {/* vitals */}
    <div>
      <FieldLabel>Vitals</FieldLabel>
      <ResourceBar label="Health"  current={ps.hp}      max={ps.max_hp}      color={T.imp}    />
      <ResourceBar label="Mana"    current={ps.mana}    max={ps.max_mana}    color={T.blue}   />
      <ResourceBar label="Stamina" current={ps.stamina} max={ps.max_stamina} color={T.orange} />
    </div>

    {/* XP */}
    <div style={{ border: `1px solid rgba(255,184,48,.2)`, padding: '.7rem', background: 'rgba(255,184,48,.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '.4rem' }}>
        <span style={{ fontFamily: T.fh, fontSize: '1.2rem', letterSpacing: '.08em', color: T.gold }}>LV.{ps.level}</span>
        <span style={{ fontSize: '.55rem', letterSpacing: '.12em', color: 'rgba(255,184,48,.6)' }}>{ps.xp} / {ps.xp_to_next}</span>
      </div>
      <div style={{ height: 5, background: 'rgba(255,255,255,.06)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${xpPct}%` }}
          transition={{ duration: .5 }}
          style={{ height: '100%', background: T.gold }}
        />
      </div>
    </div>

    {/* inventory */}
    <div>
      <FieldLabel>Inventory</FieldLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, minHeight: 40 }}>
        {ps.inventory?.length > 0 ? ps.inventory.map((item, i) => (
          <span
            key={i}
            className="gs-inv-item"
            style={{
              fontSize: '.55rem',
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              padding: '3px 7px',
              border: `1px solid ${T.border}`,
              color: T.muted,
              transition: 'all .15s',
              cursor: 'default',
            }}
          >
            {item}
          </span>
        )) : (
          <span style={{ fontSize: '.6rem', color: T.muted, fontStyle: 'italic' }}>Empty</span>
        )}
      </div>
    </div>

    {/* dice roll */}
    <AnimatePresence>
      {gameData.dice_roll > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: .9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          style={{ border: `1px solid ${T.border}`, padding: '.8rem', textAlign: 'center', background: T.impDim }}
        >
          <motion.div
            key={gameData.dice_roll}
            initial={{ rotate: 0, scale: 1 }}
            animate={{ rotate: [0, 180, 360], scale: [1, 1.3, 1] }}
            transition={{ duration: .6 }}
            style={{ fontFamily: T.fh, fontSize: '3rem', color: T.imp, lineHeight: 1 }}
          >
            {gameData.dice_roll}
          </motion.div>
          <div style={{
            fontSize: '.55rem',
            letterSpacing: '.2em',
            textTransform: 'uppercase',
            marginTop: 4,
            color: gameData.outcome === 'success' ? T.success : T.imp,
          }}>
            {gameData.outcome === 'success' ? 'Success' : 'Failure'}
          </div>
        </motion.div>
      )}
    </AnimatePresence>

  </motion.aside>

        {/* ── MAIN ── */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>

          {/* scene */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: '1.5rem', borderBottom: `1px solid ${T.border}`, flex: 1 }}
          >
            <SectionHead color={T.gold}>Current Scene</SectionHead>
            <motion.p
              key={gameData.current_scene}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .4 }}
              style={{ fontSize: '.78rem', lineHeight: 2, color: T.cream, fontStyle: 'italic', whiteSpace: 'pre-line' }}
            >
              {gameData.current_scene}
            </motion.p>
          </motion.div>

          {/* error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ margin: '.5rem 1.5rem', padding: '.5rem .75rem', border: `1px solid rgba(251,54,64,.5)`, background: 'rgba(251,54,64,.07)', fontSize: '.6rem', letterSpacing: '.1em', color: T.imp }}
              >
                ⚠ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* actions */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: .15 }}
            style={{ padding: '1.2rem 1.5rem', borderTop: `1px solid ${T.border}` }}
          >
            <SectionHead color={T.imp}>What Will You Do</SectionHead>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
              {gameData.available_actions.map((action, i) => (
                <motion.button
                  key={i}
                  className="gs-act-btn"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * .07 }}
                  whileTap={{ scale: .99 }}
                  onClick={() => handleAction(action)}
                  disabled={isLoading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '.75rem 1rem',
                    border: `1px solid ${T.border}`,
                    background: 'transparent',
                    cursor: isLoading ? 'not-allowed' : 'crosshair',
                    color: T.cream,
                    textAlign: 'left',
                    fontFamily: T.fm,
                    fontSize: '.7rem',
                    letterSpacing: '.06em',
                    width: '100%',
                    opacity: isLoading ? .5 : 1,
                  }}
                >
                  <span style={{ fontFamily: T.fh, fontSize: '1rem', color: T.imp, minWidth: 24, letterSpacing: '.05em' }}>
                    0{i + 1}
                  </span>
                  <span style={{ flex: 1 }}>{action}</span>
                  {isLoading
                    ? <div style={{ width: 14, height: 14, border: `1.5px solid rgba(251,54,64,.3)`, borderTopColor: T.imp, borderRadius: '50%', animation: 'gs-spin .7s linear infinite', flexShrink: 0 }} />
                    : <span className="gs-act-arrow" style={{ fontSize: '.8rem', color: T.muted }}>→</span>
                  }
                </motion.button>
              ))}
            </div>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: 'flex', alignItems: 'center', gap: '.6rem', padding: '.6rem 0', fontSize: '.6rem', letterSpacing: '.2em', textTransform: 'uppercase', color: T.muted, marginTop: '.5rem' }}
              >
                <div style={{ width: 14, height: 14, border: `1.5px solid rgba(251,54,64,.3)`, borderTopColor: T.imp, borderRadius: '50%', animation: 'gs-spin .7s linear infinite' }} />
                Rolling the dice of fate
                <span>
                  {[0, 200, 400].map(d => (
                    <span key={d} style={{ animation: `gs-dot 1.2s ease-in-out ${d}ms infinite` }}>.</span>
                  ))}
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* combat trigger */}
<button
  className="gs-combat-btn"
  onClick={handleStartCombat}
  style={{
    margin: '1rem 1.5rem',
    padding: '1rem 1.5rem',
    fontFamily: T.fh,
    fontSize: '1rem',
    letterSpacing: '.12em',
border: `1px solid ${T.cream}`,
color: T.night,
background: T.cream,
    cursor: 'pointer',
    width: 'calc(100% - 3rem)',
    transition: 'all .2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '.5rem',
    position: 'relative',
    overflow: 'hidden',
    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
boxShadow: `4px 4px 0px rgba(0,0,0,0.5), 0 0 20px rgba(232,224,208,0.2)`,
  }}
>
  <span className="gs-combat-shimmer" />
  <Sword size={15} />
  INITIATE COMBAT — Test Encounter
</button>

        </div>
      </div>
    </div>
  );
}

export default GameScreen;