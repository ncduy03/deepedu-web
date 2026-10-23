import { useState } from 'react';

/** 1138000 → "1.1M", 96400 → "96.4K", 46 → "46". */
export function formatCompact(v) {
  const trim = (n) => n.toFixed(1).replace(/\.0$/, '');
  if (v >= 1e6) return `${trim(v / 1e6)}M`;
  if (v >= 1e3) return `${trim(v / 1e3)}K`;
  return String(Math.round(v));
}

/** Round axis maximum with 4 equal steps, e.g. 516K → 0…600K by 150K. */
function niceScale(max, steps = 4) {
  if (!(max > 0)) return { max: steps * 10, ticks: [0, 10, 20, 30, 40] };
  const raw = max / steps;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const nice = [1, 1.5, 2, 2.5, 3, 5, 10].find((n) => norm <= n) * mag;
  return { max: nice * steps, ticks: Array.from({ length: steps + 1 }, (_, i) => nice * (steps - i)) };
}

/** Smooth path through points without overshoot (monotone cubic, Fritsch–Carlson). */
function smoothPath(pts) {
  if (pts.length < 2) return '';
  const n = pts.length;
  const dx = [];
  const m = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1][0] - pts[i][0];
    m[i] = (pts[i + 1][1] - pts[i][1]) / dx[i];
  }
  const t = [m[0]];
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  t[n - 1] = m[n - 2];
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      t[i] = 0;
      t[i + 1] = 0;
      continue;
    }
    const a = t[i] / m[i];
    const b = t[i + 1] / m[i];
    const h = a * a + b * b;
    if (h > 9) {
      const k = 3 / Math.sqrt(h);
      t[i] = k * a * m[i];
      t[i + 1] = k * b * m[i];
    }
  }
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const c = dx[i] / 3;
    d += ` C${pts[i][0] + c},${pts[i][1] + t[i] * c} ${pts[i + 1][0] - c},${pts[i + 1][1] - t[i + 1] * c} ${pts[i + 1][0]},${pts[i + 1][1]}`;
  }
  return d;
}

/**
 * Chart tooltip (Figma "Chart/Tooltip").
 * `colored` rows print "Label : value" in the series colour; otherwise a dot, grey label and bold value.
 */
export function ChartTooltip({ title, rows, total, colored, titleDivider, style }) {
  return (
    <div className="chart-tooltip" style={style} role="tooltip">
      <p className={`chart-tooltip__title${titleDivider ? ' chart-tooltip__title--strong' : ''}`}>{title}</p>
      {titleDivider && <hr className="chart-tooltip__divider" />}
      {rows.map((r) =>
        colored ? (
          <p key={r.label} className="chart-tooltip__colored" style={{ color: r.color }}>
            {r.label} : {r.value}
          </p>
        ) : (
          <div key={r.label} className="chart-tooltip__row">
            <span className="chart-tooltip__label">
              <span className="chart-tooltip__dot" style={{ background: r.color }} />
              {r.label}
            </span>
            <strong>{r.value}</strong>
          </div>
        ),
      )}
      {total && (
        <>
          <hr className="chart-tooltip__divider" />
          <div className="chart-tooltip__row chart-tooltip__row--total">
            <span>{total.label}</span>
            <strong>{total.value}</strong>
          </div>
        </>
      )}
    </div>
  );
}

export function Legend({ items }) {
  return (
    <ul className="chart-legend">
      {items.map((it) => (
        <li key={it.label} style={{ color: it.color }}>
          <span className="chart-legend__dot" style={{ background: it.color }} />
          {it.label}
        </li>
      ))}
    </ul>
  );
}

/** Positions a tooltip beside point (x%, y%) inside its plot, flipping left near the right edge. */
function tipStyle(xPct, yPct) {
  const flip = xPct > 62;
  return {
    top: `calc(${yPct}% + 12px)`,
    ...(flip ? { right: `calc(${100 - xPct}% + 12px)` } : { left: `calc(${xPct}% + 12px)` }),
  };
}

/** Hover index of the nearest of `count` evenly spaced columns. */
function useHoverIndex(count, spread) {
  const [index, setIndex] = useState(null);
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    setIndex(spread ? (count > 1 ? Math.round(f * (count - 1)) : 0) : Math.min(count - 1, Math.floor(f * count)));
  };
  return { index, onMove, onLeave: () => setIndex(null) };
}

/**
 * Smooth line/area chart over days. Series: { id, label, color, values, dashed?, fill? }.
 * `tooltip(i)` returns the tooltip props for day i.
 */
