import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MaskIcon } from '../../components/ui/index.jsx';
import { CICON } from './ConsoleLayout.jsx';
import { CardSection } from './CardSection.jsx';
import { RANGES, STATUS, TRANSACTIONS, USAGE_TODAY } from './consoleData.js';

const PAGE_SIZE = 7;

const COLUMNS = [
  { key: 'time', label: 'Thời gian (time)' },
  { key: 'id', label: 'Mã giao dịch (transaction ID)' },
  { key: 'amount', label: 'Số tiền thanh toán' },
  { key: 'content', label: 'Credit nhận được', sortable: true },
  { key: 'method', label: 'Phương thức thanh toán', sortable: true },
  { key: 'status', label: 'Trạng thái' },
];

/** Page numbers with "…" gaps, e.g. 1 2 3 … 8 9 10. */
function pageItems(total, current) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const keep = new Set([1, 2, 3, total - 2, total - 1, total, current - 1, current, current + 1]);
  const pages = [...keep].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  return pages.flatMap((p, i) => (i > 0 && p - pages[i - 1] > 1 ? ['…', p] : [p]));
}

function Select({ prefix, value, onChange, options }) {
  return (
    <label className="console-select">
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={prefix}>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {prefix}: {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return undefined;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      className="console-copy"
      title={copied ? 'Đã sao chép' : 'Sao chép'}
      aria-label={copied ? 'Đã sao chép' : `Sao chép mã ${text}`}
      onClick={() => navigator.clipboard?.writeText(text).then(() => setCopied(true), () => {})}
    >
      <img src={CICON(copied ? 'ic-check-circle' : 'ic-copy')} alt="" width="16" height="16" />
    </button>
  );
}

function exportCsv(rows) {
  const header = ['Thời gian', 'Mã giao dịch', 'Số tiền', 'Credit nhận được', 'Phương thức', 'Trạng thái'];
  const lines = [header, ...rows.map((t) => [t.time, t.id, t.amount, t.content, t.method.label, STATUS[t.status]])];
  const csv = lines.map((l) => l.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'deepedu-giao-dich.csv';
  a.click();
  URL.revokeObjectURL(url);
}

/** "Lịch sử giao dịch" — linked card, then payments and credit top-ups with search, filters and CSV export. */
export default function TransactionsPage() {
  const { billing } = useOutletContext();
  const [query, setQuery] = useState('');
  const [range, setRange] = useState('30d');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState(null); // { key, dir: 1 | -1 }
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    // Ranges count back from the demo "today", so the sample data looks the same whenever it is opened.
    const days = RANGES.find((r) => r.id === range).days;
    const from = days ? USAGE_TODAY.getTime() - days * 86400000 : -Infinity;
    const q = query.trim().toLowerCase();
    const list = TRANSACTIONS.filter(
      (t) =>
        t.date.getTime() > from &&
        (status === 'all' || t.status === status) &&
        (!q || t.id.toLowerCase().includes(q)),
    );
    if (sort) {
      const val = (t) => (sort.key === 'method' ? t.method.label : t[sort.key]);
      list.sort((a, b) => val(a).localeCompare(val(b), 'vi') * sort.dir);
    }
    return list;
  }, [query, range, status, sort]);

  useEffect(() => setPage(1), [query, range, status, sort]);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const visible = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (key) =>
    setSort((s) => (s?.key === key ? (s.dir === 1 ? { key, dir: -1 } : null) : { key, dir: 1 }));

  return (
    <div className="console-page console-page--history">
      <section className="console-section">
        <div className="console-section__head">
          <h2>Thẻ thanh toán</h2>
          <p className="console-section__caption">Thẻ Visa, Mastercard, JCB được mã hóa và liên kết với tài khoản</p>
        </div>
        <div className="console-methods">
          <CardSection card={billing.card} setCard={billing.setCard} removeCard={billing.removeCard} />
        </div>
      </section>

      <section className="console-section">
      <div className="console-section__head">
        <h2>Giao dịch nạp tiền &amp; credit</h2>
        <p className="console-section__caption">Tra cứu và xuất hoá đơn chi tiết các lượt nạp thêm credit và gói tháng</p>
      </div>

      <div className="console-toolbar">
        <div className="console-toolbar__filters">
          <label className="console-search console-search--wide">
            <img src={CICON('ic-search')} alt="" width="24" height="24" />
            <input
              type="search"
              placeholder="Tìm theo mã giao dịch (TOPUP-... / SUB-...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Tìm theo mã giao dịch"
            />
          </label>
          <Select prefix="Trong khoảng" value={range} onChange={setRange} options={RANGES} />
          <Select
            prefix="Trạng thái"
            value={status}
            onChange={setStatus}
            options={[{ id: 'all', label: 'Tất cả' }, ...Object.entries(STATUS).map(([id, label]) => ({ id, label }))]}
          />
        </div>
        <button
          type="button"
          className="ui-btn ui-btn--secondary ui-btn--icon-left"
          onClick={() => exportCsv(rows)}
          disabled={!rows.length}
        >
          <img src={CICON('ic-file-download')} alt="" width="24" height="24" />
          Xuất CSV
        </button>
      </div>

      <div className="console-table-wrap">
        <div className="console-table-scroll">
          <table className="console-table">
            <thead>
              <tr>
                {COLUMNS.map((c) => (
                  <th
                    key={c.key}
                    className={`col-${c.key}`}
                    aria-sort={sort?.key === c.key ? (sort.dir === 1 ? 'ascending' : 'descending') : undefined}
                  >
                    {c.sortable ? (
                      <button type="button" className="console-table__sort" onClick={() => toggleSort(c.key)}>
                        {c.label}
                        <img
                          src={CICON('ic-sort')}
                          alt=""
                          width="16"
                          height="16"
                          className={sort?.key === c.key && sort.dir === 1 ? 'is-asc' : ''}
                        />
                      </button>
                    ) : (
                      c.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((t) => (
                <tr key={t.id}>
                  <td>{t.time}</td>
                  <td>
                    <span className="console-table__id">
                      {t.id}
                      <CopyButton text={t.id} />
                    </span>
                  </td>
                  <td>{t.amount}</td>
                  <td className={t.status === 'success' ? 'is-positive' : 'is-muted'}>{t.content}</td>
                  <td>
                    <span className="console-table__method">
                      {t.method.brand && <img src={CICON('visa')} alt="" width="24" height="24" />}
                      {t.method.label}
                    </span>
                  </td>
                  <td>
                    <span className={`console-badge console-badge--${t.status}`}>{STATUS[t.status]}</span>
                  </td>
                </tr>
              ))}
              {!visible.length && (
                <tr>
                  <td colSpan={COLUMNS.length} className="console-table__empty">
                    Không có giao dịch phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="console-result-count">
        {rows.length
          ? `Hiển thị ${(page - 1) * PAGE_SIZE + 1}-${(page - 1) * PAGE_SIZE + visible.length} trong tổng số ${rows.length} kết quả`
          : 'Không có kết quả'}
      </p>

      {rows.length > 0 && (
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
    </div>
  );
}
