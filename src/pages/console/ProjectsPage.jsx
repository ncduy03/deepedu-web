import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { FormDialog } from './ProjectDialogs.jsx';
import { formatCount, PICON, PROJECT_FILTERS, PROJECT_STATUS } from './projectsData.js';
import './Projects.css';

const PAGE_SIZE = 10;

/** Green "Hoạt động" / yellow "Tạm dừng" / "Vô hiệu hóa" pill with a dot. */
export function StatusBadge({ active, label }) {
  return (
    <span className={`pj-status ${active ? 'is-positive' : 'is-warning'}`}>
      <img src={PICON(active ? 'dot-positive' : 'dot-warning')} alt="" width="6" height="6" />
      {label}
    </span>
  );
}

/** "Hiển thị 1-10 trong tổng số 11 kết quả" + chevrons and round page numbers. */
export function Pagination({ total, page, pageSize, onPage }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const shown = Math.min(page * pageSize, total);
  return (
    <div className="pj-pagination">
      <p className="pj-pagination__count">
        {total ? `Hiển thị ${(page - 1) * pageSize + 1}-${shown} trong tổng số ${total} kết quả` : 'Không có kết quả'}
      </p>
      {total > 0 && (
        <nav className="pj-pagination__pages" aria-label="Phân trang">
          <button
            type="button"
            className="pj-pagination__arrow"
            onClick={() => onPage(page - 1)}
            disabled={page === 1}
            aria-label="Trang trước"
          >
            <img src={PICON('ic-chevron-left')} alt="" width="18" height="18" />
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              className={`pj-pagination__page${p === page ? ' is-current' : ''}`}
              aria-current={p === page ? 'page' : undefined}
              onClick={() => onPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            className="pj-pagination__arrow"
            onClick={() => onPage(page + 1)}
            disabled={page === pages}
            aria-label="Trang sau"
          >
            <img src={PICON('ic-chevron-right')} alt="" width="18" height="18" />
          </button>
        </nav>
      )}
    </div>
  );
}

function StatusFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = PROJECT_FILTERS.find((f) => f.id === value);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="pj-filter" ref={ref}>
      <button
        type="button"
        className={`pj-filter__trigger${open ? ' is-open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        Trạng thái: {current.label}
      </button>
      {open && (
        <ul className="pj-menu" role="listbox" aria-label="Trạng thái">
          {PROJECT_FILTERS.map((f) => (
            <li key={f.id} role="option" aria-selected={f.id === value}>
              <button
                type="button"
                className={`pj-menu__option${f.id === value ? ' is-selected' : ''}`}
                onClick={() => {
                  onChange(f.id);
                  setOpen(false);
                }}
              >
                {f.label}
                {f.id === value && <img src={PICON('ic-check-16')} alt="" width="16" height="16" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const KPIS = [
  { icon: 'kpi-folder', label: 'Tổng số dự án', value: (p) => p.list.length },
  { icon: 'kpi-users', label: 'Tổng thành viên', value: (p) => p.memberCount },
  { icon: 'kpi-coins', label: 'Tổng Tokens đã gọi', value: (p) => formatCount(p.tokenCount) },
];

/** "Dự án" — KPIs, search + status filter, and the paginated project table. */
export default function ProjectsPage() {
  const { projects, headerActions } = useOutletContext();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [creating, setCreating] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.list.filter(
      (p) =>
        (status === 'all' || p.status === status) &&
        (!q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)),
    );
  }, [projects.list, query, status]);

  useEffect(() => setPage(1), [query, status]);

  const visible = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="pj-page">
      {headerActions &&
        createPortal(
          <button type="button" className="ui-btn ui-btn--primary pj-btn--sm" onClick={() => setCreating(true)}>
            <img src={PICON('ic-plus-20')} alt="" width="20" height="20" />
            Tạo dự án
          </button>,
          headerActions,
        )}

      <div className="pj-kpis">
        {KPIS.map((k) => (
          <div key={k.label} className="pj-kpi">
            <span className="pj-kpi__icon">
              <img src={PICON(k.icon)} alt="" width="18" height="18" />
            </span>
            <p className="pj-kpi__label">{k.label}</p>
            <p className="pj-kpi__value">{k.value(projects)}</p>
          </div>
        ))}
      </div>

      <div className="pj-filters">
        <label className="pj-search">
          <img src={PICON('ic-search')} alt="" width="24" height="24" />
          <input
            type="search"
            placeholder="Tìm theo tên dự án, mã dự án..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Tìm theo tên dự án, mã dự án"
          />
        </label>
        <StatusFilter value={status} onChange={setStatus} />
      </div>

      <div className="pj-table-scroll">
        <table className="pj-table pj-table--projects">
          <thead>
            <tr>
              <th className="col-code">Mã dự án</th>
              <th>Tên dự án</th>
              <th className="col-members is-center">Thành viên</th>
              <th className="col-date">Ngày tạo</th>
              <th className="col-status">Trạng thái</th>
              <th className="col-actions is-end">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p) => (
              <tr key={p.id}>
                <td className="pj-table__code">{p.id}</td>
                <td>{p.name}</td>
                <td className="is-center">{p.members.length}</td>
                <td>{p.created}</td>
                <td>
                  <StatusBadge active={p.status === 'active'} label={PROJECT_STATUS[p.status]} />
                </td>
                <td className="is-end">
                  <Link to={`/tai-khoan/du-an/${p.id}`} className="ui-btn ui-btn--tertiary pj-btn--xs">
                    <img src={PICON('ic-eye-16')} alt="" width="16" height="16" />
                    Xem chi tiết
                  </Link>
                </td>
              </tr>
            ))}
            {!visible.length && (
              <tr>
                <td colSpan={6} className="pj-table__empty">
                  Không có dự án phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination total={rows.length} page={page} pageSize={PAGE_SIZE} onPage={setPage} />

      {creating && (
        <FormDialog
          title="Khởi tạo dự án"
          label="Tên dự án"
          placeholder="VD: Trợ lý Luyện Viết Tiếng Anh IELTS"
          confirmLabel="Tạo dự án"
          onClose={() => setCreating(false)}
          onSubmit={(name) => {
            const id = projects.create(name);
            setCreating(false);
            navigate(`/tai-khoan/du-an/${id}`);
          }}
        />
      )}
    </div>
  );
}
