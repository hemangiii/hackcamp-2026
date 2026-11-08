// Hand-drawn style stick figures for the welcome page. Each pose is plain SVG
// lines in the ink colour; the animated limb has its own class so CSS can move it.

export type Pose = 'wave' | 'point' | 'walk' | 'highfive';

const Head = ({ x }: { x: number }) => <circle cx={x} cy="14" r="9" />;

function Figure({ pose }: { pose: Exclude<Pose, 'highfive'> }) {
  return (
    <>
      <Head x={30} />
      <path d="M30 23 L30 60" />
      {pose === 'walk' ? (
        <>
          <path d="M30 60 L20 90" />
          <path d="M30 60 L42 88" />
          <path className="limb-swing" d="M30 34 L18 50" />
          <path d="M30 34 L42 48" />
        </>
      ) : (
        <>
          <path d="M30 60 L20 92" />
          <path d="M30 60 L40 92" />
          <path d="M30 34 L18 52" />
        </>
      )}
      {pose === 'wave' && <path className="limb-wave" d="M30 34 L44 24 L48 8" />}
      {pose === 'point' && <path d="M30 34 L56 30" />}
    </>
  );
}

function HighFive() {
  return (
    <>
      <Head x={24} />
      <path d="M24 23 L24 60 M24 60 L14 92 M24 60 L34 92 M24 34 L12 52" />
      <path d="M24 34 L40 18 L48 6" />
      <Head x={96} />
      <path d="M96 23 L96 60 M96 60 L86 92 M96 60 L106 92 M96 34 L108 52" />
      <path d="M96 34 L80 18 L72 6" />
      {/* little burst where the hands meet */}
      <path className="burst" d="M60 0 L60 -6 M52 2 L48 -2 M68 2 L72 -2" />
    </>
  );
}

export function Stickman({ pose, className }: { pose: Pose; className?: string }) {
  const wide = pose === 'highfive';
  return (
    <svg
      className={`stickman ${className ?? ''}`}
      viewBox={wide ? '0 -10 120 106' : '0 0 60 96'}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {wide ? <HighFive /> : <Figure pose={pose} />}
    </svg>
  );
}
