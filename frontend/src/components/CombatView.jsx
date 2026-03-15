import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gameApi } from '../services/api';
import { Sword, Zap, Shield, Wind, ChevronLeft, AlertTriangle } from 'lucide-react';

const ABILITIES = [
  { name: 'Power Strike', icon: <Sword size={16}/>,  cost: '15 Stamina', description: 'High damage attack' },
  { name: 'Fireball',     icon: <Zap size={16}/>,    cost: '20 Mana',    description: 'Magical fire damage' },
  { name: 'Heal',         icon: <Shield size={16}/>, cost: '25 Mana',    description: 'Restore health' },
];

const S = {
  night:     '#000F08',
  imp:       '#FB3640',
  impDim:    'rgba(251,54,64,.1)',
  impGlow:   'rgba(251,54,64,.35)',
  cream:     '#E8E0D0',
  muted:     'rgba(232,224,208,.4)',
  border:    'rgba(251,54,64,.18)',
  gold:      '#FFB830',
  blue:      '#5088FF',
  orange:    '#FF9020',
  purple:    'rgba(168,85,247,1)',
  purpleDim: 'rgba(168,85,247,.12)',
  fh:        "'Bebas Neue',sans-serif",
  fm:        "'Space Mono',monospace",
};

/* ── ResourceBar ── */
function ResourceBar({ label, current, max, color }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  return (
    <div style={{ marginBottom: '.6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: '.55rem', letterSpacing: '.25em', textTransform: 'uppercase', color: S.muted }}>{label}</span>
        <span style={{ fontFamily: S.fh, fontSize: '.85rem', color, lineHeight: 1 }}>
          {current}<span style={{ color: S.muted, fontSize: '.7rem' }}>/{max}</span>
        </span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,.05)', position: 'relative', clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: .6, ease: 'easeOut' }}
          style={{ height: '100%', background: color, boxShadow: `0 0 8px ${color}` }}
        />
      </div>
    </div>
  );
}

/* ── ActionBtn ── */
function ActionBtn({ label, icon, color, border, onClick, disabled }) {
  return (
    <motion.button
      whileHover={!disabled ? { y: -2 } : {}}
      whileTap={!disabled ? { scale: .96 } : {}}
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: S.fh,
        fontSize: '.95rem',
        letterSpacing: '.1em',
        padding: '.85rem .5rem',
        border: `1px solid ${disabled ? 'rgba(255,255,255,.06)' : border}`,
        color: disabled ? S.muted : color,
        background: 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '.35rem',
        opacity: disabled ? .4 : 1,
        transition: 'all .2s ease',
        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
      }}
      onMouseEnter={e => {
        if (!disabled) {
          e.currentTarget.style.background = border.replace(/[\d.]+\)$/, '.12)');
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      <span style={{ fontSize: '.5rem', letterSpacing: '.2em' }}>{label}</span>
    </motion.button>
  );
}

/* ── SectionHead ── */
function SectionHead({ children, color = S.imp }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1rem' }}>
      <span style={{ display: 'inline-block', width: 3, height: '1rem', background: color, flexShrink: 0 }} />
      <span style={{ fontFamily: S.fh, fontSize: '.7rem', letterSpacing: '.35em', color, textTransform: 'uppercase' }}>{children}</span>
      <span style={{ flex: 1, height: 1, background: `${color}30`, display: 'block' }} />
    </div>
  );
}

