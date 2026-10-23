import { useState } from 'react';
import { MaskIcon } from '../../components/ui/index.jsx';
import { CICON } from './ConsoleLayout.jsx';
import { CHART_DAYS, CHART_SERIES, METRIC_CARDS, METRICS, PERIODS } from './consoleData.js';

// Chart geometry from Figma: 266px tall, 5 grid rows of 51.6px (8px bottom padding), values 0–40.
const CHART_W = 993;
const CHART_H = 266;
const ROW_H = 51.6;
const Y_TICKS = [40, 30, 20, 10, 0];
const yFor = (v) => ROW_H / 2 + ((40 - v) / 40) * ROW_H * 4;

function UsageChart() {
  const [filter, setFilter] = useState('all');
  const tabs = [{ id: 'all', label: 'All' }, ...CHART_SERIES];
  const shown = CHART_SERIES.filter((s) => filter === 'all' || s.id === filter);

  return (
    <div className="console-chart">
      <div className="console-chart__top">
        <div className="console-segment" role="tablist" aria-label="Lọc theo nhà cung cấp">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={filter === t.id}
              className={`console-segment__item${filter === t.id ? ' is-active' : ''}`}
              onClick={() => setFilter(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <ul className="console-legend">
          {CHART_SERIES.map((s) => (
            <li key={s.id}>
              <span className="console-legend__dot" style={{ background: s.color }} />
              {s.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="console-chart__grid">
        <div className="console-chart__plot">
          {Y_TICKS.map((v) => (
            <span key={v} className="console-chart__line" style={{ top: yFor(v) }} />
          ))}
          <div className="console-chart__days">
            {CHART_DAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <svg
            className="console-chart__svg"
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            preserveAspectRatio="none"
            role="img"
            aria-label="Credit sử dụng mỗi ngày theo mô hình AI"
          >
            {shown.map((s) => (
              <polyline
                key={s.id}
                points={s.points.map(([x, v]) => `${x},${yFor(v)}`).join(' ')}
                fill="none"
                stroke={s.color}
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
        </div>
        <div className="console-chart__ticks">
          {Y_TICKS.map((v) => (
            <span key={v}>{v}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** "Dashboard" — credit usage overview of the personal account. */
export default function DashboardPage() {
  const [period, setPeriod] = useState('today');
  const metrics = METRICS[period];

  return (
    <>
      <div className="console-tabs" role="tablist" aria-label="Khoảng thời gian">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={period === p.id}
            className={`console-tabs__item${period === p.id ? ' is-active' : ''}`}
            onClick={() => setPeriod(p.id)}
          >
            {p.icon && <MaskIcon src={CICON(p.icon)} size={24} />}
            {p.label}
          </button>
        ))}
      </div>

      <div className="console-page console-page--dashboard">
        <div className="console-metrics">
          {METRIC_CARDS.map((m) => (
            <div key={m.key} className="console-metric">
              <span className="console-metric__icon">
                <img src={CICON(m.icon)} alt="" width="20" height="20" />
              </span>
              <div className="console-metric__text">
                <p className="console-metric__label">{m.label}</p>
                <p className="console-metric__value">{metrics[m.key]}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="console-section">
          <div className="console-section__head">
            <h2>Credit sử dụng theo mô hình</h2>
            <p className="console-section__caption console-section__caption--body">
              Số credit bạn đã dùng mỗi ngày, phân theo mô hình AI.
            </p>
          </div>
          <UsageChart />
        </section>
      </div>
    </>
  );
}
