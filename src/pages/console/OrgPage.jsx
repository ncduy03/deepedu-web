import { useEffect, useId, useMemo, useState } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import { MaskIcon } from '../../components/ui/index.jsx';
import { CICON } from './ConsoleLayout.jsx';
import { pageItems } from './TransactionsPage.jsx';
import { formatCompact } from './charts.jsx';
import { PICON } from './projectsData.js';
import { creatorOf, KEY_STATS, KEY_STATUS_FILTERS, OICON, ORG_PLAN, TOPUP_PACKAGES } from './orgData.js';
import './Org.css';

const PAGE_SIZE = 10;
const num = (n) => n.toLocaleString('en-US'); // "5,317,172" as in the design
const NO_STATS = { credits: 0, requests: 0, input: 0, output: 0, lastUsed: null };

/** "Mua thêm Credits nạp ví" — pick a package, then confirm the payment. */
function TopupDialog({ onClose, onConfirm }) {
  const titleId = useId();
  const [pick, setPick] = useState(TOPUP_PACKAGES[0].id);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="dialog-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pj-dialog org-topup" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="pj-dialog__header">
          <div className="pj-dialog__titles org-topup__titles">
            <h2 id={titleId} className="pj-dialog__title">
              Mua thêm Credits nạp ví
            </h2>
            <p className="org-topup__desc">
              Chọn gói credit muốn nạp vào ví phụ (Top-up balance). Lượng credit này sẽ được trừ sau khi hết hạn mức chính
              của tháng và không bị hoàn hủy hay hết hạn.
            </p>
          </div>
          <button type="button" className="pj-dialog__close" onClick={onClose} aria-label="Đóng">
            <img src={PICON('ic-close-20')} alt="" width="20" height="20" />
          </button>
        </div>

        <div className="org-topup__packages" role="radiogroup" aria-label="Gói credit">
          {TOPUP_PACKAGES.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={pick === p.id}
              className={`org-topup__package${pick === p.id ? ' is-selected' : ''}`}
              onClick={() => setPick(p.id)}
            >
              <span className="org-topup__price">{p.price}</span>
              <span className="org-topup__credits">+{p.credits} credits</span>
            </button>
          ))}
        </div>

        <div className="pj-dialog__footer">
          <button type="button" className="ui-btn ui-btn--tertiary" onClick={onClose}>
            Hủy bỏ
          </button>
          <button
            type="button"
            className="ui-btn ui-btn--primary"
            onClick={() => onConfirm(TOPUP_PACKAGES.find((p) => p.id === pick))}
          >
            Xác nhận thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}

function Metric({ icon, label, value, note }) {
  return (
    <div className="org-metric">
      <span className="org-metric__icon">
        <img src={OICON(icon)} alt="" width="20" height="20" />
      </span>
      <div className="org-metric__content">
        <p className="org-metric__label">{label}</p>
        <p className="org-metric__value">{value}</p>
        {note && <p className="org-metric__note">{note}</p>}
      </div>
    </div>
  );
}

function SortHeader({ label, col, sort, onSort, className }) {
  const active = sort?.key === col;
  return (
    <th className={className} aria-sort={active ? (sort.dir === -1 ? 'descending' : 'ascending') : undefined}>
      <button type="button" className="org-table__sort" onClick={() => onSort(col)}>
        {label}
        <span className={`org-table__sort-icon${active ? ' is-active' : ''}`} aria-hidden="true">
          {active ? (sort.dir === -1 ? '↓' : '↑') : '⇅'}
        </span>
      </button>
    </th>
  );
}

