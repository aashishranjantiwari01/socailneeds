import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Shield, Zap, Lock, Headphones,
  Users, CheckCircle, Globe, Clock,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   CSS — glossy stat cards + beam border
───────────────────────────────────────────── */
const TRUST_CSS = `
@property --trust-angle          { syntax:"<angle>";      initial-value:0deg;  inherits:false }
@property --trust-angle-offset   { syntax:"<angle>";      initial-value:0deg;  inherits:false }
@property --trust-percent        { syntax:"<percentage>"; initial-value:5%;    inherits:false }
@property --trust-shine          { syntax:"<color>";      initial-value:white; inherits:false }

@keyframes trust-spin  { to { --trust-angle: 360deg } }
@keyframes trust-float { 0%,100%{translate:0 0} 50%{translate:0 -4px} }
@keyframes trust-pulse { 0%,100%{opacity:.4} 50%{opacity:.85} }
@keyframes trust-beam-top    { from{left:-55%}  to{left:110%} }
@keyframes trust-beam-right  { from{top:-55%}   to{top:110%} }
@keyframes trust-beam-bottom { from{right:-55%} to{right:110%} }
@keyframes trust-beam-left   { from{bottom:-55%} to{bottom:110%} }

/* ── Stat card — conic shiny border ── */
.stat-card {
  isolation: isolate;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: 20px;
  background:
    linear-gradient(145deg, #07101f 0%, #0a1628 60%, #06111e 100%) padding-box,
    conic-gradient(
      from calc(var(--trust-angle) - var(--trust-angle-offset)),
      transparent,
      var(--stat-acc, #3d6bff) var(--trust-percent),
      var(--trust-shine)       calc(var(--trust-percent) * 2),
      var(--stat-acc, #3d6bff) calc(var(--trust-percent) * 3),
      transparent              calc(var(--trust-percent) * 4)
    ) border-box;
  animation: trust-spin 5s linear infinite,
             trust-spin calc(5s / 0.4) reverse paused;
  animation-composition: add;
  transition: 700ms cubic-bezier(.25,1,.5,1);
  transition-property: --trust-angle-offset, --trust-percent, --trust-shine, transform, box-shadow;
  cursor: default;
}

.stat-card::before {
  content: '';
  pointer-events: none;
  position: absolute; inset: 0;
  border-radius: inherit;
  background: radial-gradient(ellipse at 25% 15%, rgba(255,255,255,.08), transparent 65%);
  z-index: 1;
}

/* Dot-pattern mask layer */
.stat-card::after {
  content: '';
  pointer-events: none;
  position: absolute;
  inset-inline-start: 50%; inset-block-start: 50%;
  translate: -50% -50%;
  --s: calc(100% - 4px); --p: 2px; --sp: calc(var(--p) * 2);
  width: var(--s); height: var(--s);
  background: radial-gradient(circle at var(--p) var(--p), white calc(var(--p)/4), transparent 0) padding-box;
  background-size: var(--sp) var(--sp);
  background-repeat: space;
  mask-image: conic-gradient(from calc(var(--trust-angle) + 45deg), black, transparent 10% 90%, black);
  border-radius: inherit;
  opacity: 0; z-index: 1;
  transition: opacity 500ms;
  animation: trust-spin 5s linear infinite,
             trust-spin calc(5s / 0.4) reverse paused;
  animation-composition: add;
}

.stat-card:hover {
  --trust-percent: 20%;
  --trust-angle-offset: 95deg;
  --trust-shine: rgba(132,180,255,1);
  animation-play-state: running, running;
  transform: translateY(-5px);
}
.stat-card:hover::after { opacity:.22; animation-play-state: running,running; }

/* Inner shimmer on hover */
.stat-card .stat-shimmer {
  position: absolute; inset: 0; border-radius: inherit;
  background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%);
  opacity: 0; transition: opacity .4s; z-index: 2; pointer-events: none;
}
.stat-card:hover .stat-shimmer { opacity: 1; }

/* Glow behind icon */
.stat-glow {
  transition: opacity .4s;
  opacity: 0; pointer-events: none;
}
.stat-card:hover .stat-glow { opacity: .7; animation: trust-pulse 2.4s ease-in-out infinite; }

/* Icon float */
.stat-card:hover .stat-icon { animation: trust-float 2.4s ease-in-out infinite; }

/* ── Feature card beam border ── */
.feat-card {
  position: relative;
  background: linear-gradient(145deg, #07101f 0%, #0b1829 60%, #060f1c 100%);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 18px;
  overflow: hidden;
  transition: border-color .4s, transform .3s cubic-bezier(.25,1,.5,1), box-shadow .4s;
}
.feat-card:hover { border-color: rgba(255,255,255,0.14); transform: translateY(-4px); }

.feat-card .fb-top    { position:absolute; top:0;    left:-55%;   height:1.5px; width:55%; background:linear-gradient(90deg,transparent,white,transparent); border-radius:999px; filter:blur(1px); opacity:0; }
.feat-card .fb-right  { position:absolute; right:0;  top:-55%;    width:1.5px;  height:55%; background:linear-gradient(180deg,transparent,white,transparent); border-radius:999px; filter:blur(1px); opacity:0; }
.feat-card .fb-bottom { position:absolute; bottom:0; right:-55%;  height:1.5px; width:55%; background:linear-gradient(90deg,transparent,white,transparent); border-radius:999px; filter:blur(1px); opacity:0; }
.feat-card .fb-left   { position:absolute; left:0;   bottom:-55%; width:1.5px;  height:55%; background:linear-gradient(180deg,transparent,white,transparent); border-radius:999px; filter:blur(1px); opacity:0; }

.feat-card:hover .fb-top    { opacity:.6; animation: trust-beam-top    2s ease-in-out infinite; }
.feat-card:hover .fb-right  { opacity:.6; animation: trust-beam-right  2s ease-in-out .5s infinite; }
.feat-card:hover .fb-bottom { opacity:.6; animation: trust-beam-bottom 2s ease-in-out 1s infinite; }
.feat-card:hover .fb-left   { opacity:.6; animation: trust-beam-left   2s ease-in-out 1.5s infinite; }
`;

