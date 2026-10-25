import { useEffect, useMemo, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MaskIcon } from '../../components/ui/index.jsx';
import { CICON } from './ConsoleLayout.jsx';
import { AreaChart, BarChart, formatCompact, Legend } from './charts.jsx';
import { PERIODS, usageFor, VND_PER_USD } from './consoleData.js';

// Chart colours are fixed hex values (the design system has no chart tokens yet).
const C = {
  total: '#f59e0b',
  output: '#8261f1',
  input: '#a78bfa',
  cost: '#10b981',
  fill: 'rgba(130, 97, 241, 0.1)',
  costFill: 'rgba(16, 185, 129, 0.1)',
};
// One colour per selected API key, in selection order.
const KEY_COLORS = ['#10b981', '#3b82f6', '#f59e0b'];
const MAX_KEYS = 3;

const ACCOUNT_ID = 'DEEPEDU-U-2026-1043';
const DESCRIPTION = 'Theo dõi, giám sát chi phí thực tế và hạn mức thông minh trên hệ thống API Gateway chuyên dụng DeepEdu.';

/** Sum of one field over every key used on a day (or over the given key ids only). */
const dayTotal = (day, field, ids) =>
  Object.entries(day.keys).reduce((a, [id, u]) => (ids && !ids.includes(id) ? a : a + u[field]), 0);
const dayTokens = (day, ids) => dayTotal(day, 'input', ids) + dayTotal(day, 'output', ids);
const periodTotal = (days, fn) => days.reduce((a, d) => a + fn(d), 0);