export function AreaChart({ labels, series, tooltip, height = 190 }) {
  const n = labels.length;
  const { max, ticks } = niceScale(Math.max(0, ...series.flatMap((s) => s.values)));
  const W = 1000;
  const xPct = (i) => (n > 1 ? (i / (n - 1)) * 100 : 50);
  const yPct = (v) => (1 - v / max) * 100;
  const pts = (s) => s.values.map((v, i) => [(xPct(i) / 100) * W, (yPct(v) / 100) * height]);
  const { index, onMove, onLeave } = useHoverIndex(n, true);
  // Every 5th label when there are many days, always keeping the last one.
  const every = n > 12 ? Math.ceil(n / 8) : 1;
  const topY = index == null ? 0 : Math.min(...series.map((s) => yPct(s.values[index])));

  return (
    <div className="area-chart">
      <div className="chart-y" style={{ height }}>
        {ticks.map((t) => (
          <span key={t} style={{ top: `${yPct(t)}%` }}>
            {formatCompact(t)}
          </span>
        ))}
      </div>
      <div className="area-chart__plot" style={{ height }} onMouseMove={onMove} onMouseLeave={onLeave}>
        {ticks.map((t) => (
          <span key={t} className="chart-hline" style={{ top: `${yPct(t)}%` }} />
        ))}
        {n > 1 &&
          labels.map((l, i) => <span key={l} className="chart-vline" style={{ left: `${xPct(i)}%` }} />)}
        <svg viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" aria-hidden="true">
          {n > 1 &&
            series.map((s) => {
              const d = smoothPath(pts(s));
              return (
                <g key={s.id}>
                  {s.fill && <path d={`${d} L${W},${height} L0,${height} Z`} fill={s.fill} stroke="none" />}
                  <path
                    d={d}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="2"
                    strokeDasharray={s.dashed ? '4 3' : undefined}
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              );
            })}
        </svg>
        {n === 1 &&
          series.map((s) => (
            <span
              key={s.id}
              className="chart-dot"
              style={{ left: '50%', top: `${yPct(s.values[0])}%`, background: s.color }}
            />
          ))}
        {index != null && (
          <>
            <span className="chart-guide" style={{ left: `${xPct(index)}%` }} />
            {series.map((s) => (
              <span
                key={s.id}
                className="chart-dot"
                style={{ left: `${xPct(index)}%`, top: `${yPct(s.values[index])}%`, background: s.color }}
              />
            ))}
            <ChartTooltip {...tooltip(index)} style={tipStyle(xPct(index), topY)} />
          </>
        )}
      </div>
      <div className="area-chart__x">
        {labels.map((l, i) =>
          i % every === 0 || i === n - 1 ? (
            <span key={l} style={{ left: `${xPct(i)}%` }}>
              {l}
            </span>
          ) : null,
        )}
      </div>
    </div>
  );
}

/**
 * Vertical bar chart. `bars`: { label, color, stacks: [{ id, color, value }] } — one stack = plain bar.
 * `compact` is the small chart used in the task-type cards.
 */
export function BarChart({ bars, tooltip, height, compact }) {
  const totals = bars.map((b) => b.stacks.reduce((a, s) => a + s.value, 0));
  const { max, ticks } = niceScale(Math.max(0, ...totals));
  const { index, onMove, onLeave } = useHoverIndex(bars.length, false);
  const slot = 100 / bars.length;

  return (
    <div className={`bar-chart${compact ? ' bar-chart--compact' : ''}`}>
      <div className="chart-y" style={{ height }}>
        {ticks.map((t) => (
          <span key={t} style={{ top: `${(1 - t / max) * 100}%` }}>
            {formatCompact(t)}
          </span>
        ))}
      </div>
      <div className="bar-chart__plot" style={{ height }} onMouseMove={onMove} onMouseLeave={onLeave}>
        {ticks.map((t) => (
          <span key={t} className="chart-hline" style={{ top: `${(1 - t / max) * 100}%` }} />
        ))}
        {bars.map((b, i) => (
          <div
            key={b.label}
            className={`bar-chart__slot${index === i ? ' is-hover' : ''}`}
            style={{ left: `${i * slot}%`, width: `${slot}%` }}
          >
            <div className="bar-chart__bar">
              {b.stacks.map((s) =>
                s.value > 0 ? (
                  <span key={s.id} style={{ height: `${(s.value / max) * 100}%`, background: s.color }} />
                ) : null,
              )}
            </div>
          </div>
        ))}
        {index != null && totals[index] > 0 && (
          <ChartTooltip
            {...tooltip(index)}
            style={tipStyle((index + 0.5) * slot, Math.max(0, (1 - totals[index] / max) * 100 - 6))}
          />
        )}
      </div>
      <div className="bar-chart__x">
        {bars.map((b, i) => (
          <span key={b.label} style={{ left: `${(i + 0.5) * slot}%` }}>
            {b.label}
          </span>
        ))}
      </div>
    </div>
  );
}
