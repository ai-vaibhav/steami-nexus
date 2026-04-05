import { memo } from 'react';

// Unique SVG micro-animations per field, using CSS keyframes for 60fps performance
// Uses currentColor and CSS variables for theming consistency

interface CardSvgVisualProps {
  field: string;
  /** 'mini' for grid cards, 'featured' for carousel hero, 'modal' for modal header */
  variant?: 'mini' | 'featured' | 'modal';
  className?: string;
}

const styles = `
@keyframes svg-pulse { 0%,100%{opacity:.35} 50%{opacity:.8} }
@keyframes svg-rotate { to{transform:rotate(360deg)} }
@keyframes svg-dash { to{stroke-dashoffset:0} }
@keyframes svg-orbit { to{transform:rotate(360deg)} }
@keyframes svg-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
@keyframes svg-wave { 0%{d:path("M0 20 Q15 10 30 20 T60 20")} 50%{d:path("M0 20 Q15 28 30 20 T60 20")} 100%{d:path("M0 20 Q15 10 30 20 T60 20")} }
`;

// Quantum Physics — pulsing nodes with orbital rings
function QuantumSvg({ size }: { size: number }) {
  const cx = size / 2, cy = size / 2, r = size * 0.32;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {/* Orbital rings */}
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.4}
        stroke="hsl(var(--steami-cyan))" strokeWidth="0.8" opacity="0.3"
        style={{ animation: 'svg-rotate 12s linear infinite', transformOrigin: `${cx}px ${cy}px` }} />
      <ellipse cx={cx} cy={cy} rx={r * 0.4} ry={r}
        stroke="hsl(var(--steami-cyan))" strokeWidth="0.8" opacity="0.25"
        style={{ animation: 'svg-rotate 18s linear infinite reverse', transformOrigin: `${cx}px ${cy}px` }} />
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.7}
        stroke="hsl(var(--steami-cyan))" strokeWidth="0.5" opacity="0.15"
        transform={`rotate(45 ${cx} ${cy})`}
        style={{ animation: 'svg-rotate 22s linear infinite', transformOrigin: `${cx}px ${cy}px` }} />
      {/* Center node */}
      <circle cx={cx} cy={cy} r={3} fill="hsl(var(--steami-cyan))"
        style={{ animation: 'svg-pulse 3s ease-in-out infinite' }} />
      {/* Orbiting electrons */}
      <g style={{ animation: 'svg-orbit 6s linear infinite', transformOrigin: `${cx}px ${cy}px` }}>
        <circle cx={cx + r} cy={cy} r={1.8} fill="hsl(var(--steami-cyan))" opacity="0.8" />
      </g>
      <g style={{ animation: 'svg-orbit 9s linear infinite reverse', transformOrigin: `${cx}px ${cy}px` }}>
        <circle cx={cx} cy={cy - r * 0.7} r={1.5} fill="hsl(var(--steami-cyan))" opacity="0.6" />
      </g>
    </svg>
  );
}

// Biology — DNA helix with floating nodes
function BiologySvg({ size }: { size: number }) {
  const h = size, w = size;
  const points = 8;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      {Array.from({ length: points }).map((_, i) => {
        const y = (h / (points + 1)) * (i + 1);
        const offset = Math.sin((i / points) * Math.PI * 2) * w * 0.22;
        const x1 = w / 2 + offset;
        const x2 = w / 2 - offset;
        return (
          <g key={i}>
            <line x1={x1} y1={y} x2={x2} y2={y}
              stroke="hsl(var(--steami-green))" strokeWidth="0.6" opacity="0.2" />
            <circle cx={x1} cy={y} r={1.8} fill="hsl(var(--steami-green))"
              style={{ animation: `svg-pulse ${2 + i * 0.3}s ease-in-out infinite` }} />
            <circle cx={x2} cy={y} r={1.8} fill="hsl(var(--steami-green))" opacity="0.5"
              style={{ animation: `svg-pulse ${2.5 + i * 0.3}s ease-in-out infinite` }} />
          </g>
        );
      })}
    </svg>
  );
}

// AI — neural network graph
function AiSvg({ size }: { size: number }) {
  const cx = size / 2, cy = size / 2;
  const layers = [
    [{ x: cx - size * 0.3, y: cy - size * 0.2 }, { x: cx - size * 0.3, y: cy + size * 0.2 }],
    [{ x: cx, y: cy - size * 0.25 }, { x: cx, y: cy }, { x: cx, y: cy + size * 0.25 }],
    [{ x: cx + size * 0.3, y: cy - size * 0.15 }, { x: cx + size * 0.3, y: cy + size * 0.15 }],
  ];
  const connections: [number, number, number, number][] = [];
  for (let l = 0; l < layers.length - 1; l++) {
    for (const a of layers[l]) {
      for (const b of layers[l + 1]) {
        connections.push([a.x, a.y, b.x, b.y]);
      }
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {connections.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="hsl(var(--steami-violet))" strokeWidth="0.6" opacity="0.2"
          strokeDasharray="4 3"
          style={{ animation: `svg-dash 3s linear infinite`, strokeDashoffset: 7 }} />
      ))}
      {layers.flat().map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={2.5} fill="hsl(var(--steami-violet))"
          style={{ animation: `svg-pulse ${2.5 + i * 0.4}s ease-in-out infinite` }} />
      ))}
    </svg>
  );
}

