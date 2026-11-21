/* Ribbon items — ALL CAPS with star separators like reference site */
const TEXT_CONTENT =
  '★  INSTAGRAM  ★  FACEBOOK  ★  TELEGRAM  ★  X (TWITTER)  ★  INSTAGRAM  ★  FACEBOOK  ★  TELEGRAM  ★  X (TWITTER)  ★  INSTAGRAM  ★  FACEBOOK  ★  TELEGRAM  ★  X (TWITTER)  ';

const BendingMarquee = () => (
  <div
    style={{
      /* Enough height to contain the rotated strip without bleeding */
      position: 'relative',
      width: '100%',
      height: 64,
      overflow: 'hidden',
      /* Prevent bleed into sections above/below */
      marginTop: 4,
      marginBottom: 4,
    }}
  >
    {/* Rotated ribbon strip */}
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        width: '100%',
        transform: 'translateY(-50%)',
        background:
          'linear-gradient(135deg,rgba(23,55,163,0.60) 0%,rgba(8,98,120,0.60) 100%)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderTop:    '1.5px solid rgba(147,197,253,0.40)',
        borderBottom: '1.5px solid rgba(147,197,253,0.40)',
        boxShadow:
          '0 4px 32px rgba(96,165,250,0.12), 0 -4px 32px rgba(96,165,250,0.08)',
        padding: '11px 0',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
    >
      {/* Two copies for seamless loop */}
      <div
        style={{
          display: 'inline-block',
          animation: 'sn-marquee-scroll 50s linear infinite',
          willChange: 'transform',
        }}
      >
        <span style={textStyle}>{TEXT_CONTENT}</span>
        {/* Second identical copy immediately after → seamless */}
        <span style={textStyle}>{TEXT_CONTENT}</span>
      </div>
    </div>

    <style>{`
      @keyframes sn-marquee-scroll {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }
    `}</style>
  </div>
);

const textStyle: React.CSSProperties = {
  display: 'inline-block',
  color: 'rgba(224,242,254,0.95)',
  fontSize: 13,
  fontWeight: 800,
  fontFamily: "system-ui,-apple-system,'Segoe UI',sans-serif",
  letterSpacing: '2.5px',
  textTransform: 'uppercase',
  textShadow: '0 0 18px rgba(96,165,250,0.70)',
};

export default BendingMarquee;