const usd = (v) => `$${Number(v.toFixed(2))}`;
const vnd = (v) => `${Math.round(v).toLocaleString('vi-VN')}đ`;
/** Axis labels of the mini charts: "850.0K", "1.7M", "0". */
const axis = (v) => (v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(1)}K` : String(v));

function CardTitle({ icon, children }) {
  return (
    <h2 className="dash-card__title">
      <img src={CICON(icon)} alt="" width="18" height="18" />
      {children}
    </h2>
  );
}

/** Organization or personal account card at the top of the page. */
function AccountCard({ account, user, plan }) {
  const org = account?.type === 'org';
  return (
    <section className="dash-profile">
      <div className="dash-profile__title">
        {org ? (
          <span className="dash-profile__icon">
            <img src={CICON('ic-building')} alt="" width="18" height="18" />
          </span>
        ) : (
          <span className="dash-profile__avatar">{user.initial}</span>
        )}
        <h2>{org ? account.name : user.name}</h2>
        <span className="dash-badge dash-badge--primary">{org ? 'DeepEdu' : 'Cá nhân'}</span>
        {org ? (
          <span className="dash-badge dash-badge--positive">● Đang hoạt động</span>
        ) : (
          <span className={`dash-badge ${plan.id !== 'free' ? 'dash-badge--positive' : 'dash-badge--neutral'}`}>
            ● Gói {plan.name}
          </span>
        )}
      </div>
      <p className="dash-profile__desc">
        {DESCRIPTION}
        {'  •  '}
        {org ? 'Mã tổ chức' : 'Mã tài khoản'}: <strong>{org ? account.code : ACCOUNT_ID}</strong>
      </p>
    </section>
  );
}

/** "Thống kê sử dụng API theo thời gian" with Token / Request / Chi phí views. */
function UsageOverTime({ days }) {
  const [view, setView] = useState('token');
  const labels = days.map((d) => d.label);
  const views = {
    token: {
      series: [
        { id: 'total', label: 'Tổng cộng', color: C.total, fill: C.fill, values: days.map((d) => dayTokens(d)) },
        { id: 'output', label: 'Đầu ra (Output)', color: C.output, dashed: true, values: days.map((d) => dayTotal(d, 'output')) },
        { id: 'input', label: 'Đầu vào (Input)', color: C.input, dashed: true, values: days.map((d) => dayTotal(d, 'input')) },
      ],
      tooltip: (i) => ({
        title: labels[i],
        colored: true,
        rows: [
          { label: 'Tổng cộng', color: C.total, value: `${formatCompact(dayTokens(days[i]))} Tokens` },
          { label: 'Đầu ra (Output)', color: C.output, value: `${formatCompact(dayTotal(days[i], 'output'))} Tokens` },
          { label: 'Đầu vào (Input)', color: C.input, value: `${formatCompact(dayTotal(days[i], 'input'))} Tokens` },
        ],
      }),
    },
    request: {
      series: [{ id: 'req', label: 'Số Requests', color: C.output, fill: C.fill, values: days.map((d) => dayTotal(d, 'req')) }],
      tooltip: (i) => ({
        title: labels[i],
        colored: true,
        rows: [{ label: 'Số Requests', color: C.output, value: dayTotal(days[i], 'req') }],
      }),
    },
    cost: {
      series: [{ id: 'cost', label: 'Chi phí ($)', color: C.cost, fill: C.costFill, values: days.map((d) => dayTotal(d, 'usd')) }],
      yFormat: usd,
      tooltip: (i) => ({
        title: labels[i],
        colored: true,
        rows: [{ label: 'Chi phí ($)', color: C.cost, value: usd(dayTotal(days[i], 'usd')) }],
      }),
    },
  };
  const current = views[view];

  return (
    <section className="dash-card">
      <div className="dash-card__head">
        <div>
          <CardTitle icon="ic-trend">Thống kê sử dụng API theo thời gian</CardTitle>
          <p className="dash-card__desc">Biểu diễn số lượng Token và số lượng Request đã sử dụng qua hệ thống</p>
        </div>
        <div className="console-segment" role="tablist" aria-label="Chỉ số">
          {[
            ['token', 'Token'],
            ['request', 'Request'],
            ['cost', 'Chi phí'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={view === id}
              className={`console-segment__item${view === id ? ' is-active' : ''}`}
              onClick={() => setView(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <hr className="dash-card__rule" />
      <AreaChart labels={labels} series={current.series} tooltip={current.tooltip} yFormat={current.yFormat} />
      <Legend items={current.series} />
    </section>
  );
}

/** "Thống kê số lượng Token theo Mô hình" — OpenAI vs Google. */
function TokensByModel({ days }) {
  const google = {
    input: periodTotal(days, (d) => Object.values(d.keys).reduce((a, u) => a + u.google.input, 0)),
    output: periodTotal(days, (d) => Object.values(d.keys).reduce((a, u) => a + u.google.output, 0)),
  };
  const all = { input: periodTotal(days, (d) => dayTotal(d, 'input')), output: periodTotal(days, (d) => dayTotal(d, 'output')) };
  const models = [
    { label: 'openai', input: all.input - google.input, output: all.output - google.output },
    { label: 'google', ...google },
  ];

  return (
    <section className="dash-card">
      <CardTitle icon="ic-bars">Thống kê số lượng Token theo Mô hình</CardTitle>
      <hr className="dash-card__rule" />
      <BarChart
        height={146}
        yFormat={axis}
        bars={models.map((m) => ({ label: m.label, stacks: [{ id: m.label, color: C.output, value: m.input + m.output }] }))}
        tooltip={(i) => ({
          title: models[i].label,
          titleDivider: true,
          rows: [
            { label: 'Input Tokens (Prompt)', color: C.output, value: `${formatCompact(models[i].input)} Tokens` },
            { label: 'Output Tokens (Completion)', color: C.input, value: `${formatCompact(models[i].output)} Tokens` },
          ],
          total: { label: 'Tổng số Token (Total)', value: `${formatCompact(models[i].input + models[i].output)} Tokens` },
        })}
      />
    </section>
  );
}

/** "Chọn API Key (Tối đa 3)" popover under the filter button. */
function KeyPicker({ keys, selected, onToggle, onClose, anchor }) {
  const ref = useRef(null);

  useEffect(() => {
    const onDown = (e) => !ref.current?.contains(e.target) && !anchor.current?.contains(e.target) && onClose();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose, anchor]);

  const full = selected.length >= MAX_KEYS;

  return (
    <div className="dash-keypick" ref={ref} role="dialog" aria-label="Chọn API Key">
      <div className="dash-keypick__head">
        <p className="dash-keypick__title">Chọn API Key (Tối đa {MAX_KEYS})</p>
        <p className="dash-keypick__count">
          Đã chọn {selected.length}/{MAX_KEYS}
        </p>
      </div>
      <hr className="dash-card__rule" />
      <div className="dash-keypick__list">
        {keys.map((k) => {
          const on = selected.includes(k.id);
          const disabled = !on && full;
          return (
            <label
              key={k.id}
              className={`dash-keypick__row${on ? ' is-selected' : ''}${disabled ? ' is-disabled' : ''}`}
              title={disabled ? `Chỉ chọn tối đa ${MAX_KEYS} API Key` : undefined}
            >
              <span className="dash-keypick__name">{k.name}</span>
              <span className="dash-keypick__reqs">{k.reqs} reqs</span>
              <input type="checkbox" checked={on} disabled={disabled} onChange={() => onToggle(k.id)} />
              <span className="dash-keypick__box" aria-hidden="true">
                <img src="/assets/auth/ic-checkbox-check.svg" alt="" />
              </span>
            </label>
          );
        })}
        {!keys.length && <p className="dash-keypick__empty">Chưa có API Key nào.</p>}
      </div>
    </div>
  );
}

/** "Phân tích hiệu năng & Chi phí theo API Key" — requests, tokens and cost per day, stacked by selected key. */
function KeyAnalysis({ days, keys, selected, onToggle }) {
  const [open, setOpen] = useState(false);
  const filterBtn = useRef(null);
  const chosen = selected
    .map((id, i) => ({ id, color: KEY_COLORS[i], name: keys.find((k) => k.id === id)?.name || id }))
    .filter((k) => keys.some((x) => x.id === k.id));
  const ids = chosen.map((k) => k.id);
  const active = days.filter((d) => dayTotal(d, 'req', ids) > 0);

  const charts = [
    { title: 'Số lượng Request (Lượt gọi)', value: (u) => u.req, total: 'Tổng requests', fmt: String, axis: String },
    { title: 'Lượng Token Tiêu Thụ', value: (u) => u.input + u.output, total: 'Tổng Token', fmt: formatCompact, axis },
    {
      title: 'Chi Phí Tiêu Thụ (Ước Tính)',
      value: (u) => u.usd * VND_PER_USD,
      total: 'Tổng chi phí',
      fmt: (v) => `${formatCompact(v)} VND`,
      axis: (v) => `${axis(v)} VND`,
      yWidth: 76,
    },
  ];
  const val = (day, key, c) => (day.keys[key.id] ? c.value(day.keys[key.id]) : 0);

  return (
    <section className="dash-card">
      <div className="dash-card__head dash-card__head--center">
        <CardTitle icon="ic-key">Phân tích hiệu năng &amp; Chi phí theo API Key</CardTitle>
        <div className="dash-filter">
          <button
            ref={filterBtn}
            type="button"
            className={`dash-filter__btn${open ? ' is-open' : ''}`}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-label="Chọn API Key"
            title="Chọn API Key"
          >
            <img src={CICON('ic-filter')} alt="" width="16" height="16" />
          </button>
          {open && (
            <KeyPicker keys={keys} selected={selected} onToggle={onToggle} onClose={() => setOpen(false)} anchor={filterBtn} />
          )}
        </div>
      </div>
      <hr className="dash-card__rule" />
      {!chosen.length ? (
        <p className="dash-empty">Chọn ít nhất 1 API Key để xem phân tích.</p>
      ) : active.length ? (
        <div className="dash-minis">
          {charts.map((c) => (
            <div key={c.title} className="dash-mini">
              <p className="dash-mini__title">{c.title}</p>
              <BarChart
                compact
                height={120}
                yFormat={c.axis}
                yWidth={c.yWidth}
                bars={active.map((d) => ({
                  label: d.label,
                  stacks: chosen.map((k) => ({ id: k.id, color: k.color, value: val(d, k, c) })),
                }))}
                tooltip={(i) => {
                  const rows = chosen
                    .map((k) => ({ label: k.name, color: k.color, raw: val(active[i], k, c) }))
                    .filter((r) => r.raw > 0);
                  return {
                    title: active[i].label,
                    titleDivider: true,
                    rows: rows.map((r) => ({ ...r, value: c.fmt(r.raw) })),
                    total: { label: c.total, value: c.fmt(rows.reduce((a, r) => a + r.raw, 0)) },
                  };
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="dash-empty">Các API Key đã chọn chưa có hoạt động trong khoảng thời gian này.</p>
      )}
    </section>
  );
}

/** API keys of all projects with their requests in the period, most used first. */
function keysWithRequests(projects, days) {
  const list = projects.list.flatMap((p) => p.keys.map((k) => ({ id: k.id, name: k.name })));
  return list
    .map((k) => ({ ...k, reqs: periodTotal(days, (d) => d.keys[k.id]?.req || 0) }))
    .sort((a, b) => b.reqs - a.reqs);
}

/** "Dashboard" — usage and cost overview. Same layout for organization and personal accounts. */
export default function DashboardPage() {
  const { user, billing, projects, account } = useOutletContext();
  const [period, setPeriod] = useState('7d');
  const days = useMemo(() => usageFor(period), [period]);
  const keys = useMemo(() => keysWithRequests(projects, days), [projects, days]);
  // Default: the 3 keys with the most requests in the default period.
  const [selected, setSelected] = useState(() => keys.slice(0, MAX_KEYS).map((k) => k.id));

  const toggleKey = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < MAX_KEYS ? [...s, id] : s));

  const req = periodTotal(days, (d) => dayTotal(d, 'req'));
  const input = periodTotal(days, (d) => dayTotal(d, 'input'));
  const output = periodTotal(days, (d) => dayTotal(d, 'output'));
  const cost = periodTotal(days, (d) => dayTotal(d, 'usd'));

  const kpis = [
    { icon: 'kpi-cpu', label: 'Tổng số Requests', value: req, note: 'Tổng số lượng requests được gửi đến hệ thống' },
    {
      icon: 'kpi-coins',
      label: 'Tổng lượng Tokens',
      value: formatCompact(input + output),
      note: `Input: ${formatCompact(input)}  •  Output: ${formatCompact(output)}`,
    },
    { icon: 'kpi-dollar', label: 'Tổng chi phí ước tính', value: vnd(cost * VND_PER_USD), note: `Ước tính tiêu thụ API ($${cost.toFixed(2)})` },
  ];

  return (
    <div className="console-page dash">
      <AccountCard account={account} user={user} plan={billing.plan} />

      <div className="console-tabs dash-tabs" role="tablist" aria-label="Khoảng thời gian">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={period === p.id}
            className={`console-tabs__item${period === p.id ? ' is-active' : ''}`}
            onClick={() => !p.soon && setPeriod(p.id)}
            title={p.soon ? 'Sắp ra mắt' : undefined}
          >
            {p.icon && <MaskIcon src={CICON(p.icon)} size={24} />}
            {p.label}
          </button>
        ))}
      </div>

      <div className="dash-kpis">
        {kpis.map((k) => (
          <div key={k.label} className="dash-kpi">
            <span className="dash-kpi__icon">
              <img src={CICON(k.icon)} alt="" width="16" height="16" />
            </span>
            <p className="dash-kpi__label">{k.label}</p>
            <p className="dash-kpi__value">{k.value}</p>
            <p className="dash-kpi__note">{k.note}</p>
          </div>
        ))}
      </div>

      <UsageOverTime days={days} />
      <TokensByModel days={days} />
      <KeyAnalysis days={days} keys={keys} selected={selected} onToggle={toggleKey} />
    </div>
  );
}
