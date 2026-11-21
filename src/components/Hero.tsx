import { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Send, Shield, X, CheckCircle2, Zap, Lock, Clock } from 'lucide-react';
import Aurora from './reactbits/Aurora';
import BlurText from './reactbits/BlurText';
import ShinyText from './reactbits/ShinyText';
import BendingMarquee from './BendingMarquee';
import { ShinyButton } from './ui/shiny-button';

const Scene3D = lazy(() => import('./Scene3D'));

/* ─────────────────────────────────────────────
   Popup overlay CSS
───────────────────────────────────────────── */
const POPUP_CSS = `
@keyframes popup-shine { 0%,100%{opacity:.4} 50%{opacity:.85} }

.popup-overlay {
  position: fixed; inset: 0; z-index: 9999;
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
}

.popup-backdrop {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.popup-card {
  position: relative; z-index: 1;
  width: 100%; max-width: 440px;
  border-radius: 24px;
  background: linear-gradient(145deg, #07101f 0%, #0a1628 60%, #07101f 100%);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
  overflow: hidden;
}

.popup-header-glow {
  position: absolute;
  top: -40px; left: 50%; transform: translateX(-50%);
  width: 240px; height: 140px;
  border-radius: 50%;
  filter: blur(50px);
  opacity: 0.55;
  pointer-events: none;
  animation: popup-shine 3s ease-in-out infinite;
}

.popup-service-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 12px; border-radius: 999px;
  font-size: 11px; font-weight: 600; letter-spacing: 0.04em;
  border: 1px solid;
}

.popup-feature-row {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.popup-feature-row:last-child { border-bottom: none; }
`;

let popupInjected = false;
function injectPopupStyles() {
  if (popupInjected || typeof document === 'undefined') return;
  popupInjected = true;
  const s = document.createElement('style');
  s.textContent = POPUP_CSS;
  document.head.appendChild(s);
}

/* ─────────────────────────────────────────────
   Platform card CSS — injected once into <head>
   Same conic-gradient trick as ShinyButton.
───────────────────────────────────────────── */
const PLAT_CSS = `
@property --gradient-angle          { syntax:"<angle>";      initial-value:0deg;  inherits:false }
@property --gradient-angle-offset   { syntax:"<angle>";      initial-value:0deg;  inherits:false }
@property --gradient-percent        { syntax:"<percentage>"; initial-value:5%;    inherits:false }
@property --gradient-shine          { syntax:"<color>";      initial-value:white; inherits:false }

@keyframes gradient-angle  { to { --gradient-angle: 360deg } }
@keyframes plat-float      { 0%,100%{translate:0 0} 50%{translate:0 -6px} }
@keyframes plat-pulse-glow { 0%,100%{opacity:.45} 50%{opacity:.85} }

.plat-card {
  isolation: isolate;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
  background:
    linear-gradient(#060d1a, #08102a) padding-box,
    conic-gradient(
      from calc(var(--gradient-angle) - var(--gradient-angle-offset)),
      transparent,
      var(--plat-acc, #3d6bff) var(--gradient-percent),
      var(--gradient-shine)   calc(var(--gradient-percent) * 2),
      var(--plat-acc, #3d6bff) calc(var(--gradient-percent) * 3),
      transparent             calc(var(--gradient-percent) * 4)
    ) border-box;
  animation:
    gradient-angle 4s linear infinite,
    gradient-angle calc(4s / 0.4) reverse paused;
  animation-composition: add;
  transition: 800ms cubic-bezier(.25,1,.5,1);
  transition-property: --gradient-angle-offset, --gradient-percent, --gradient-shine, transform, box-shadow;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
}

/* Inner specular shimmer layer */
.plat-card::before {
  content: '';
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(ellipse at 28% 18%, rgba(255,255,255,.09), transparent 60%);
  z-index: 1;
}

/* Animated dot-pattern mask (same as button ::before) */
.plat-card::after {
  content: '';
  pointer-events: none;
  position: absolute;
  inset-inline-start: 50%;
  inset-block-start: 50%;
  translate: -50% -50%;
  --size: calc(100% - 4px);
  --pos:  2px;
  --space: calc(var(--pos) * 2);
  width: var(--size);
  height: var(--size);
  background: radial-gradient(circle at var(--pos) var(--pos), white calc(var(--pos)/4), transparent 0) padding-box;
  background-size: var(--space) var(--space);
  background-repeat: space;
  mask-image: conic-gradient(from calc(var(--gradient-angle) + 45deg), black, transparent 10% 90%, black);
  border-radius: inherit;
  opacity: 0;
  z-index: 1;
  transition: opacity 600ms;
  animation:
    gradient-angle 4s linear infinite,
    gradient-angle calc(4s / 0.4) reverse paused;
  animation-composition: add;
}

.plat-card:hover, .plat-card:focus-visible {
  --gradient-percent: 22%;
  --gradient-angle-offset: 95deg;
  --gradient-shine: rgba(132,132,255,1);
  animation-play-state: running, running;
  transform: translateY(-4px);
}

.plat-card:hover::after,
.plat-card:focus-visible::after {
  opacity: .28;
  animation-play-state: running, running;
}

.plat-card:hover .plat-icon {
  animation: plat-float 2.6s ease-in-out infinite;
}

.plat-card:hover .plat-glow {
  animation: plat-pulse-glow 2.6s ease-in-out infinite;
  opacity: .8;
}

.plat-card:active { transform: translateY(0) scale(.96); }

.plat-icon {
  position: relative;
  z-index: 2;
  transition: filter .4s;
}

.plat-glow {
  transition: opacity .5s;
  opacity: 0;
  pointer-events: none;
}
`;

