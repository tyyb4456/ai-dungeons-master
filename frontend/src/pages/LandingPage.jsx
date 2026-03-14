import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Swords, ScrollText, TrendingUp } from "lucide-react";

const FEATURES = [
  {
    num: "01",
    icon: Swords,
    title: "Dynamic Combat",
    desc: "Turn-based battles against intelligent AI enemies. Each encounter adapts to your playstyle — no two fights are ever the same.",
  },
  {
    num: "02",
    icon: ScrollText,
    title: "Living Narrative",
    desc: "Your choices reshape the world. The AI crafts a branching story in real-time — consequences are real, alliances are fragile.",
  },
  {
    num: "03",
    icon: TrendingUp,
    title: "Character Growth",
    desc: "Level up, unlock abilities, and forge your identity through gear, skills, and decisions that permanently mark your legend.",
  },
];

const TICKER_ITEMS = [
  'Dynamic Combat', 'Living Narrative', '100+ Enemies',
  'AI Dungeon Master', 'Forge Your Legend', 'Infinite Stories',
];

const MARQUEE_ITEMS = [
  'Powered by Claude AI', 'Real-time narrative', 'Infinite replayability',
  'Dynamic world-building', 'Turn-based combat', 'Character progression',
];

export default function LandingPage() {
  const scanRef = useRef(null);

  return (
    <div style={{ background: '#000F08', color: '#E8E0D0', fontFamily: "'Space Mono', monospace", overflowX: 'hidden', minHeight: '100vh' }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

        :root {
          --night: #000F08;
          --imperial: #FB3640;
          --imperial-dim: rgba(251,54,64,0.12);
          --imperial-glow: rgba(251,54,64,0.4);
          --cream: #E8E0D0;
          --muted: rgba(232,224,208,0.5);
          --border: rgba(251,54,64,0.2);
        }

        * { box-sizing: border-box; }

        .dm-nav-link {
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.2s;
          font-family: 'Space Mono', monospace;
        }
        .dm-nav-link:hover { color: var(--imperial); }

        .dm-nav-cta {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--night);
          background: var(--imperial);
          padding: 0.6rem 1.5rem;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
          display: inline-block;
        }
        .dm-nav-cta:hover { background: #ff4a54; transform: translateY(-1px); }

        .dm-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--imperial);
          color: var(--night);
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 1rem 2rem;
          transition: transform 0.2s, box-shadow 0.2s;
          border: none;
          cursor: crosshair;
          position: relative;
          overflow: hidden;
        }
        .dm-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px var(--imperial-glow);
        }

        .dm-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid var(--border);
          color: var(--muted);
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 1rem 1.5rem;
          transition: border-color 0.2s, color 0.2s;
          background: transparent;
          cursor: crosshair;
        }
        .dm-btn-ghost:hover { border-color: var(--imperial); color: var(--imperial); }

        .dm-feature-card {
          padding: 3rem 2.5rem;
          border-right: 1px solid var(--border);
          position: relative;
          overflow: hidden;
          transition: background 0.3s;
          cursor: default;
          flex: 1;
        }
        .dm-feature-card:last-child { border-right: none; }
        .dm-feature-card:hover { background: var(--imperial-dim); }

        .dm-stat-item {
          padding: 3rem 3.5rem;
          border-right: 1px solid var(--border);
          position: relative;
          overflow: hidden;
          flex: 1;
        }
        .dm-stat-item:last-child { border-right: none; }

        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scan {
          0%   { top: -2px; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 0.3; }
          100% { top: 100vh; opacity: 0; }
        }
        @keyframes floatCard {
          0%, 100% { transform: translate(-50%, -50%) rotate(-3deg) translateY(0px); }
          50%       { transform: translate(-50%, -50%) rotate(-3deg) translateY(-12px); }
        }

        .dm-ticker-inner {
          display: inline-flex;
          gap: 3rem;
          animation: ticker 20s linear infinite;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.9rem;
          letter-spacing: 0.2em;
          color: var(--night);
        }

        .dm-marquee-inner {
          display: flex;
          gap: 2rem;
          animation: ticker 30s linear infinite;
        }

        .dm-marquee-tag {
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .dm-marquee-tag::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 4px;
          background: var(--imperial);
          transform: rotate(45deg);
          flex-shrink: 0;
        }

        .dm-scan-line {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(251, 54, 64, 0.3);
          animation: scan 8s linear infinite;
          pointer-events: none;
          z-index: 1000;
        }

        .dm-float-card {
          position: absolute;
          width: 260px;
          height: 360px;
          top: 50%;
          left: 50%;
          animation: floatCard 4s ease-in-out infinite;
          background: linear-gradient(135deg, #0a1a10, #050e06);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .dm-hero-grid   { grid-template-columns: 1fr !important; }
          .dm-hero-visual { display: none !important; }
          .dm-stats-bar   { flex-direction: column !important; }
          .dm-stat-item   { border-right: none !important; border-bottom: 1px solid var(--border) !important; }
          .dm-features-grid { flex-direction: column !important; }
          .dm-feature-card  { border-right: none !important; border-bottom: 1px solid var(--border) !important; }
          .dm-section { padding: 4rem 1.5rem !important; }
          .dm-footer { flex-direction: column !important; gap: 1rem !important; text-align: center !important; }
        }
      `}</style>

      {/* Scan line */}
      {/* <div className="dm-scan-line" aria-hidden="true" /> */}

      {/* NAV */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1.5rem 3rem',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(0,15,8,0.88)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '0.15em', color: 'var(--cream)' }}>
          AI<span style={{ color: 'var(--imperial)' }}>⚔</span>DM
        </div>
        <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', listStyle: 'none' }}>
          <a href="#features" className="dm-nav-link">Features</a>
          <a href="#lore" className="dm-nav-link">Lore</a>
          <Link to="/create-character" className="dm-nav-cta">Begin Quest</Link>
        </nav>
      </motion.nav>

      {/* HERO */}
      <section
        className="dm-hero-grid"
        style={{
          minHeight: '100vh',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          paddingTop: '5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '5rem 3rem 5rem 4rem', position: 'relative', zIndex: 2 }}>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--imperial)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <span style={{ display: 'inline-block', width: '2.5rem', height: '1px', background: 'var(--imperial)' }} />
            AI-Powered Narrative Engine
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(5rem,10vw,9rem)', lineHeight: 0.9, letterSpacing: '0.02em', marginBottom: '2rem' }}
          >
            <span style={{ color: 'var(--imperial)', display: 'block' }}>YOUR</span>
            <span style={{ color: 'var(--cream)', display: 'block' }}>LEGEND</span>
            <span style={{ display: 'block', color: 'transparent', WebkitTextStroke: '1px rgba(232,224,208,0.25)' }}>AWAITS</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{ fontSize: '0.8rem', lineHeight: 1.9, color: 'var(--muted)', maxWidth: '380px', marginBottom: '3rem', fontStyle: 'italic' }}
          >
            Enter a world where every choice echoes through eternity.
            An AI Dungeon Master breathes life into your darkest battles,
            sharpest alliances, and most impossible triumphs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/create-character" className="dm-btn-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
              Begin Your Quest
            </Link>
            <button className="dm-btn-ghost">Watch Trailer</button>
          </motion.div>
        </div>

        {/* Right — floating character card */}
        <div
          className="dm-hero-visual"
          style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(251,54,64,0.1) 0%, transparent 70%)' }} />
          <div style={{ position: 'relative', width: 380, height: 500 }}>
            {/* Accent cards */}
            <div style={{ position: 'absolute', width: 160, height: 220, background: 'var(--imperial-dim)', border: '1px solid rgba(251,54,64,0.3)', right: 20, top: 60, transform: 'rotate(6deg)', zIndex: 0 }} />
            <div style={{ position: 'absolute', width: 120, height: 160, border: '1px solid rgba(232,224,208,0.07)', left: 30, bottom: 40, transform: 'rotate(-8deg)', zIndex: 0 }} />
            {/* Main floating card */}
            <div className="dm-float-card">
              <Swords size={56} color="#FB3640" strokeWidth={2.5} />
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.1em', color: 'var(--imperial)' }}>SHADOW WARRIOR</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', width: '80%' }}>
                {[['47','ATK'],['32','DEF'],['89','HP'],['LV.9','RANK']].map(([val, lbl]) => (
                  <div key={lbl} style={{ border: '1px solid var(--border)', padding: '0.5rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', color: 'var(--cream)' }}>{val}</div>
                    <div style={{ fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 2 }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div aria-hidden="true" style={{ background: 'var(--imperial)', overflow: 'hidden', padding: '0.6rem 0', whiteSpace: 'nowrap' }}>
        <div className="dm-ticker-inner">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i}>
              {item}
              {i % 1 === 0 && <span style={{ margin: '0 1rem', opacity: 0.5 }}>✦</span>}
            </span>
          ))}
        </div>
      </div>

      {/* STATS BAR */}
      <div
        className="dm-stats-bar"
        style={{ display: 'flex', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
      >
        {[['∞','Unique Story Paths'],['100+','Crafted Enemies'],['AI','Powered Narrative Core']].map(([num, label]) => (
          <div key={label} className="dm-stat-item">
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '4.5rem', lineHeight: 1, color: 'var(--imperial)', marginBottom: '0.5rem', position: 'relative', zIndex: 1 }}>{num}</div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--muted)', position: 'relative', zIndex: 1 }}>{label}</div>
            <div style={{ position: 'absolute', right: -10, bottom: -20, fontFamily: "'Bebas Neue', sans-serif", fontSize: '8rem', color: 'rgba(251,54,64,0.04)', lineHeight: 1, pointerEvents: 'none' }} aria-hidden="true">{num}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section id="features" className="dm-section" style={{ padding: '7rem 4rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.8rem', letterSpacing: '0.3em', color: 'var(--imperial)', marginBottom: '0.5rem' }}>02 — ARSENAL</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3.5rem', lineHeight: 1, letterSpacing: '0.04em' }}>EPIC FEATURES</h2>
          </div>
          <Link to="/create-character" className="dm-btn-ghost">View All →</Link>
        </div>

        <div className="dm-features-grid" style={{ display: 'flex', border: '1px solid var(--border)' }}>
   {FEATURES.map((f, i) => {
  const Icon = f.icon;

  return (
    <motion.div
      key={f.num}
      className="dm-feature-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.15 }}
      viewport={{ once: true }}
    >
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '5rem', color: 'rgba(251,54,64,0.07)', lineHeight: 1, marginBottom: '-1rem' }}>
        {f.num}
      </div>

      {/* ICON */}
      <div style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
        <Icon size={36} color="#FB3640" />
      </div>

      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.04em', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
        {f.title}
      </h3>

      <p style={{ fontSize: '0.72rem', lineHeight: 1.9, color: 'var(--muted)', position: 'relative', zIndex: 1 }}>
        {f.desc}
      </p>
    </motion.div>
  );
})}
        </div>
      </section>

      {/* MARQUEE */}
      <div aria-hidden="true" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', overflow: 'hidden', padding: '1.5rem 0' }}>
        <div className="dm-marquee-inner">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="dm-marquee-tag">{item}</span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section style={{ padding: '8rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden', borderTop: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(251,54,64,0.07) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem,8vw,7rem)', lineHeight: 0.9, letterSpacing: '0.02em', marginBottom: '2rem', position: 'relative', zIndex: 1 }}
        >
          READY TO<br /><span style={{ color: 'var(--imperial)' }}>WRITE</span><br />YOUR STORY?
        </motion.h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '3rem', fontStyle: 'italic', position: 'relative', zIndex: 1 }}>
          // Join thousands of adventurers forging legendary tales //
        </p>
        <Link to="/create-character" className="dm-btn-primary" style={{ fontSize: '0.8rem', padding: '1.2rem 3rem', position: 'relative', zIndex: 1 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
          Start Your Adventure
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="dm-footer" style={{ padding: '2rem 4rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '0.1em' }}>
          AI<span style={{ color: 'var(--imperial)' }}>⚔</span>DUNGEON MASTER
        </div>
        <div style={{ fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>
          © 2025 AI Dungeon Master — Powered by Anthropic Claude
        </div>
      </footer>

    </div>
  );
}