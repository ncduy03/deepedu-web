import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MaskIcon } from '../../components/ui/index.jsx';
import { CICON } from './ConsoleLayout.jsx';
import { AreaChart, BarChart, formatCompact, Legend } from './charts.jsx';
import { GOOGLE_SHARE, PERIODS, usageFor } from './consoleData.js';

const C = {
  total: '#f59e0b',
  input: '#8261f1',
  output: '#a78bfa',
  credit: '#10b981',
  chat: '#10b981',
  image: '#3b82f6',
};
const ACCOUNT_ID = 'DEEPEDU-U-2026-1043';
// Estimated API cost, at the rate used in Figma: 180 credit ≈ $11.84 ≈ 300.721đ.
const USD_PER_CREDIT = 11.84 / 180;
const VND_PER_USD = 300721 / 11.84;

const sum = (days, task, key) => days.reduce((a, d) => a + d[task][key], 0);
const both = (d, key) => d.chat[key] + d.image[key];
const tokens = (d) => both(d, 'input') + both(d, 'output');

function CardTitle({ icon, children }) {
  return (
    <h2 className="dash-card__title">
      <img src={CICON(icon)} alt="" width="18" height="18" />
      {children}
    </h2>
  );
}

/** "Thống kê sử dụng theo thời gian" with Token / Request / Credit views. */
function UsageOverTime({ days }) {
  const [view, setView] = useState('token');
  const labels = days.map((d) => d.label);
  const views = {
    token: {
      series: [
        { id: 'input', label: 'Đầu vào (Input)', color: C.input, dashed: true, fill: 'rgba(130, 97, 241, 0.1)', values: days.map((d) => both(d, 'input')) },
        { id: 'output', label: 'Đầu ra (Output)', color: C.output, dashed: true, values: days.map((d) => both(d, 'output')) },
        { id: 'total', label: 'Tổng cộng', color: C.total, values: days.map(tokens) },
      ],
      legend: ['total', 'output', 'input'],
      tooltip: (i) => ({
        title: labels[i],
        colored: true,
        rows: [
          { label: 'Tổng cộng', color: C.total, value: `${formatCompact(tokens(days[i]))} Tokens` },
          { label: 'Đầu ra (Output)', color: C.output, value: `${formatCompact(both(days[i], 'output'))} Tokens` },
          { label: 'Đầu vào (Input)', color: C.input, value: `${formatCompact(both(days[i], 'input'))} Tokens` },
        ],
      }),
    },
    request: {
      series: [{ id: 'req', label: 'Số câu hỏi', color: C.input, fill: 'rgba(130, 97, 241, 0.1)', values: days.map((d) => both(d, 'req')) }],
      tooltip: (i) => ({
        title: labels[i],
        colored: true,
        rows: [{ label: 'Số câu hỏi', color: C.input, value: both(days[i], 'req') }],
      }),
    },
    credit: {
      series: [{ id: 'credit', label: 'Credit sử dụng', color: C.credit, fill: 'rgba(16, 185, 129, 0.1)', values: days.map((d) => both(d, 'credit')) }],
      tooltip: (i) => ({
        title: labels[i],
        colored: true,
        rows: [{ label: 'Credit sử dụng', color: C.credit, value: `${both(days[i], 'credit')} credit` }],
      }),
    },
  };
  const current = views[view];
  const legendOrder = current.legend || current.series.map((s) => s.id);

  return (
    <section className="dash-card">
      <div className="dash-card__head">
        <div>
          <CardTitle icon="ic-trend">Thống kê sử dụng theo thời gian</CardTitle>
          <p className="dash-card__desc">Lượng Token, số câu hỏi và credit bạn đã dùng theo từng ngày</p>
        </div>
        <div className="console-segment" role="tablist" aria-label="Chỉ số">
          {[
            ['token', 'Token'],
            ['request', 'Request'],
            ['credit', 'Credit'],
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
      <AreaChart labels={labels} series={current.series} tooltip={current.tooltip} />
      <Legend items={legendOrder.map((id) => current.series.find((s) => s.id === id))} />
    </section>
  );
}

/** "Thống kê số lượng Token theo Mô hình" — OpenAI vs Google. */
function TokensByModel({ days }) {
  const input = days.reduce((a, d) => a + both(d, 'input'), 0);
  const output = days.reduce((a, d) => a + both(d, 'output'), 0);
  const models = [
    { label: 'openai', color: C.input, share: 1 - GOOGLE_SHARE },
    { label: 'google', color: C.output, share: GOOGLE_SHARE },
  ].map((m) => ({ ...m, input: input * m.share, output: output * m.share }));

  return (
    <section className="dash-card">
      <CardTitle icon="ic-bars">Thống kê số lượng Token theo Mô hình</CardTitle>
      <hr className="dash-card__rule" />
      <BarChart
        height={146}
        bars={models.map((m) => ({ label: m.label, stacks: [{ id: m.label, color: m.color, value: m.input + m.output }] }))}
        tooltip={(i) => ({
          title: models[i].label,
          rows: [
            { label: 'Input Tokens (Prompt)', color: C.input, value: `${formatCompact(models[i].input)} Tokens` },
            { label: 'Output Tokens (Completion)', color: C.output, value: `${formatCompact(models[i].output)} Tokens` },
          ],
          total: { label: 'Tổng số Token (Total)', value: `${formatCompact(models[i].input + models[i].output)} Tokens` },
        })}
      />
    </section>
  );
}

/** "Sử dụng theo loại tác vụ" — requests, tokens and credit per day, split chat / image. */
function UsageByTask({ days }) {
  const active = days.filter((d) => both(d, 'req') > 0);
  const charts = [
    { title: 'Số câu hỏi (Requests)', value: (t) => t.req, total: 'Tổng requests', fmt: String },
    { title: 'Lượng Token Tiêu Thụ', value: (t) => t.input + t.output, total: 'Tổng Token', fmt: formatCompact },
    { title: 'Credit tiêu thụ', value: (t) => t.credit, total: 'Tổng credit', fmt: String },
  ];

  return (
    <section className="dash-card">
      <CardTitle icon="ic-key">Sử dụng theo loại tác vụ</CardTitle>
      <hr className="dash-card__rule" />
      {active.length ? (
        <div className="dash-minis">
          {charts.map((c) => (
            <div key={c.title} className="dash-mini">
              <p className="dash-mini__title">{c.title}</p>
              <BarChart
                compact
                height={120}
                bars={active.map((d) => ({
                  label: d.label,
                  stacks: [
                    { id: 'chat', color: C.chat, value: c.value(d.chat) },
                    { id: 'image', color: C.image, value: c.value(d.image) },
                  ],
                }))}
                tooltip={(i) => ({
                  title: active[i].label,
                  titleDivider: true,
                  rows: [
                    { label: 'Trò chuyện', color: C.chat, value: c.fmt(c.value(active[i].chat)) },
                    { label: 'Tạo ảnh', color: C.image, value: c.fmt(c.value(active[i].image)) },
                  ],
                  total: { label: c.total, value: c.fmt(c.value(active[i].chat) + c.value(active[i].image)) },
                })}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="dash-empty">Chưa có hoạt động trong khoảng thời gian này.</p>
      )}
      <Legend
        items={[
          { label: 'Trò chuyện', color: C.chat },
          { label: 'Tạo ảnh', color: C.image },
        ]}
      />
    </section>
  );
}

/** "Dashboard" — usage and credit overview of the personal account. */
export default function DashboardPage() {
  const { user, billing } = useOutletContext();
  const [period, setPeriod] = useState('7d');
  const days = useMemo(() => usageFor(period), [period]);

  const req = sum(days, 'chat', 'req') + sum(days, 'image', 'req');
  const input = sum(days, 'chat', 'input') + sum(days, 'image', 'input');
  const output = sum(days, 'chat', 'output') + sum(days, 'image', 'output');
  const credit = sum(days, 'chat', 'credit') + sum(days, 'image', 'credit');
  const paid = billing.plan.id !== 'free';
  const usd = credit * USD_PER_CREDIT;
  const vnd = Math.round(usd * VND_PER_USD);

  const kpis = [
    { icon: 'kpi-cpu', label: 'Tổng số Requests', value: req, note: 'Tổng số lượng requests được gửi đến hệ thống' },
    { icon: 'kpi-coins', label: 'Tổng lượng Tokens', value: formatCompact(input + output), note: `Input: ${formatCompact(input)}  •  Output: ${formatCompact(output)}` },
    {
      icon: 'kpi-dollar',
      label: 'Tổng chi phí ước tính',
      value: `${vnd.toLocaleString('vi-VN')}đ`,
      note: `Ước tính tiêu thụ API ($${usd.toFixed(2)})`,
    },
  ];

  return (
    <div className="console-page dash">
      <section className="dash-profile">
        <div className="dash-profile__title">
          <span className="dash-profile__avatar">{user.initial}</span>
          <h2>{user.name}</h2>
          <span className="dash-badge dash-badge--primary">Cá nhân</span>
          <span className={`dash-badge ${paid ? 'dash-badge--positive' : 'dash-badge--neutral'}`}>
            ● Gói {billing.plan.name}
          </span>
        </div>
        <p className="dash-profile__desc">
          Theo dõi lượng sử dụng và credit của tài khoản cá nhân trên DeepEdu.{'  •  '}Mã tài khoản:{' '}
          <strong>{ACCOUNT_ID}</strong>
        </p>
      </section>

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
      <UsageByTask days={days} />
    </div>
  );
}