// Earth & Space — radar / signal rings
function SpaceSvg({ size }: { size: number }) {
  const cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {[0.15, 0.25, 0.36].map((r, i) => (
        <circle key={i} cx={cx} cy={cy} r={size * r}
          stroke="hsl(var(--steami-orange))" strokeWidth="0.7" opacity={0.15 + i * 0.05}
          style={{ animation: `svg-pulse ${3 + i}s ease-in-out infinite` }} />
      ))}
      {/* Signal sweep */}
      <line x1={cx} y1={cy} x2={cx + size * 0.35} y2={cy - size * 0.1}
        stroke="hsl(var(--steami-orange))" strokeWidth="1" opacity="0.4"
        style={{ animation: 'svg-rotate 8s linear infinite', transformOrigin: `${cx}px ${cy}px` }} />
      <circle cx={cx} cy={cy} r={2} fill="hsl(var(--steami-orange))" opacity="0.8" />
      {/* Stars */}
      {[{ x: cx - size * 0.3, y: cy - size * 0.28 }, { x: cx + size * 0.22, y: cy + size * 0.3 }, { x: cx + size * 0.35, y: cy - size * 0.32 }].map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={1} fill="hsl(var(--steami-orange))"
          style={{ animation: `svg-pulse ${2 + i * 0.8}s ease-in-out infinite` }} />
      ))}
    </svg>
  );
}

// Climate & Energy — fusion / sun rings
function EnergySvg({ size }: { size: number }) {
  const cx = size / 2, cy = size / 2;
  const rays = 8;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <circle cx={cx} cy={cy} r={size * 0.12} fill="hsl(var(--steami-gold))" opacity="0.3"
        style={{ animation: 'svg-pulse 2.5s ease-in-out infinite' }} />
      <circle cx={cx} cy={cy} r={size * 0.07} fill="hsl(var(--steami-gold))" opacity="0.7" />
      {Array.from({ length: rays }).map((_, i) => {
        const angle = (i / rays) * Math.PI * 2;
        const x1 = cx + Math.cos(angle) * size * 0.16;
        const y1 = cy + Math.sin(angle) * size * 0.16;
        const x2 = cx + Math.cos(angle) * size * 0.3;
        const y2 = cy + Math.sin(angle) * size * 0.3;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="hsl(var(--steami-gold))" strokeWidth="1" opacity="0.25"
            strokeLinecap="round"
            style={{ animation: `svg-pulse ${2 + i * 0.2}s ease-in-out infinite` }} />
        );
      })}
      <circle cx={cx} cy={cy} r={size * 0.35}
        stroke="hsl(var(--steami-gold))" strokeWidth="0.5" opacity="0.15"
        strokeDasharray="3 5" style={{ animation: 'svg-rotate 20s linear infinite', transformOrigin: `${cx}px ${cy}px` }} />
    </svg>
  );
}

// Computer Science — data flow / circuit
function CompSciSvg({ size }: { size: number }) {
  const cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {/* Circuit lines */}
      <path d={`M${size * 0.15} ${cy} H${cx - 6} V${cy - size * 0.25} H${size * 0.75}`}
        stroke="hsl(var(--steami-red))" strokeWidth="0.8" opacity="0.25"
        strokeDasharray="4 3" style={{ animation: 'svg-dash 4s linear infinite', strokeDashoffset: 7 }} />
      <path d={`M${size * 0.2} ${cy + size * 0.2} H${cx} V${cy + size * 0.05} H${size * 0.8}`}
        stroke="hsl(var(--steami-red))" strokeWidth="0.8" opacity="0.2"
        strokeDasharray="4 3" style={{ animation: 'svg-dash 5s linear infinite', strokeDashoffset: 7 }} />
      {/* Nodes */}
      {[
        { x: cx - 6, y: cy }, { x: cx, y: cy + size * 0.05 },
        { x: size * 0.75, y: cy - size * 0.25 }, { x: size * 0.8, y: cy + size * 0.05 },
      ].map((n, i) => (
        <rect key={i} x={n.x - 2.5} y={n.y - 2.5} width={5} height={5} rx={1}
          fill="hsl(var(--steami-red))"
          style={{ animation: `svg-pulse ${2 + i * 0.5}s ease-in-out infinite` }} />
      ))}
    </svg>
  );
}

// Fallback — generic pulsing network
function GenericSvg({ size }: { size: number }) {
  const cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <circle cx={cx} cy={cy} r={size * 0.2}
        stroke="hsl(var(--steami-cyan))" strokeWidth="0.7" opacity="0.2"
        style={{ animation: 'svg-pulse 3s ease-in-out infinite' }} />
      <circle cx={cx} cy={cy} r={size * 0.33}
        stroke="hsl(var(--steami-cyan))" strokeWidth="0.5" opacity="0.12"
        style={{ animation: 'svg-pulse 4s ease-in-out infinite' }} />
      <circle cx={cx} cy={cy} r={2.5} fill="hsl(var(--steami-cyan))" opacity="0.6" />
    </svg>
  );
}

const fieldMap: Record<string, (props: { size: number }) => JSX.Element> = {
  'QUANTUM PHYSICS': QuantumSvg,
  'BIOLOGY': BiologySvg,
  'AI': AiSvg,
  'EARTH & SPACE': SpaceSvg,
  'CLIMATE & ENERGY': EnergySvg,
  'COMPUTER SCIENCE': CompSciSvg,
};

function CardSvgVisualInner({ field, variant = 'mini', className = '' }: CardSvgVisualProps) {
  const size = variant === 'mini' ? 56 : variant === 'featured' ? 80 : 64;
  const Component = fieldMap[field] || GenericSvg;

  return (
    <div className={`pointer-events-none select-none flex-shrink-0 ${className}`}
      style={{ opacity: 0.85 }}>
      <Component size={size} />
    </div>
  );
}

export const CardSvgVisual = memo(CardSvgVisualInner);
