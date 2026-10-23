import { useEffect, useState } from 'react';
import { Link, Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { MaskIcon, Tooltip } from '../../components/ui/index.jsx';
import { useCurrentUser } from '../../state/useCurrentUser.js';
import { CARD, PLANS, WALLETS } from './consoleData.js';
import './Console.css';

export const CICON = (name) => `/assets/console/${name}.svg`;

const API_DOCS_URL = 'https://deep-edu-docs.sotatek.works/vi/docs/getting-started';

const BILLING = [
  { to: '/tai-khoan/goi-dich-vu', label: 'Gói dịch vụ' },
  { to: '/tai-khoan/lich-su-giao-dich', label: 'Lịch sử giao dịch' },
  { to: '/tai-khoan/phuong-thuc-thanh-toan', label: 'Phương thức thanh toán' },
];

const TITLES = {
  '/tai-khoan': 'Dashboard',
  '/tai-khoan/goi-dich-vu': 'Gói dịch vụ',
  '/tai-khoan/lich-su-giao-dich': 'Lịch sử giao dịch',
  '/tai-khoan/phuong-thuc-thanh-toan': 'Phương thức thanh toán',
};

function ConsoleLogo() {
  return (
    <Link to="/" className="console-logo" aria-label="Trang chủ DeepEdu">
      <span className="console-logo__mark" aria-hidden="true">
        <img className="console-logo__l1" src={CICON('logo-layer1')} alt="" />
        <img className="console-logo__l2" src={CICON('logo-layer2')} alt="" />
      </span>
      <span className="console-logo__text">
        <span className="console-logo__name">DeepEdu</span>
        <span className="console-logo__sub">Tài khoản cá nhân</span>
      </span>
    </Link>
  );
}

function Sidebar({ user, onCollapse }) {
  const { pathname } = useLocation();
  const billingActive = BILLING.some((b) => pathname === b.to);
  const [billingOpen, setBillingOpen] = useState(billingActive);

  // Opening a billing page from elsewhere (e.g. the assistant's account menu) expands the group.
  useEffect(() => {
    if (billingActive) setBillingOpen(true);
  }, [billingActive]);

  return (
    <aside className="console-sidebar">
      <div className="console-sidebar__top">
        <ConsoleLogo />
        <div className="console-sidebar__actions">
          <Tooltip label="Chuyển đến Trợ lý DeepEdu">
            <Link to="/tro-ly" className="console-icon-btn" aria-label="Chuyển đến Trợ lý DeepEdu">
              <img src={CICON('ic-chat')} alt="" width="24" height="24" />
            </Link>
          </Tooltip>
          <button type="button" className="console-icon-btn" onClick={onCollapse} aria-label="Thu gọn thanh bên">
            <img src={CICON('ic-layout-right')} alt="" width="24" height="24" />
          </button>
        </div>
      </div>

      <nav className="console-nav" aria-label="Quản lý tài khoản">
        <NavLink to="/tai-khoan" end className={({ isActive }) => `console-nav__item${isActive ? ' is-active' : ''}`}>
          <MaskIcon src={CICON('ic-bar-chart')} size={24} />
          <span className="console-nav__label">Dashboard</span>
        </NavLink>

        <div className={`console-nav__group${billingActive ? ' is-active' : ''}${billingOpen ? ' is-open' : ''}`}>
          <button
            type="button"
            className="console-nav__item console-nav__item--head"
            onClick={() => setBillingOpen((o) => !o)}
            aria-expanded={billingOpen}
          >
            <MaskIcon src={CICON('ic-currency-dollar')} size={24} />
            <span className="console-nav__label">Gói cước &amp; credits</span>
            <MaskIcon src={CICON('ic-chevron-right')} size={24} className="console-nav__chevron" />
          </button>
          {billingOpen && (
            <div className="console-nav__sub">
              {BILLING.map((b) => (
                <NavLink
                  key={b.to}
                  to={b.to}
                  className={({ isActive }) => `console-nav__subitem${isActive ? ' is-active' : ''}`}
                >
                  <span>{b.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>

        <a href={API_DOCS_URL} target="_blank" rel="noopener noreferrer" className="console-nav__item">
          <MaskIcon src={CICON('ic-asterisk')} size={24} />
          <span className="console-nav__label">Tài liệu API</span>
        </a>
      </nav>

      <div className="console-user">
        <span className="console-user__avatar">{user.initial}</span>
        <span className="console-user__text">
          <span className="console-user__name">{user.name}</span>
          <span className="console-user__email">{user.email}</span>
        </span>
      </div>
    </aside>
  );
}

/**
 * Personal account console (Dashboard, gói cước, giao dịch, thanh toán), opened from the assistant sidebar.
 * Billing state lives here so the pages agree on the current plan and linked methods.
 */
export default function ConsoleLayout() {
  const user = useCurrentUser();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [planId, setPlanId] = useState('plus');
  const [card, setCard] = useState(CARD);
  const [wallets, setWallets] = useState(WALLETS);
  const [autoRenew, setAutoRenew] = useState(true);

  if (!user) return <Navigate to="/dang-nhap" replace />;

  const billing = {
    plan: PLANS.find((p) => p.id === planId),
    setPlanId,
    card,
    removeCard: () => setCard(null),
    wallets,
    removeWallet: (id) => setWallets((ws) => ws.filter((w) => w.id !== id)),
    autoRenew,
    setAutoRenew,
  };

  return (
    <div className={`console-app${collapsed ? ' is-collapsed' : ''}`}>
      {!collapsed && <Sidebar user={user} onCollapse={() => setCollapsed(true)} />}

      <main className="console-main">
        <header className="console-header">
          {collapsed && (
            <button
              type="button"
              className="console-icon-btn console-icon-btn--dark"
              onClick={() => setCollapsed(false)}
              aria-label="Mở thanh bên"
            >
              <MaskIcon src={CICON('ic-layout-right')} size={24} />
            </button>
          )}
          <h1 className="console-header__title">{TITLES[pathname] || 'Dashboard'}</h1>
        </header>
        <div className="console-scroll">
          <Outlet context={{ user, billing }} />
        </div>
      </main>
    </div>
  );
}