let trustInjected = false;
function injectTrustStyles() {
  if (trustInjected || typeof document === 'undefined') return;
  trustInjected = true;
  const s = document.createElement('style');
  s.textContent = TRUST_CSS;
  document.head.appendChild(s);
}

/* ── Stats data (updated numbers) ── */
const stats = [
  { value: 100,  suffix: '+',  label: 'Trusted Clients',   Icon: Users,        acc: '#3b82f6', glow: 'rgba(59,130,246,0.55)'  },
  { value: 200,  suffix: '+',  label: 'Happy Customers',   Icon: CheckCircle,  acc: '#22d3ee', glow: 'rgba(34,211,238,0.5)'   },
  { value: 99,   suffix: '%',  label: 'Success Rate',      Icon: Globe,        acc: '#a78bfa', glow: 'rgba(167,139,250,0.5)'  },
  { value: 24,   suffix: '/7', label: 'Availability',      Icon: Clock,        acc: '#34d399', glow: 'rgba(52,211,153,0.5)'   },
];

/* ── Feature cards ── */
const features = [
  { Icon: Shield,    title: 'Verified & Trusted',   desc: 'Proven track record with hundreds of successful cases across every platform.', acc: '#3b82f6' },
  { Icon: Zap,       title: 'Lightning Fast',        desc: 'Industry-leading turnaround times. Most services completed within 24-48 hours.', acc: '#facc15' },
  { Icon: Lock,      title: '100% Confidential',     desc: 'Your information and transactions are kept strictly private and secure.', acc: '#a78bfa' },
  { Icon: Headphones,title: '24/7 Support',          desc: "Round-the-clock availability. We're always here when you need us.", acc: '#22d3ee' },
];

/* ── Animated counter ── */
const Counter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let frame: number;
    const dur = 1800;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setCount(Math.floor(ease * target));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/* ── StatCard ── */
