import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, Send } from 'lucide-react';

/* ─────────────────────────────────────────────
   Injected CSS — traveling light beam border
───────────────────────────────────────────── */
const SVC_CSS = `
@keyframes svc-beam-top    { from { left: -55% }  to { left: 110% } }
@keyframes svc-beam-right  { from { top:  -55% }  to { top:  110% } }
@keyframes svc-beam-bottom { from { right: -55% } to { right: 110% } }
@keyframes svc-beam-left   { from { bottom: -55% } to { bottom: 110% } }
@keyframes svc-pulse-glow  { 0%,100% { opacity:.45 } 50% { opacity:.9 } }
@keyframes svc-icon-float  { 0%,100%{translate:0 0} 50%{translate:0 -5px} }

.svc-card {
  position: relative;
  background: linear-gradient(145deg, #07101f 0%, #0a1628 60%, #06111e 100%);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  overflow: hidden;
  transition: border-color .4s, box-shadow .4s, transform .3s cubic-bezier(.25,1,.5,1);
}

.svc-card:hover {
  border-color: rgba(255,255,255,0.14);
  transform: translateY(-4px);
}

/* Traveling light beams on hover */
.svc-card .beam-top {
  position: absolute; top: 0; left: -55%; height: 2px; width: 55%;
  background: linear-gradient(90deg, transparent, white, transparent);
  opacity: 0; border-radius: 999px;
  filter: blur(1.5px);
}
.svc-card:hover .beam-top {
  opacity: .65;
  animation: svc-beam-top 2.2s ease-in-out infinite;
}
.svc-card .beam-right {
  position: absolute; right: 0; top: -55%; width: 2px; height: 55%;
  background: linear-gradient(180deg, transparent, white, transparent);
  opacity: 0; border-radius: 999px;
  filter: blur(1.5px);
}
.svc-card:hover .beam-right {
  opacity: .65;
  animation: svc-beam-right 2.2s ease-in-out .55s infinite;
}
.svc-card .beam-bottom {
  position: absolute; bottom: 0; right: -55%; height: 2px; width: 55%;
  background: linear-gradient(90deg, transparent, white, transparent);
  opacity: 0; border-radius: 999px;
  filter: blur(1.5px);
}
.svc-card:hover .beam-bottom {
  opacity: .65;
  animation: svc-beam-bottom 2.2s ease-in-out 1.1s infinite;
}
.svc-card .beam-left {
  position: absolute; left: 0; bottom: -55%; width: 2px; height: 55%;
  background: linear-gradient(180deg, transparent, white, transparent);
  opacity: 0; border-radius: 999px;
  filter: blur(1.5px);
}
.svc-card:hover .beam-left {
  opacity: .65;
  animation: svc-beam-left 2.2s ease-in-out 1.65s infinite;
}

/* Corner glow dots */
.svc-card .corner-tl,
.svc-card .corner-tr,
.svc-card .corner-br,
.svc-card .corner-bl {
  position: absolute; border-radius: 50%;
  background: white; opacity: 0;
  filter: blur(1.5px); transition: opacity .3s;
}
.svc-card:hover .corner-tl,
.svc-card:hover .corner-tr,
.svc-card:hover .corner-br,
.svc-card:hover .corner-bl { opacity: .35; }
.corner-tl { top: 0; left: 0; width: 5px; height: 5px; }
.corner-tr { top: 0; right: 0; width: 8px; height: 8px; }
.corner-br { bottom: 0; right: 0; width: 8px; height: 8px; }
.corner-bl { bottom: 0; left: 0; width: 5px; height: 5px; }

/* Icon hover float */
.svc-card:hover .svc-icon { animation: svc-icon-float 2.4s ease-in-out infinite; }

/* Icon glow pulse */
.svc-card:hover .svc-glow { animation: svc-pulse-glow 2.4s ease-in-out infinite; opacity: .75 !important; }

/* CTA button */
.svc-cta {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 10px 0; border-radius: 12px;
  font-size: 13px; font-weight: 600; color: white;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  cursor: pointer; transition: background .25s, border-color .25s, box-shadow .25s;
  text-decoration: none;
}
.svc-cta:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.2);
}
`;