let platInjected = false;
function injectPlatStyles() {
  if (platInjected || typeof document === 'undefined') return;
  platInjected = true;
  const s = document.createElement('style');
  s.textContent = PLAT_CSS;
  document.head.appendChild(s);
}

/* ─────────────────────────────────────────────
   Platform data — 3-D mascot-style SVG icons
   Each icon has:
     • layered gradients for surface depth
     • specular highlight (top-left white oval)
     • bottom rim light for 3-D lift
     • acc color used by the shiny border
───────────────────────────────────────────── */
const platforms = [
  {
    name: 'Instagram',
    id: 'instagram',
    href: '#service-instagram',
    acc: '#d6249f',
    shadowColor: 'rgba(214,36,159,0.65)',
    popup: {
      tagline: 'Instagram Services',
      description: 'Professional Instagram solutions — from account recovery and removal to blue-tick verification and username claims.',
      services: [
        { label: 'Account Recovery', desc: 'Regain access to hacked or disabled accounts' },
        { label: 'Account Removal', desc: 'Permanent takedown of impersonation or fake accounts' },
        { label: 'Blue Tick Verification', desc: 'Get the official verified badge on your profile' },
        { label: 'Username Claim', desc: "Secure your brand's exact username handle" },
      ],
      badges: ['Fast Turnaround', 'Confidential', '100% Legit'],
    },
    icon: (
      <svg viewBox="0 0 52 52" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="ig3-bg" cx="30%" cy="107%" r="150%">
            <stop offset="0%" stopColor="#fdf497" />
            <stop offset="12%" stopColor="#fce566" />
            <stop offset="50%" stopColor="#fd5949" />
            <stop offset="68%" stopColor="#d6249f" />
            <stop offset="100%" stopColor="#285AEB" />
          </radialGradient>
          {/* specular highlight — top-left white oval */}
          <radialGradient id="ig3-spec" cx="28%" cy="22%" r="55%">
            <stop offset="0%" stopColor="white" stopOpacity="0.55" />
            <stop offset="60%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          {/* bottom rim light */}
          <linearGradient id="ig3-rim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="85%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="rgba(253,84,73,0.6)" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* drop shadow ellipse */}
        <ellipse cx="26" cy="50" rx="16" ry="3.5" fill="rgba(214,36,159,0.35)" />
        {/* main face */}
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#ig3-bg)" />
        {/* rim light */}
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#ig3-rim)" opacity=".5" />
        {/* specular */}
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#ig3-spec)" />
        {/* icon: camera ring */}
        <circle cx="26" cy="26" r="10.5" stroke="white" strokeWidth="3" fill="none" />
        <circle cx="37" cy="15" r="2.8" fill="white" />
        <rect x="5" y="5" width="42" height="42" rx="10" stroke="white" strokeWidth="1.8" fill="none" opacity="0.22" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    id: 'facebook',
    href: '#service-facebook',
    acc: '#1877F2',
    shadowColor: 'rgba(24,119,242,0.65)',
    popup: {
      tagline: 'Facebook Services',
      description: 'Complete Facebook management — recover locked accounts, remove harmful content, and get your page officially verified.',
      services: [
        { label: 'Account Recovery', desc: 'Restore access to hacked or locked Facebook accounts' },
        { label: 'Page / Profile Removal', desc: 'Take down fake pages impersonating you or your brand' },
        { label: 'Blue Tick Verification', desc: 'Get the verified badge for pages and profiles' },
        { label: 'Username / URL Claim', desc: 'Secure a custom vanity URL for your page' },
      ],
      badges: ['Quick Delivery', 'Secure Process', 'No Password Needed'],
    },
    icon: (
      <svg viewBox="0 0 52 52" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fb3-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#42a5f5" />
            <stop offset="50%" stopColor="#1877F2" />
            <stop offset="100%" stopColor="#0c54c7" />
          </linearGradient>
          <radialGradient id="fb3-spec" cx="28%" cy="22%" r="55%">
            <stop offset="0%" stopColor="white" stopOpacity="0.5" />
            <stop offset="60%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="fb3-rim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="85%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="#0c54c7" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <ellipse cx="26" cy="50" rx="16" ry="3.5" fill="rgba(24,119,242,0.35)" />
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#fb3-bg)" />
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#fb3-rim)" opacity=".5" />
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#fb3-spec)" />
        <path d="M34 26h-5.5v15.5h-6.5V26h-3.5v-5.5h3.5v-3.3c0-4.4 2.1-6.7 6.5-6.7H33v5.5h-3.3c-1.1 0-1.2.4-1.2 1.1v3.4H34l-.5 5.5H28.5z" fill="white" />
      </svg>
    ),
  },
  {
    name: 'X (Twitter)',
    id: 'x-twitter',
    href: '#service-x',
    acc: '#888aaa',
    shadowColor: 'rgba(140,140,180,0.5)',
    popup: {
      tagline: 'X / Twitter Services',
      description: 'Expert X (Twitter) solutions — from account reinstatement and removal to official verification and rare handle acquisition.',
      services: [
        { label: 'Account Reinstatement', desc: 'Appeal and restore suspended or banned accounts' },
        { label: 'Account / Tweet Removal', desc: 'Remove targeted accounts, tweets, or harmful content' },
        { label: 'Blue / Gold Verification', desc: 'Obtain the verified checkmark for individuals or orgs' },
        { label: 'OG Handle Claim', desc: 'Acquire rare, inactive, or squatted username handles' },
      ],
      badges: ['High Success Rate', 'Discreet', 'Appeals Experts'],
    },
    icon: (
      <svg viewBox="0 0 52 52" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="x3-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#0d0d0d" />
          </linearGradient>
          <radialGradient id="x3-spec" cx="28%" cy="22%" r="55%">
            <stop offset="0%" stopColor="white" stopOpacity="0.3" />
            <stop offset="60%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="x3-rim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="85%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="rgba(120,120,160,.6)" stopOpacity="1" />
          </linearGradient>
        </defs>
        <ellipse cx="26" cy="50" rx="16" ry="3.5" fill="rgba(100,100,120,0.3)" />
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#x3-bg)" />
        <rect x="2" y="2" width="48" height="48" rx="13" stroke="rgba(255,255,255,.12)" strokeWidth="1.5" fill="none" />
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#x3-rim)" opacity=".6" />
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#x3-spec)" />
        <path d="M30.9 13h4.5L25.5 24.5 37 39h-8.5l-6.3-8.3L15.5 39H11l10.5-12-11-14h8.7l5.7 7.5L30.9 13zm-1.5 23h2.5L22.4 18h-2.7l9.7 18z" fill="white" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    id: 'tiktok',
    href: '#service-tiktok',
    acc: '#00f2ea',
    shadowColor: 'rgba(0,242,234,0.45)',
    popup: {
      tagline: 'TikTok Services',
      description: 'Full-spectrum TikTok support — reinstate banned accounts, remove content, claim usernames, and get verified fast.',
      services: [
        { label: 'Account Reinstatement', desc: 'Restore permanently banned or shadow-banned accounts' },
        { label: 'Content / Account Removal', desc: 'Remove infringing, impersonating, or harmful accounts' },
        { label: 'Verification Badge', desc: 'Get the official TikTok verified checkmark' },
        { label: 'Username Acquisition', desc: 'Claim inactive or coveted TikTok handles' },
      ],
      badges: ['24–48 hr Delivery', 'Confidential', 'Platform Experts'],
    },
    icon: (
      <svg viewBox="0 0 52 52" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="tt3-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1c1c2e" />
            <stop offset="100%" stopColor="#050505" />
          </linearGradient>
          <radialGradient id="tt3-spec" cx="28%" cy="22%" r="55%">
            <stop offset="0%" stopColor="white" stopOpacity="0.22" />
            <stop offset="60%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="tt3-rim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="85%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="rgba(0,242,234,.5)" stopOpacity="1" />
          </linearGradient>
        </defs>
        <ellipse cx="26" cy="50" rx="16" ry="3.5" fill="rgba(0,242,234,0.25)" />
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#tt3-bg)" />
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#tt3-rim)" opacity=".5" />
        <rect x="2" y="2" width="48" height="48" rx="13" fill="url(#tt3-spec)" />
        {/* TikTok note — white base */}
        <path d="M36 20.5c-2.2 0-4.1-.8-5.5-2.2V31c0 4.8-3.8 8.6-8.6 8.6S13.2 35.8 13.2 31s3.8-8.6 8.6-8.6c.4 0 .8 0 1.2.1v4.8c-.4-.1-.8-.1-1.2-.1-2.1 0-3.8 1.7-3.8 3.8s1.7 3.8 3.8 3.8 3.8-1.7 3.8-3.8V13h4.8c.5 3.6 3.4 6.4 7 6.5v1z" fill="white" />
        {/* cyan accent */}
        <path d="M35.5 19.5c-3.2-.2-5.8-2.4-6.8-5.5H35.5v5.5z" fill="#69C9D0" />
        {/* red accent */}
        <path d="M22 24.2v4.2c-.4-.1-.8-.1-1.2-.1-2.1 0-3.8 1.7-3.8 3.8s1.7 3.8 3.8 3.8 3.8-1.7 3.8-3.8V17.5h4.3c.1.5.2 1 .3 1.5H26v14.3c0 2.1-1.7 3.8-3.8 3.8s-3.8-1.7-3.8-3.8 1.7-3.8 3.8-3.8c.4 0 .8.1 1.1.2v-5.6c-.4-.1-.7-.1-1.1-.1-4.8 0-8.6 3.8-8.6 8.6s3.8 8.6 8.6 8.6 8.6-3.8 8.6-8.6V17c1.4 1.4 3.3 2.2 5.4 2.2v-1" fill="#EE1D52" opacity=".9" />
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────
   PlatPopup — full-detail modal card
───────────────────────────────────────────── */
type Platform = typeof platforms[number];

const PlatPopup = ({ p, onClose }: { p: Platform; onClose: () => void }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const iconMap: Record<string, React.ReactNode> = {
    'Fast Turnaround': <Zap size={11} />,
    'Quick Delivery': <Zap size={11} />,
    '24–48 hr Delivery': <Clock size={11} />,
    'Confidential': <Lock size={11} />,
    'Discreet': <Lock size={11} />,
    'Secure Process': <Lock size={11} />,
    '100% Legit': <Shield size={11} />,
    'No Password Needed': <Shield size={11} />,
    'High Success Rate': <CheckCircle2 size={11} />,
    'Appeals Experts': <CheckCircle2 size={11} />,
    'Platform Experts': <CheckCircle2 size={11} />,
  };

  return (
    <div
      className="popup-overlay"
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Blurred backdrop */}
      <div className="popup-backdrop" onClick={onClose} />

      <motion.div
        className="popup-card"
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 24 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Colour glow at top */}
        <div className="popup-header-glow" style={{ background: p.acc }} />

        {/* Border accent line */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '60%', height: '2px',
          background: `linear-gradient(90deg, transparent, ${p.acc}, transparent)`,
          borderRadius: '0 0 4px 4px',
        }} />

        <div className="p-6 relative z-10">
          {/* Header row */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              {/* Platform icon (smaller) */}
              <div style={{
                filter: `drop-shadow(0 6px 14px ${p.shadowColor})`,
                transform: 'perspective(300px) rotateX(6deg)',
                flexShrink: 0,
              }}>
                <div className="w-11 h-11">{p.icon}</div>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">{p.popup.tagline}</h3>
                <p className="text-white/40 text-xs mt-0.5">Premium services · Fast delivery</p>
              </div>
            </div>
            {/* Close button */}
            <button
              onClick={onClose}
              className="flex-shrink-0 w-7 h-7 rounded-full bg-white/5 hover:bg-white/12 border border-white/10 flex items-center justify-center transition-colors"
            >
              <X size={14} className="text-white/60" />
            </button>
          </div>

          {/* Description */}
          <p className="text-white/55 text-sm leading-relaxed mb-5">{p.popup.description}</p>

          {/* Services list */}
          <div className="mb-5 rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-1">
            {p.popup.services.map((s) => (
              <div key={s.label} className="popup-feature-row">
                <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" style={{ color: p.acc }} />
                <div>
                  <p className="text-white text-sm font-semibold leading-snug">{s.label}</p>
                  <p className="text-white/40 text-xs mt-0.5 leading-snug">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {p.popup.badges.map((b) => (
              <span
                key={b}
                className="popup-service-pill"
                style={{ color: p.acc, borderColor: `${p.acc}44`, background: `${p.acc}12` }}
              >
                {iconMap[b] ?? <Zap size={11} />}
                {b}
              </span>
            ))}
          </div>

          {/* CTA */}
          <a
            href="https://t.me/despacito"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200"
            style={{
              background: `linear-gradient(135deg, ${p.acc}cc, ${p.acc}88)`,
              boxShadow: `0 4px 20px ${p.shadowColor}`,
            }}
          >
            <Send size={14} />
            Get Started on Telegram
            <ArrowRight size={14} />
          </a>
        </div>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   PlatCard — shiny border + 3D mascot icon
───────────────────────────────────────────── */
const PlatCard = ({
  p, index, onOpen,
}: { p: Platform; index: number; onOpen: (p: Platform) => void }) => {
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => { injectPlatStyles(); injectPopupStyles(); }, []);

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    const y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    setTiltX(-y * 10);
    setTiltY(x * 10);
  };

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(p)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.2 + index * 0.12 }}
      className="plat-card group flex flex-col items-center gap-3 px-4 py-5 rounded-2xl w-full focus:outline-none"
      style={{
        '--plat-acc': p.acc,
        transform: `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transition: hovered
          ? 'transform 0.12s ease'
          : 'transform 0.5s cubic-bezier(.2,.8,.2,1), 800ms cubic-bezier(.25,1,.5,1)',
      } as React.CSSProperties}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTiltX(0); setTiltY(0); setHovered(false); }}
    >
      {/* Coloured glow behind icon */}
      <div
        className="plat-glow absolute top-5 left-1/2 -translate-x-1/2 w-14 h-10 rounded-full blur-xl"
        style={{ background: p.shadowColor }}
      />

      {/* 3D mascot icon — perspective tilt + drop-shadow */}
      <div
        className="plat-icon"
        style={{
          filter: `drop-shadow(0 10px 18px ${p.shadowColor}) drop-shadow(0 2px 4px rgba(0,0,0,0.7))`,
          transform: 'perspective(380px) rotateX(8deg)',
        }}
      >
        {p.icon}
      </div>

      <span className="relative z-10 text-xs font-semibold text-white/80 group-hover:text-white transition-colors text-center leading-tight">
        {p.name}
      </span>
      <span className="relative z-10 text-[10px] text-white/35 group-hover:text-white/65 transition-colors">
        View details →
      </span>
    </motion.button>
  );
};

/* ── Hero section ── */
const Hero = () => {
  const [activePopup, setActivePopup] = useState<typeof platforms[number] | null>(null);

  return (
    <section className="relative min-h-screen overflow-hidden">

      {/* ── AURORA BACKGROUND ── */}
      <div className="absolute inset-0 w-full h-full">
        <Aurora
          colorStops={['#0f172a', '#1e3a8a', '#1d4ed8', '#0369a1', '#0f172a']}
          amplitude={1.2} speed={0.4} blend={0.6} layers={3}
          mouseInteraction brightness={1.2}
          className="w-full h-full"
        />
      </div>

      {/* ── 3D SCENE ── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Suspense fallback={null}><Scene3D /></Suspense>
      </div>

      {/* ── Grid overlay ── */}
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />

      {/* ── Bottom fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#030712] to-transparent pointer-events-none" />

      {/* ── ALL CONTENT in a single flow column ── */}
      <div className="relative z-10 flex flex-col items-center w-full pt-28 pb-16">

        {/* Trust badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-sm font-medium backdrop-blur-md">
            <Shield size={14} className="text-blue-400" />
            Trusted by 500+ Clients Worldwide
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </span>
        </motion.div>

        {/* Headline — BlurText */}
        <div className="mb-3 px-6 text-center">
          <BlurText
            text="Premium Social Media"
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight"
            delay={80} animateBy="words" direction="top" trigger="load"
          />
        </div>

        {/* Shiny gradient — ShinyText */}
        <div className="mb-8 px-6 text-center">
          <ShinyText
            text="Services"
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight"
            speed={2.5}
            color="linear-gradient(90deg, #60a5fa, #22d3ee, #818cf8, #60a5fa)"
            glow={0.5}
          />
        </div>

        {/* Subtitle */}
        <motion.p
          className="text-base sm:text-lg md:text-xl text-blue-100/60 max-w-2xl mx-auto mb-12 leading-relaxed px-6 text-center"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Account removals, recoveries, verification badges, lookups &amp;
          username claims across all major platforms.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 px-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <ShinyButton as="a" href="https://t.me/despacito" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Send size={18} />
            Contact on Telegram
            <ArrowRight size={18} />
          </ShinyButton>
          <ShinyButton as="a" href="#services" className="w-full sm:w-auto">
            Explore Services
          </ShinyButton>
        </motion.div>

        {/* ── BENDING MARQUEE ── */}
        <div className="w-full" style={{ marginTop: 8, marginBottom: 8 }}>
          <BendingMarquee />
        </div>

        {/* ── Platform cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-col items-center gap-4 px-6 w-full max-w-[520px] sm:max-w-none"
        >
          <p className="text-xs text-white/30 uppercase tracking-widest font-medium">Platforms we cover</p>

          {/* 2×2 on mobile, 4-col on sm+ */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 w-full sm:w-auto">
            {platforms.map((p, i) => (
              <PlatCard key={p.id} p={p} index={i} onOpen={setActivePopup} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-[10px] text-white/25 tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-9 rounded-full border border-white/20 flex justify-center pt-1.5">
          <div className="w-1 h-2.5 rounded-full bg-blue-400" />
        </div>
      </motion.div>

      {/* ── Platform popup modal ── */}
      <AnimatePresence>
        {activePopup && (
          <PlatPopup p={activePopup} onClose={() => setActivePopup(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