/** "Tổ chức" — plan, credit balance and per-API-key usage of the organization (company email accounts only). */
export default function OrgPage() {
  const { user, account, projects, billing } = useOutletContext();
  const [topupOpen, setTopupOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState(null); // { key: 'credits' | 'requests', dir: 1 | -1 }
  const [page, setPage] = useState(1);

  const keys = useMemo(
    () =>
      projects.list
        .flatMap((p) =>
          p.keys.map((k) => ({
            id: k.id,
            name: k.name,
            project: p.name,
            active: k.active && p.status === 'active',
            creator: creatorOf(k.id, { name: user.name, email: user.email }),
            ...(KEY_STATS[k.id] || NO_STATS),
          })),
        )
        // Most used first, as in the design.
        .sort((a, b) => b.credits - a.credits),
    [projects.list, user.name, user.email],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = keys.filter(
      (k) =>
        (status === 'all' || (status === 'active') === k.active) &&
        (!q || [k.name, k.id, k.project, k.creator.name, k.creator.email].some((v) => v.toLowerCase().includes(q))),
    );
    if (sort) list.sort((a, b) => (a[sort.key] - b[sort.key]) * sort.dir);
    return list;
  }, [keys, query, status, sort]);

  useEffect(() => setPage(1), [query, status, sort]);

  if (account?.type !== 'org') return <Navigate to="/tai-khoan" replace />;

  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const visible = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const total = (f) => keys.reduce((a, k) => a + k[f], 0);
  const planLeft = Math.max(0, ORG_PLAN.limit - ORG_PLAN.used);
  const usedPct = Math.round((ORG_PLAN.used / ORG_PLAN.limit) * 100);
  const toggleSort = (key) =>
    setSort((s) => (s?.key !== key ? { key, dir: -1 } : s.dir === -1 ? { key, dir: 1 } : null));

  return (
    <div className="console-page org">
      <section className="org-head">
        <h2 className="org-head__name">{account.name}</h2>
        <p className="org-head__meta">
          <span>
            Mã tổ chức: <strong>{account.code}</strong>
          </span>
          <span aria-hidden="true">•</span>
          <span>
            Quản trị viên: <strong>{user.name}</strong>
          </span>
        </p>
      </section>

      <div className="org-plan">
        <div className="org-plan__cards">
          <section className="org-panel">
            <p className="org-panel__label">Gói dịch vụ hiện tại</p>
            <div className="org-panel__main">
              <p className="org-panel__value">{ORG_PLAN.name}</p>
              <p className="org-panel__label">
                Hạn mức <strong>{num(ORG_PLAN.limit)} credit</strong> mỗi chu kỳ thanh toán
              </p>
            </div>
            <p className="org-panel__warning">
              <img src={OICON('ic-calendar-warning')} alt="" width="16" height="16" />
              Gói sẽ kết thúc vào <strong>{ORG_PLAN.cycle.to}</strong>
            </p>
          </section>

          <section className="org-panel">
            <p className="org-panel__label">
              Chu kỳ {ORG_PLAN.cycle.from} – {ORG_PLAN.cycle.to}:
            </p>
            <div className="org-panel__main org-panel__main--row">
              <div>
                <p className="org-panel__value">{num(planLeft + billing.topup)}</p>
                <p className="org-panel__label">Số dư credit khả dụng</p>
              </div>
              <button type="button" className="ui-btn ui-btn--secondary pj-btn--sm" onClick={() => setTopupOpen(true)}>
                <img src={OICON('ic-plus-primary')} alt="" width="20" height="20" />
                Nạp thêm credit
              </button>
            </div>
            <div className="org-panel__split">
              <p className="org-panel__label">
                Credit gói định mức <strong>{num(planLeft)} credit</strong>
              </p>
              <p className="org-panel__label">
                Credit nạp thêm (Không hết hạn) <strong>{num(billing.topup)} credit</strong>
              </p>
            </div>
          </section>
        </div>

        <section className="org-panel org-usage">
          <div className="org-usage__head">
            <p className="org-panel__label">
              Tiêu thụ credit gói trong chu kỳ:{' '}
              <strong>
                {num(ORG_PLAN.used)} / {num(ORG_PLAN.limit)} credit
              </strong>
            </p>
            <span className="org-badge org-badge--primary">
              <img src={OICON('ic-badge-dot')} alt="" width="8" height="8" />
              {usedPct}% đã dùng
            </span>
          </div>
          <div
            className="org-usage__bar"
            role="progressbar"
            aria-valuenow={ORG_PLAN.used}
            aria-valuemin={0}
            aria-valuemax={ORG_PLAN.limit}
            aria-label="Credit gói đã dùng"
          >
            <span style={{ width: `${Math.min(100, usedPct)}%` }} />
          </div>
          <p className="org-panel__label">
            Quy tắc: Credit gói được trừ trước. Credit nạp thêm được dùng sau khi credit gói hết.
          </p>
        </section>
      </div>

      <section className="org-section">
        <div className="org-section__head">
          <div className="org-section__title">
            <h2>API Keys Tracking</h2>
            <span className="org-badge">
              {keys.filter((k) => k.active).length}/{keys.length} Active
            </span>
          </div>
          <p className="org-panel__label">Theo dõi chi tiết mức tiêu thụ credit, request và token cho từng API Key của tổ chức.</p>
        </div>

        <div className="org-metrics">
          <Metric icon="ic-coins" label="Tổng Credit API đã dùng" value={num(total('credits'))} />
          <Metric icon="ic-cpu" label="Tổng số Request" value={num(total('requests'))} note="Tất cả endpoint DeepEdu / UniTeach" />
          <Metric
            icon="ic-coins"
            label="Token đầu vào (Prompt)"
            value={formatCompact(total('input'))}
            note={`${num(total('input'))} tokens`}
          />
          <Metric
            icon="ic-coins"
            label="Token đầu ra (Completion)"
            value={formatCompact(total('output'))}
            note={`${num(total('output'))} tokens`}
          />
        </div>
      </section>

      <section className="org-keys">
        <div className="org-keys__toolbar">
          <label className="org-search">
            <img src={OICON('ic-search-md')} alt="" width="24" height="24" />
            <input
              type="search"
              placeholder="Tìm theo tên key, prefix, project, người tạo..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Tìm API Key"
            />
          </label>
          <label className="org-select">
            <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Trạng thái">
              {KEY_STATUS_FILTERS.map((f) => (
                <option key={f.id} value={f.id}>
                  Trạng thái: {f.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="org-table-wrap">
          <table className="org-table">
            <thead>
              <tr>
                <th className="col-name">Tên key</th>
                <th>Project</th>
                <th className="col-creator">Người tạo</th>
                <SortHeader label="Credit đã dùng" col="credits" sort={sort} onSort={toggleSort} className="col-128" />
                <SortHeader label="Số request" col="requests" sort={sort} onSort={toggleSort} className="col-112" />
                <th className="col-128">Token đầu vào</th>
                <th className="col-118">Token đầu ra</th>
                <th className="col-128">Lần dùng cuối</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((k) => (
                <tr key={k.id} className={k.active ? undefined : 'is-inactive'}>
                  <td className="org-table__key" title={k.name}>
                    {k.name}
                  </td>
                  <td title={k.project}>{k.project}</td>
                  <td>
                    <div className="org-creator">
                      <span className="org-creator__avatar">{k.creator.name ? k.creator.name[0].toUpperCase() : '—'}</span>
                      <span className="org-creator__text">
                        <span>{k.creator.name || '—'}</span>
                        <span className="org-creator__email">{k.creator.email}</span>
                      </span>
                    </div>
                  </td>
                  <td>{num(k.credits)}</td>
                  <td>{num(k.requests)}</td>
                  <td>{num(k.input)}</td>
                  <td>{num(k.output)}</td>
                  <td className={k.lastUsed ? undefined : 'is-muted'}>{k.lastUsed || 'Chưa truy cập'}</td>
                </tr>
              ))}
              {!visible.length && (
                <tr>
                  <td colSpan={8} className="org-table__empty">
                    Không có API Key phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {rows.length > PAGE_SIZE && (
          <nav className="console-pagination" aria-label="Phân trang">
            <button
              type="button"
              className="console-pagination__arrow"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              aria-label="Trang trước"
            >
              <MaskIcon src={CICON('ic-page-prev')} size={20} />
            </button>
            {pageItems(pages, page).map((p, i) =>
              p === '…' ? (
                <span key={`gap-${i}`} className="console-pagination__gap">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  className={`console-pagination__page${p === page ? ' is-current' : ''}`}
                  aria-current={p === page ? 'page' : undefined}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ),
            )}
            <button
              type="button"
              className="console-pagination__arrow"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === pages}
              aria-label="Trang sau"
            >
              <MaskIcon src={CICON('ic-page-next')} size={20} />
            </button>
          </nav>
        )}
      </section>

      {topupOpen && (
        <TopupDialog
          onClose={() => setTopupOpen(false)}
          onConfirm={(pkg) => {
            billing.addTopup(pkg.credits);
            setTopupOpen(false);
          }}
        />
      )}
    </div>
  );
}