let svcInjected = false;
function injectSvcStyles() {
  if (svcInjected || typeof document === 'undefined') return;
  svcInjected = true;
  const s = document.createElement('style');
  s.textContent = SVC_CSS;
  document.head.appendChild(s);
}

/* ─────────────────────────────────────────────
   Platform data with 3D SVG icons + telegram
───────────────────────────────────────────── */
const platforms = [
  {
    name: 'Instagram',
    acc: '#d6249f',
    shadowColor: 'rgba(214,36,159,0.6)',
    telegramLink: 'https://t.me/despacito',
    icon: (
      <svg viewBox="0 0 52 52" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="svc-ig-bg" cx="30%" cy="107%" r="150%">
            <stop offset="0%"   stopColor="#fdf497"/>
            <stop offset="12%"  stopColor="#fce566"/>
            <stop offset="50%"  stopColor="#fd5949"/>
            <stop offset="68%"  stopColor="#d6249f"/>
            <stop offset="100%" stopColor="#285AEB"/>
          </radialGradient>
          <radialGradient id="svc-ig-spec" cx="28%" cy="22%" r="55%">
            <stop offset="0%"  stopColor="white" stopOpacity="0.55"/>
            <stop offset="60%" stopColor="white" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="svc-ig-rim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="85%"  stopColor="white" stopOpacity="0"/>
            <stop offset="100%" stopColor="rgba(253,84,73,0.6)" stopOpacity="1"/>
          </linearGradient>
        </defs>
        <ellipse cx="26" cy="50" rx="16" ry="3.5" fill="rgba(214,36,159,0.35)"/>
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#svc-ig-bg)"/>
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#svc-ig-rim)" opacity=".5"/>
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#svc-ig-spec)"/>
        <circle cx="26" cy="26" r="10.5" stroke="white" strokeWidth="3" fill="none"/>
        <circle cx="37" cy="15" r="2.8" fill="white"/>
        <rect x="5" y="5" width="42" height="42" rx="10" stroke="white" strokeWidth="1.8" fill="none" opacity="0.22"/>
      </svg>
    ),
    items: [
      'Lookup: Phone, Email, Location, Connected IDs, Device Info',
      'Manual Unbans & Recoveries via Portal',
      'Account Removals — Fastest Bans (0–5 M)',
      'Custom & Legacy Verification Badge',
      'Aged 2010-2013 Accounts Available',
      'Generic Username Claims for Brands',
    ],
  },
  {
    name: 'Facebook',
    acc: '#1877F2',
    shadowColor: 'rgba(24,119,242,0.6)',
    telegramLink: 'https://t.me/despacito',
    icon: (
      <svg viewBox="0 0 52 52" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="svc-fb-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#42a5f5"/>
            <stop offset="50%"  stopColor="#1877F2"/>
            <stop offset="100%" stopColor="#0c54c7"/>
          </linearGradient>
          <radialGradient id="svc-fb-spec" cx="28%" cy="22%" r="55%">
            <stop offset="0%"  stopColor="white" stopOpacity="0.5"/>
            <stop offset="60%" stopColor="white" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="svc-fb-rim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="85%"  stopColor="white" stopOpacity="0"/>
            <stop offset="100%" stopColor="#0c54c7" stopOpacity="0.7"/>
          </linearGradient>
        </defs>
        <ellipse cx="26" cy="50" rx="16" ry="3.5" fill="rgba(24,119,242,0.35)"/>
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#svc-fb-bg)"/>
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#svc-fb-rim)" opacity=".5"/>
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#svc-fb-spec)"/>
        <path d="M34 26h-5.5v15.5h-6.5V26h-3.5v-5.5h3.5v-3.3c0-4.4 2.1-6.7 6.5-6.7H33v5.5h-3.3c-1.1 0-1.2.4-1.2 1.1v3.4H34l-.5 5.5H28.5z" fill="white"/>
      </svg>
    ),
    items: [
      'Instant Account Removals',
      'Legacy Verification',
      'Lookup: Phone, Email, Location, Connected IDs, Device Info',
    ],
  },
  {
    name: 'X (Twitter)',
    acc: '#888aaa',
    shadowColor: 'rgba(140,140,180,0.5)',
    telegramLink: 'https://t.me/despacito',
    icon: (
      <svg viewBox="0 0 52 52" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="svc-x-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#2a2a2a"/>
            <stop offset="100%" stopColor="#0d0d0d"/>
          </linearGradient>
          <radialGradient id="svc-x-spec" cx="28%" cy="22%" r="55%">
            <stop offset="0%"  stopColor="white" stopOpacity="0.3"/>
            <stop offset="60%" stopColor="white" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="svc-x-rim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="85%"  stopColor="white" stopOpacity="0"/>
            <stop offset="100%" stopColor="rgba(120,120,160,.6)" stopOpacity="1"/>
          </linearGradient>
        </defs>
        <ellipse cx="26" cy="50" rx="16" ry="3.5" fill="rgba(100,100,120,0.3)"/>
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#svc-x-bg)"/>
        <rect x="2" y="2" width="48" height="48" rx="13" stroke="rgba(255,255,255,.12)" strokeWidth="1.5" fill="none"/>
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#svc-x-rim)" opacity=".6"/>
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#svc-x-spec)"/>
        <path d="M30.9 13h4.5L25.5 24.5 37 39h-8.5l-6.3-8.3L15.5 39H11l10.5-12-11-14h8.7l5.7 7.5L30.9 13zm-1.5 23h2.5L22.4 18h-2.7l9.7 18z" fill="white"/>
      </svg>
    ),
    items: [
      'X Account Takedowns',
      'Post & Content Removals',
      'Account Recovery via Platform Rep',
    ],
  },
  {
    name: 'TikTok',
    acc: '#00f2ea',
    shadowColor: 'rgba(0,242,234,0.45)',
    telegramLink: 'https://t.me/despacito',
    icon: (
      <svg viewBox="0 0 52 52" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="svc-tt-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#1c1c2e"/>
            <stop offset="100%" stopColor="#050505"/>
          </linearGradient>
          <radialGradient id="svc-tt-spec" cx="28%" cy="22%" r="55%">
            <stop offset="0%"  stopColor="white" stopOpacity="0.22"/>
            <stop offset="60%" stopColor="white" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="svc-tt-rim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="85%"  stopColor="white" stopOpacity="0"/>
            <stop offset="100%" stopColor="rgba(0,242,234,.5)" stopOpacity="1"/>
          </linearGradient>
        </defs>
        <ellipse cx="26" cy="50" rx="16" ry="3.5" fill="rgba(0,242,234,0.25)"/>
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#svc-tt-bg)"/>
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#svc-tt-rim)" opacity=".5"/>
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#svc-tt-spec)"/>
        <path d="M36 20.5c-2.2 0-4.1-.8-5.5-2.2V31c0 4.8-3.8 8.6-8.6 8.6S13.2 35.8 13.2 31s3.8-8.6 8.6-8.6c.4 0 .8 0 1.2.1v4.8c-.4-.1-.8-.1-1.2-.1-2.1 0-3.8 1.7-3.8 3.8s1.7 3.8 3.8 3.8 3.8-1.7 3.8-3.8V13h4.8c.5 3.6 3.4 6.4 7 6.5v1z" fill="white"/>
        <path d="M35.5 19.5c-3.2-.2-5.8-2.4-6.8-5.5H35.5v5.5z" fill="#69C9D0"/>
        <path d="M22 24.2v4.2c-.4-.1-.8-.1-1.2-.1-2.1 0-3.8 1.7-3.8 3.8s1.7 3.8 3.8 3.8 3.8-1.7 3.8-3.8V17.5h4.3c.1.5.2 1 .3 1.5H26v14.3c0 2.1-1.7 3.8-3.8 3.8s-3.8-1.7-3.8-3.8 1.7-3.8 3.8-3.8c.4 0 .8.1 1.1.2v-5.6c-.4-.1-.7-.1-1.1-.1-4.8 0-8.6 3.8-8.6 8.6s3.8 8.6 8.6 8.6 8.6-3.8 8.6-8.6V17c1.4 1.4 3.3 2.2 5.4 2.2v-1" fill="#EE1D52" opacity=".9"/>
      </svg>
    ),
    items: [
      'Account Removals — TAT 24–48H',
      'Rare Username Procurement',
      'Legacy Verification',
      'Lookup: Phone, Email, Location, Connected IDs, Device Info',
    ],
  },
];

