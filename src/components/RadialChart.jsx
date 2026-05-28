import { useRef, useState, useEffect } from 'react';
import { categories, ringRadii, ringColors, ringWidths, rotationSpeeds, amenazasCaracterizadas } from '../data';

const CX = 400;
const CY = 400;
const PLANET_R = 13;
const ALIGN_ANGLE = 270;
const ALIGN_DURATION = 2000;
const HOLD_DURATION = 3500;

const amenazaPaths = amenazasCaracterizadas.map((a) => a.path);

const ringInfo = {};
for (const cat of categories) {
  for (const item of cat.items) {
    ringInfo[item.id] = { ring: cat.ring, total: cat.items.length, idx: cat.items.findIndex((i) => i.id === item.id) };
  }
}

function getPos(ring, idx, total, deg) {
  const a = (((deg % 360) + 360) % 360) * (Math.PI / 180) + (idx / total) * 2 * Math.PI;
  return { x: CX + ringRadii[ring] * Math.cos(a), y: CY + ringRadii[ring] * Math.sin(a) };
}

function computeTargetRotations(path, angle) {
  const targets = {};
  for (const id of path) {
    const info = ringInfo[id];
    if (!info) continue;
    targets[info.ring] = angle - (info.idx / info.total) * 360;
  }
  return targets;
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function RadialChart({ filters, onActiveChange }) {
  const [rots, setRots] = useState([0, 0, 0, 0, 0, 0]);
  const [beamPlanets, setBeamPlanets] = useState([]);
  const degs = useRef([0, 0, 0, 0, 0, 0]);
  const modeRef = useRef('normal');
  const amenazaRef = useRef(0);
  const fromRots = useRef([0, 0, 0, 0, 0, 0]);
  const targetRots = useRef([0, 0, 0, 0, 0, 0]);
  const phaseStart = useRef(0);

  useEffect(() => {
    const start = performance.now();
    let frame;

    const tick = (now) => {
      const elapsed = (now - start) / 1000;
      const m = modeRef.current;

      if (m === 'normal') {
        const newRots = rotationSpeeds.map((sp) => ((elapsed * 360) / sp) % 360);
        degs.current = newRots;
        setRots(newRots);

        const phaseElapsed = now - phaseStart.current;
        if (phaseElapsed > 6000) {
          const amIdx = amenazaRef.current;
          const path = amenazaPaths[amIdx];
          if (path) {
            fromRots.current = [...newRots];
            targetRots.current = computeTargetRotations(path, ALIGN_ANGLE);
            phaseStart.current = now;
            modeRef.current = 'aligning';
            onActiveChange?.(amIdx);
          }
        }
      } else if (m === 'aligning') {
        const progress = Math.min((now - phaseStart.current) / ALIGN_DURATION, 1);
        const eased = easeInOut(progress);
        const newRots = rotationSpeeds.map((sp, i) => {
          const from = fromRots.current[i] || 0;
          const to = targetRots.current[i] ?? (degs.current[i] || 0);
          const diff = to - from;
          const normDiff = ((diff % 360) + 540) % 360 - 180;
          return (from + normDiff * eased + 360) % 360;
        });
        degs.current = newRots;
        setRots(newRots);

        if (progress >= 1) {
          const path = amenazaPaths[amenazaRef.current];
          const beam = [];
          for (const id of path) {
            const info = ringInfo[id];
            if (!info) continue;
            const pos = getPos(info.ring, info.idx, info.total, targetRots.current[info.ring] || 0);
            beam.push({ id, ...pos });
          }
          setBeamPlanets(beam);
          phaseStart.current = now;
            modeRef.current = 'aligned';
        }
      } else if (m === 'aligned') {
        if (now - phaseStart.current > HOLD_DURATION) {
          setBeamPlanets([]);
          amenazaRef.current = (amenazaRef.current + 1) % amenazaPaths.length;
          phaseStart.current = now;
          modeRef.current = 'normal';
          onActiveChange?.(null);
        }
      }

      frame = requestAnimationFrame(tick);
    };

    phaseStart.current = performance.now();
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onActiveChange]);

  const hoveredRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  useEffect(() => { hoveredRef.current = hovered; }, [hovered]);

  const beamPolygon = beamPlanets.length > 0
    ? [0, 0, ...beamPlanets.flatMap((p) => [p.x - CX, p.y - CY])]
    : null;

  return (
    <div className="flex items-center justify-center w-full h-full">
      <svg viewBox="0 0 800 800" className="w-full h-full max-w-[95vh] max-h-[95vh]">
        <defs>
          <radialGradient id="beamGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f4a261" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#f4a261" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f4a261" stopOpacity="0" />
          </radialGradient>
        </defs>

        {ringRadii.map((r, i) => (
          <circle key={i} cx={CX} cy={CY} r={r} fill="none"
            stroke={ringColors[i]} strokeWidth={ringWidths[i]} strokeOpacity={0.55} />
        ))}

        {beamPolygon && (
          <g>
            <polygon
              points={beamPolygon.map((v, i) => (i % 2 === 0 ? v + CX : v + CY)).join(' ')}
              fill="url(#beamGrad)"
              opacity={0.5}
            />
            {beamPlanets.map((p) => (
              <circle key={p.id} cx={p.x} cy={p.y} r={PLANET_R + 6}
                fill="none" stroke="#f4a261" strokeWidth={3} strokeOpacity={0.8}
                style={{ filter: 'drop-shadow(0 0 12px #f4a261)' }} />
            ))}
          </g>
        )}

        {categories.map((cat) => {
          const r = cat.ring;
          const n = cat.items.length;
          const rot = rots[r] || 0;
          return (
            <g key={cat.id}>
              {cat.items.map((item, i) => {
                const pos = getPos(r, i, n, rot);
                const sel = filters[cat.id]?.[item.id];
                const h = hovered === item.id;
                const beamItem = beamPlanets.find((bp) => bp.id === item.id);
                const inBeam = !!beamItem;
                let a = sel ? 1 : 0.2;
                if (hovered && sel && !h) a = 0.3;
                if (h || inBeam) a = 1;

                return (
                  <g key={item.id} opacity={a}
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: 'pointer' }}>
                    <circle cx={pos.x} cy={pos.y}
                      r={h || inBeam ? PLANET_R + 4 : PLANET_R}
                      fill={h ? ringColors[r] : inBeam ? '#f4a261' : '#1e293b'}
                      stroke={inBeam ? '#f4a261' : ringColors[r]}
                      strokeWidth={h || inBeam ? 3 : 2}
                      style={{
                        filter: h || inBeam ? `drop-shadow(0 0 8px ${inBeam ? '#f4a261' : ringColors[r]})` : 'none',
                        transition: 'r 0.15s, stroke-width 0.15s, fill 0.15s',
                      }} />
                    <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="central"
                      fill="#fff" fontSize={7} fontWeight={700} fontFamily="'Inter', sans-serif">
                      {item.id}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        <circle cx={CX} cy={CY} r={32} fill="#0a0e1a" stroke="#1e293b" strokeWidth={2} />
        <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="central"
          fill="#64748b" fontSize={10} fontWeight={700} fontFamily="'Inter', sans-serif" letterSpacing="0.15em">
          CE
        </text>
      </svg>
    </div>
  );
}