const StatCard = ({ s, index, inView }: { s: typeof stats[number]; index: number; inView: boolean }) => {
  useEffect(() => { injectTrustStyles(); }, []);

  return (
    <motion.div
      className="stat-card flex flex-col items-center justify-center gap-3 p-6 md:p-8 text-center"
      style={{ '--stat-acc': s.acc } as React.CSSProperties}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.1 + index * 0.1 }}
    >
      <div className="stat-shimmer" />

      {/* Glow halo */}
      <div
        className="stat-glow absolute top-4 left-1/2 -translate-x-1/2 w-20 h-10 rounded-full blur-2xl"
        style={{ background: s.glow }}
      />

      {/* Icon */}
      <div
        className="stat-icon relative z-10 w-11 h-11 rounded-xl flex items-center justify-center mb-1"
        style={{
          background: `${s.acc}18`,
          border: `1px solid ${s.acc}44`,
          boxShadow: `0 0 20px ${s.glow}`,
        }}
      >
        <s.Icon size={20} style={{ color: s.acc }} />
      </div>

      {/* Number */}
      <div
        className="relative z-10 text-4xl md:text-5xl font-black tracking-tight leading-none"
        style={{
          background: `linear-gradient(135deg, white 30%, ${s.acc})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        <Counter target={s.value} suffix={s.suffix} />
      </div>

      {/* Label */}
      <p className="relative z-10 text-sm font-medium text-white/50 tracking-wide">{s.label}</p>

      {/* Bottom accent line */}
      <div
        className="relative z-10 h-[2px] w-10 rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${s.acc}, transparent)` }}
      />
    </motion.div>
  );
};

/* ── Main section ── */
const TrustSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => { injectTrustStyles(); }, []);

  return (
    <section id="trust" className="relative py-24 md:py-32 px-6" ref={ref}>
      {/* Ambient bg glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/[0.05] rounded-full blur-[130px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Why Choose Us
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mt-2 mb-5 leading-tight">
            Built on{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #60a5fa, #22d3ee, #818cf8)' }}
            >
              Trust
            </span>
          </h2>
          <p className="text-white/40 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Numbers that speak for themselves — real results, real clients.
          </p>
        </motion.div>

        {/* ── STATS GRID (now first) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <StatCard key={s.label} s={s} index={i} inView={inView} />
          ))}
        </div>

        {/* Partition divider */}
        <motion.div
          className="relative flex items-center gap-4 my-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-white/10" />
          <span className="text-xs text-white/25 uppercase tracking-widest font-medium px-2 whitespace-nowrap">
            What sets us apart
          </span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/10 to-white/10" />
        </motion.div>

        {/* ── FEATURE CARDS (now second) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="feat-card group p-6 md:p-7"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.55 + i * 0.1 }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 36px -8px ${f.acc}44`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              {/* Beam borders */}
              <div className="fb-top" /><div className="fb-right" />
              <div className="fb-bottom" /><div className="fb-left" />

              {/* Specular layer */}
              <div className="absolute inset-0 rounded-[18px] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 25% 15%, rgba(255,255,255,0.045), transparent 65%)' }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:-translate-y-1"
                  style={{
                    background: `${f.acc}18`,
                    border: `1px solid ${f.acc}44`,
                    boxShadow: `0 0 20px ${f.acc}33`,
                  }}
                >
                  <f.Icon size={20} style={{ color: f.acc }} />
                </div>

                {/* Title */}
                <h3 className="text-white font-bold text-base mb-2 tracking-tight">{f.title}</h3>

                {/* Accent underline */}
                <div
                  className="h-[2px] w-8 rounded-full mb-3 transition-all duration-300 group-hover:w-14"
                  style={{ background: `linear-gradient(90deg, ${f.acc}, transparent)` }}
                />

                {/* Description */}
                <p className="text-sm text-white/45 leading-relaxed group-hover:text-white/60 transition-colors duration-300">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