/* ─────────────────────────────────────────────
   ServiceCard component
───────────────────────────────────────────── */
import { useEffect } from 'react';

const ServiceCard = ({ p, index, inView }: {
  p: typeof platforms[number];
  index: number;
  inView: boolean;
}) => {
  useEffect(() => { injectSvcStyles(); }, []);

  return (
    <motion.div
      id={`service-${p.name.toLowerCase().replace(/\s*\(.*?\)\s*/g, '-').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}
      className="svc-card flex flex-col h-full"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.11 }}
      style={{ boxShadow: `0 0 0 0 ${p.shadowColor}` }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 40px -8px ${p.shadowColor}, 0 0 0 1px rgba(255,255,255,0.08)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 0 0 transparent';
      }}
    >
      {/* Traveling beams */}
      <div className="beam-top" />
      <div className="beam-right" />
      <div className="beam-bottom" />
      <div className="beam-left" />

      {/* Corner dots */}
      <div className="corner-tl" />
      <div className="corner-tr" />
      <div className="corner-br" />
      <div className="corner-bl" />

      {/* Inner specular layer */}
      <div
        className="absolute inset-0 rounded-[20px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 25% 15%, rgba(255,255,255,0.055), transparent 60%)',
        }}
      />

      {/* Card content */}
      <div className="relative z-10 flex flex-col h-full p-6 md:p-7">

        {/* ── Platform icon with 3D depth & glow ── */}
        <div className="mb-6 flex flex-col items-start gap-3">
          <div className="relative">
            {/* Coloured glow halo behind icon */}
            <div
              className="svc-glow absolute -inset-3 rounded-2xl blur-2xl opacity-0 transition-opacity duration-500 pointer-events-none"
              style={{ background: p.shadowColor }}
            />
            <div
              className="svc-icon relative"
              style={{
                filter: `drop-shadow(0 12px 20px ${p.shadowColor}) drop-shadow(0 2px 6px rgba(0,0,0,0.8))`,
                transform: 'perspective(360px) rotateX(8deg)',
              }}
            >
              {p.icon}
            </div>
          </div>

          {/* Platform name */}
          <div>
            <h3
              className="text-xl font-black tracking-tight text-white leading-none"
              style={{ fontVariationSettings: '"wght" 900' }}
            >
              {p.name}
            </h3>
            <div
              className="mt-1 h-[2px] w-10 rounded-full"
              style={{ background: `linear-gradient(90deg, ${p.acc}, transparent)` }}
            />
          </div>
        </div>

        {/* Services list */}
        <ul className="flex-1 space-y-2.5 mb-6">
          {p.items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 group/item">
              <span
                className="mt-[3px] flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: `${p.acc}22`, border: `1px solid ${p.acc}55` }}
              >
                <Check size={10} style={{ color: p.acc }} />
              </span>
              <span className="text-[13px] text-white/55 leading-snug group-hover/item:text-white/80 transition-colors duration-200">
                {item}
              </span>
            </li>
          ))}
        </ul>

        {/* ── Telegram CTA ── */}
        <a
          href={p.telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="svc-cta mt-auto"
          style={{
            background: `linear-gradient(135deg, ${p.acc}22, ${p.acc}0a)`,
            borderColor: `${p.acc}44`,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = `linear-gradient(135deg, ${p.acc}44, ${p.acc}22)`;
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 4px 20px ${p.shadowColor}`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = `linear-gradient(135deg, ${p.acc}22, ${p.acc}0a)`;
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
          }}
        >
          <Send size={13} style={{ color: p.acc }} />
          <span style={{ color: p.acc }}>Contact on Telegram</span>
        </a>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Services section
───────────────────────────────────────────── */
const Services = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="services" className="relative py-24 md:py-32 px-6" ref={ref}>
      {/* Background ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-600/[0.04] rounded-full blur-[200px]" />
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-purple-600/[0.04] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-600/[0.04] rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-4">
            What We Offer
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mt-2 mb-5 leading-tight">
            Our{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #60a5fa, #22d3ee, #818cf8)' }}
            >
              Services
            </span>
          </h2>
          <p className="text-white/45 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Comprehensive social media services across every major platform.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {platforms.map((p, i) => (
            <ServiceCard key={p.name} p={p} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