/* ── CombatView ── */
function CombatView({ sessionId, onCombatEnd }) {
  const [combatData, setCombatData]         = useState(null);
  const [isLoading, setIsLoading]           = useState(true);
  const [actionLoading, setActionLoading]   = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(0);
  const [showAbilities, setShowAbilities]   = useState(false);
  const [error, setError]                   = useState(null);
  const [shakeTarget, setShakeTarget]       = useState(null);
  const [hitFlash, setHitFlash]             = useState(null);
  const logRef = useRef(null);

  useEffect(() => { loadCombatStatus(); }, []);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [combatData?.combat_log]);

  const loadCombatStatus = async () => {
    try {
      const response = await gameApi.getCombatStatus(sessionId);
      setCombatData(response);
    } catch { setError('Failed to load combat'); }
    finally { setIsLoading(false); }
  };

  const handleCombatAction = async (actionType, abilityName = null) => {
    setActionLoading(true);
    setShowAbilities(false);
    setError(null);
    try {
      const response = await gameApi.performCombatAction(sessionId, actionType, selectedTarget, abilityName, null);
      if (actionType === 'attack' || actionType === 'ability') {
        setShakeTarget(selectedTarget);
        setHitFlash(selectedTarget);
        setTimeout(() => { setShakeTarget(null); setHitFlash(null); }, 600);
      }
      if (response.combat_ended) {
        setTimeout(() => {
          if (response.victory) {
            alert(`VICTORY\n\n+${response.rewards.xp} XP  /  +${response.rewards.gold} Gold${response.rewards.loot.length ? `\nLoot: ${response.rewards.loot.join(', ')}` : ''}${response.rewards.leveled_up ? `\n\nLEVEL UP → ${response.rewards.new_level}` : ''}`);
          } else if (response.defeat) {
            alert('DEFEAT — You have fallen in battle.');
          } else if (response.fled) {
            alert('You fled from combat.');
          }
          onCombatEnd();
        }, 500);
        return;
      }
      setCombatData({ ...response, in_combat: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) return (
    <div style={{ minHeight: '100vh', background: S.night, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: `2px solid ${S.border}`, borderTopColor: S.imp, borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 1.2rem' }} />
        <div style={{ fontFamily: S.fh, fontSize: '1.2rem', letterSpacing: '.3em', color: S.imp }}>ENTERING COMBAT</div>
        <div style={{ fontSize: '.55rem', letterSpacing: '.2em', color: S.muted, marginTop: '.4rem' }}>Preparing battlefield...</div>
      </div>
    </div>
  );

  if (!combatData?.in_combat) return (
    <div style={{ minHeight: '100vh', background: S.night, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: S.fh, letterSpacing: '.2em', color: S.muted }}>NOT IN COMBAT</p>
    </div>
  );

  const ps = combatData.player_stats;

  return (
    <div style={{ minHeight: '100vh', background: S.night, color: S.cream, fontFamily: S.fm, fontSize: 13, position: 'relative', overflow: 'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
        @keyframes scan        { 0%{top:-1px;opacity:0} 5%{opacity:1} 95%{opacity:.15} 100%{top:100vh;opacity:0} }
        @keyframes spin        { to{transform:rotate(360deg)} }
        @keyframes pulse-bdr   { 0%,100%{box-shadow:0 0 0 0 rgba(251,54,64,.4)} 50%{box-shadow:0 0 0 4px rgba(251,54,64,0)} }
        @keyframes hit-flash   { 0%{background:rgba(251,54,64,.3)} 100%{background:rgba(255,255,255,.02)} }
        .cv-scanline           { position:fixed;left:0;right:0;height:1px;background:rgba(251,54,64,.2);animation:scan 7s linear infinite;pointer-events:none;z-index:999; }
        .cv-enemy              { transition:border-color .2s,background .2s; }
        .cv-enemy:hover        { border-color:rgba(251,54,64,.45)!important; }
        .cv-enemy.selected     { animation:pulse-bdr 2s ease-in-out infinite; }
        .cv-enemy.hit          { animation:hit-flash .5s ease-out forwards; }
        .cv-log::-webkit-scrollbar       { width:2px }
        .cv-log::-webkit-scrollbar-thumb { background:rgba(251,54,64,.4);border-radius:2px; }
        .cv-abil-btn:hover:not(:disabled){ border-color:rgba(168,85,247,.7)!important;background:rgba(168,85,247,.15)!important; }
        .cv-sidebar::-webkit-scrollbar       { width:2px }
        .cv-sidebar::-webkit-scrollbar-thumb { background:rgba(251,54,64,.3); }
      `}</style>

      <div className="cv-scanline" aria-hidden="true" />

      {/* ambient glow */}
      <div aria-hidden="true" style={{ position:'fixed', top:'20%', left:'30%', width:500, height:400, background:'radial-gradient(ellipse,rgba(251,54,64,.04) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }} />

      {/* ── HEADER ── */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          background: 'rgba(0,0,0,.7)',
          borderBottom: `1px solid ${S.border}`,
          padding: '.9rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative', width: 10, height: 10, flexShrink: 0 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: S.imp }} />
            <div style={{ position:'absolute', inset:-3, borderRadius:'50%', border:`1px solid ${S.imp}`, opacity:.4, animation:'pulse-bdr 1.5s ease-in-out infinite' }} />
          </div>
          <div>
            <div style={{ fontSize: '.5rem', letterSpacing: '.4em', textTransform: 'uppercase', color: S.muted }}>Active Engagement</div>
            <div style={{ fontFamily: S.fh, fontSize: '1.8rem', letterSpacing: '.15em', color: S.imp, lineHeight: 1, textShadow: `0 0 30px ${S.impGlow}` }}>
              COMBAT MODE
            </div>
          </div>
        </div>

        {/* right — initiative */}
        {combatData.turn_order && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '.5rem', letterSpacing: '.3em', textTransform: 'uppercase', color: S.muted, marginBottom: 5 }}>Initiative Order</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
              {combatData.turn_order.map((t, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                  {i > 0 && <span style={{ color: S.imp, fontSize: '.7rem' }}>›</span>}
                  <span style={{
                    fontSize: '.6rem',
                    letterSpacing: '.08em',
                    color: i === 0 ? S.cream : S.muted,
                    fontFamily: i === 0 ? S.fh : S.fm,
                    padding: i === 0 ? '2px 8px' : 0,
                    background: i === 0 ? S.impDim : 'transparent',
                    border: i === 0 ? `1px solid ${S.border}` : 'none',
                  }}>{t}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.header>

      {/* ── ERROR ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ margin: '.5rem 1.5rem', padding: '.5rem .9rem', border: `1px solid rgba(251,54,64,.4)`, background: 'rgba(251,54,64,.07)', fontSize: '.6rem', letterSpacing: '.12em', color: S.imp, display: 'flex', alignItems: 'center', gap: '.5rem' }}
          >
            <AlertTriangle size={12} /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', minHeight: 'calc(100vh - 64px)', position: 'relative', zIndex: 1 }}>

        {/* ── SIDEBAR ── */}
        <motion.aside
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="cv-sidebar"
          style={{
            borderRight: `1px solid ${S.border}`,
            padding: '1.5rem 1.2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.4rem',
            background: 'rgba(0,0,0,.4)',
            position: 'sticky',
            top: 64,
            height: 'calc(100vh - 64px)',
            overflowY: 'auto',
          }}
        >
          {/* identity */}
          <div>
            <div style={{ fontSize: '.5rem', letterSpacing: '.3em', textTransform: 'uppercase', color: S.muted, marginBottom: '.5rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
              <span style={{ width: '1rem', height: 1, background: S.imp, display: 'inline-block' }} />
              Fighter
            </div>
            <div style={{ fontFamily: S.fh, fontSize: '1.8rem', letterSpacing: '.06em', lineHeight: 1, color: S.cream }}>
              {ps.name || 'Hero'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginTop: 6 }}>
              <span style={{ fontSize: '.5rem', letterSpacing: '.18em', textTransform: 'uppercase', color: S.imp, padding: '2px 7px', border: `1px solid ${S.border}`, background: S.impDim, fontFamily: S.fh }}>
                {ps.characterClass || 'Warrior'}
              </span>
              <span style={{ fontSize: '.5rem', letterSpacing: '.18em', textTransform: 'uppercase', color: S.muted }}>
                LV.{ps.level || 1}
              </span>
            </div>
          </div>

          {/* vitals */}
          <div>
            <SectionHead>Vitals</SectionHead>
            <ResourceBar label="Health"  current={ps.hp}      max={ps.max_hp}      color={S.imp}    />
            <ResourceBar label="Mana"    current={ps.mana}    max={ps.max_mana}    color={S.blue}   />
            <ResourceBar label="Stamina" current={ps.stamina} max={ps.max_stamina} color={S.orange} />
          </div>

          {/* status effects */}
          {ps.status_effects?.length > 0 && (
            <div>
              <SectionHead color={S.purple}>Status</SectionHead>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {ps.status_effects.map((fx, i) => (
                  <span key={i} style={{ fontSize: '.5rem', letterSpacing: '.12em', textTransform: 'uppercase', padding: '3px 7px', border: '1px solid rgba(168,85,247,.35)', color: S.purple, background: 'rgba(168,85,247,.08)' }}>{fx}</span>
                ))}
              </div>
            </div>
          )}

          {/* divider */}
          <div style={{ height: 1, background: `linear-gradient(90deg, ${S.border}, transparent)` }} />

          {/* quick stats */}
          <div>
            <SectionHead>Stats</SectionHead>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' }}>
              {[
                { label: 'Attack',  val: ps.attack  ?? ps.attack_power   ?? '—' },
                { label: 'Defense', val: ps.defense ?? ps.defense_rating  ?? '—' },
                { label: 'Speed',   val: ps.speed   ?? ps.agility         ?? '—' },
                { label: 'Luck',    val: ps.luck    ?? '—' },
              ].map(({ label, val }) => (
                <div key={label} style={{ border: `1px solid ${S.border}`, padding: '.5rem .6rem', background: 'rgba(255,255,255,.02)', clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)' }}>
                  <div style={{ fontSize: '.45rem', letterSpacing: '.25em', textTransform: 'uppercase', color: S.muted }}>{label}</div>
                  <div style={{ fontFamily: S.fh, fontSize: '1.1rem', color: S.cream, lineHeight: 1, marginTop: 2 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* tactical tip */}
          <div style={{ marginTop: 'auto', border: `1px solid rgba(255,184,48,.15)`, padding: '.8rem', background: 'rgba(255,184,48,.03)' }}>
            <div style={{ fontSize: '.5rem', letterSpacing: '.25em', textTransform: 'uppercase', color: S.gold, marginBottom: '.4rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
              <span style={{ width: '.6rem', height: 1, background: S.gold, display: 'inline-block' }} /> Tactical Tip
            </div>
            <div style={{ fontSize: '.55rem', color: S.muted, lineHeight: 1.7 }}>
              Select an enemy card, then choose your action. Watch enemy HP bars closely.
            </div>
          </div>
        </motion.aside>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>

          {/* ── ENEMIES ── */}
          <div style={{ padding: '1.5rem', borderBottom: `1px solid ${S.border}`, flex: 1 }}>
            <SectionHead>
              Enemies · {combatData.enemies.length} {combatData.enemies.length === 1 ? 'Remaining' : 'Encountered'}
            </SectionHead>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1rem' }}>
              {combatData.enemies.map((enemy, idx) => (
                <motion.div
                  key={idx}
                  className={`cv-enemy${selectedTarget === idx ? ' selected' : ''}${hitFlash === idx ? ' hit' : ''}`}
                  animate={shakeTarget === idx ? { x: [0,-10,10,-10,10,0] } : { x: 0 }}
                  transition={{ duration: .5 }}
                  onClick={() => setSelectedTarget(idx)}
                  style={{
                    border: `1px solid ${selectedTarget === idx ? S.imp : S.border}`,
                    padding: '1.2rem',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    background: selectedTarget === idx ? 'rgba(251,54,64,.07)' : 'rgba(255,255,255,.02)',
                    clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
                  }}
                >
                  {/* top accent */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: selectedTarget === idx ? S.imp : 'transparent', transition: 'background .2s' }} />

                  {enemy.is_boss && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '.5rem', letterSpacing: '.2em', textTransform: 'uppercase', background: S.imp, color: S.night, padding: '2px 8px', marginBottom: '.6rem', fontFamily: S.fh }}>
                      ★ BOSS
                    </div>
                  )}

                  {selectedTarget === idx && (
                    <div style={{ position: 'absolute', top: '.7rem', right: '.7rem', fontSize: '.5rem', letterSpacing: '.2em', textTransform: 'uppercase', color: S.imp, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: S.imp, display: 'inline-block' }} />
                      TARGET
                    </div>
                  )}

                  <div style={{ fontFamily: S.fh, fontSize: '1.3rem', letterSpacing: '.08em', marginBottom: 2 }}>{enemy.name}</div>
                  <div style={{ fontSize: '.5rem', letterSpacing: '.2em', textTransform: 'uppercase', color: S.muted, marginBottom: '.8rem' }}>
                    Lv.{enemy.level} · {enemy.type}
                  </div>
                  <ResourceBar label="HP" current={enemy.hp} max={enemy.max_hp} color={S.imp} />

                  {enemy.status_effects?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: '.5rem' }}>
                      {enemy.status_effects.map((fx, i) => (
                        <span key={i} style={{ fontSize: '.5rem', letterSpacing: '.1em', textTransform: 'uppercase', padding: '2px 5px', border: '1px solid rgba(168,85,247,.35)', color: S.purple, background: 'rgba(168,85,247,.08)' }}>{fx}</span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── ACTIONS ── */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: .15 }}
            style={{ padding: '1.2rem 1.5rem', borderTop: `1px solid ${S.border}`, background: 'rgba(0,0,0,.3)' }}
          >
            <SectionHead>Actions</SectionHead>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '.6rem', marginBottom: '.75rem' }}>
              <ActionBtn label="Attack"  icon={<Sword size={18}/>}  color={S.imp}    border="rgba(251,54,64,.5)"   onClick={() => handleCombatAction('attack')}      disabled={actionLoading} />
              <ActionBtn label="Ability" icon={<Zap size={18}/>}    color={S.purple} border="rgba(168,85,247,.5)"  onClick={() => setShowAbilities(v => !v)}          disabled={actionLoading} />
              <ActionBtn label="Defend"  icon={<Shield size={18}/>} color={S.blue}   border="rgba(80,136,255,.5)"  onClick={() => handleCombatAction('defend')}       disabled={actionLoading} />
              <ActionBtn label="Flee"    icon={<Wind size={18}/>}   color={S.orange} border="rgba(255,144,32,.5)"  onClick={() => handleCombatAction('flee')}         disabled={actionLoading} />
            </div>

            {/* abilities panel */}
            <AnimatePresence>
              {showAbilities && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ border: '1px solid rgba(168,85,247,.25)', padding: '1rem', marginBottom: '.75rem', background: S.purpleDim, overflow: 'hidden' }}
                >
                  <div style={{ fontSize: '.55rem', letterSpacing: '.3em', textTransform: 'uppercase', color: S.purple, marginBottom: '.75rem', fontFamily: S.fh }}>
                    Choose Ability
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.5rem' }}>
                    {ABILITIES.map((ab, i) => (
                      <motion.button
                        key={i}
                        className="cv-abil-btn"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * .07 }}
                        whileTap={{ scale: .97 }}
                        onClick={() => handleCombatAction('ability', ab.name)}
                        disabled={actionLoading}
                        style={{
                          border: '1px solid rgba(168,85,247,.25)',
                          padding: '.8rem',
                          cursor: 'pointer',
                          background: 'rgba(168,85,247,.05)',
                          textAlign: 'left',
                          color: S.cream,
                          opacity: actionLoading ? .35 : 1,
                          transition: 'all .15s',
                          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)',
                        }}
                      >
                        <span style={{ display: 'flex', marginBottom: '.4rem', color: S.purple }}>{ab.icon}</span>
                        <span style={{ fontFamily: S.fh, fontSize: '.9rem', letterSpacing: '.06em', display: 'block' }}>{ab.name}</span>
                        <span style={{ fontSize: '.5rem', letterSpacing: '.12em', color: 'rgba(168,85,247,.65)', display: 'block', margin: '.2rem 0' }}>{ab.cost}</span>
                        <span style={{ fontSize: '.5rem', color: S.muted, display: 'block', lineHeight: 1.5 }}>{ab.description}</span>
                      </motion.button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowAbilities(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '.3rem', fontSize: '.55rem', letterSpacing: '.15em', textTransform: 'uppercase', color: S.muted, cursor: 'pointer', background: 'none', border: 'none', marginTop: '.75rem', transition: 'color .15s', fontFamily: S.fm }}
                    onMouseEnter={e => e.currentTarget.style.color = S.cream}
                    onMouseLeave={e => e.currentTarget.style.color = S.muted}
                  >
                    <ChevronLeft size={12} /> Back
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* action loading */}
            <AnimatePresence>
              {actionLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '.6rem', fontSize: '.55rem', letterSpacing: '.25em', textTransform: 'uppercase', color: S.imp, paddingTop: '.4rem' }}
                >
                  <div style={{ width: 12, height: 12, border: `1.5px solid ${S.border}`, borderTopColor: S.imp, borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
                  Executing action...
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── COMBAT LOG ── */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: .25 }}
            style={{ borderTop: `1px solid ${S.border}`, padding: '1rem 1.5rem', background: 'rgba(0,0,0,.2)' }}
          >
            <SectionHead color={S.gold}>Combat Log</SectionHead>
            <div
              ref={logRef}
              className="cv-log"
              style={{ height: 130, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}
            >
              {combatData.combat_log?.length > 0 ? combatData.combat_log.map((entry, i, arr) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * .03 }}
                  style={{
                    fontSize: '.6rem',
                    letterSpacing: '.07em',
                    color: i === arr.length - 1 ? S.cream : S.muted,
                    borderLeft: `2px solid ${i === arr.length - 1 ? S.imp : S.border}`,
                    paddingLeft: '.6rem',
                    lineHeight: 1.6,
                  }}
                >
                  {entry}
                </motion.div>
              )) : (
                <div style={{ fontSize: '.6rem', color: S.muted, fontStyle: 'italic' }}>Awaiting first move...</div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default CombatView;