import { useEffect, useState } from 'react';
import { Link, matchPath, Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MaskIcon, SwitchSiteButton } from '../../components/ui/index.jsx';
import { useCurrentUser } from '../../state/useCurrentUser.js';
import { useSignup } from '../../state/SignupContext.jsx';
import { CARD, PLANS } from './consoleData.js';
import { PICON, useProjects } from './projectsData.js';
import { ORG_TOPUP } from './orgData.js';
import { AccountMenu } from '../chat/AssistantLayout.jsx';
import './Console.css';
import './Projects.css';

export const CICON = (name) => `/assets/console/${name}.svg`;

/** "Nguyễn Công Duy" → "NGUYEN CONG DUY". */
const toCardName = (name) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toUpperCase();

const USER_CHEVRON = '/assets/chat/ic-alt-arrow-down-user.svg';

const API_DOCS_URL = 'https://deep-edu-docs.sotatek.works/vi/docs/getting-started';

const BILLING = [
  { to: '/tai-khoan/goi-dich-vu', label: 'Gói dịch vụ' },
  // Tạm ẩn — bỏ comment dòng dưới (và route trong App.jsx) để hiện lại "Gói cước chi tiết".
  // { to: '/tai-khoan/goi-cuoc-chi-tiet', label: 'Gói cước chi tiết' },
  { to: '/tai-khoan/lich-su-thanh-toan', label: 'Lịch sử & Thanh toán' },
];

/** Billing sub-menu; organization accounts also get "Tổ chức" (plan, credit balance, API key usage). */
const billingItems = (org) => (org ? [{ to: '/tai-khoan/to-chuc', label: 'Tổ chức' }, ...BILLING] : BILLING);

const TITLES = {
  '/tai-khoan': 'Dashboard',
  '/tai-khoan/goi-dich-vu': 'Gói dịch vụ',
  '/tai-khoan/goi-cuoc-chi-tiet': 'Gói cước chi tiết',
  '/tai-khoan/lich-su-thanh-toan': 'Lịch sử & Thanh toán',
  '/tai-khoan/du-an': 'Dự án',
  '/tai-khoan/to-chuc': 'Tổ chức',
};

/** Project detail pages show a "Quản lý dự án / Chi tiết dự án" breadcrumb instead of a big title. */
const isProjectDetail = (pathname) =>
  Boolean(matchPath('/tai-khoan/du-an/:projectId/*', pathname));

function ConsoleLogo({ org }) {
  return (
    <Link to="/tai-khoan" className="console-logo" aria-label="Về Dashboard">
      <span className="console-logo__mark" aria-hidden="true">
        <img className="console-logo__l1" src={CICON('logo-layer1')} alt="" />
        <img className="console-logo__l2" src={CICON('logo-layer2')} alt="" />
      </span>
      <span className="console-logo__text">
        <span className="console-logo__name">DeepEdu</span>
        <span className="console-logo__sub">{org ? 'Hệ thống quản trị' : 'Tài khoản cá nhân'}</span>
      </span>
    </Link>
  );
}

function Sidebar({ user, onCollapse, onSignOut }) {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const billing = billingItems(user.type === 'org');
  const billingActive = billing.some((b) => pathname === b.to);
  const [billingOpen, setBillingOpen] = useState(billingActive);

  // Opening a billing page from elsewhere (e.g. the assistant's account menu) expands the group.
  useEffect(() => {
    if (billingActive) setBillingOpen(true);
  }, [billingActive]);

  return (
    <aside className="console-sidebar">
      <div className="console-sidebar__top">
        <ConsoleLogo org={user.type === 'org'} />
        <div className="console-sidebar__actions">
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

        <NavLink to="/tai-khoan/du-an" className={({ isActive }) => `console-nav__item${isActive ? ' is-active' : ''}`}>
          <MaskIcon src={PICON('ic-folder')} size={24} />
          <span className="console-nav__label">Quản lý dự án</span>
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
              {billing.map((b) => (
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

      <SwitchSiteButton to="/tro-ly" icon="/assets/shared/ic-switch-sparkles.svg" label="Chatbot" component={Link} />

      <div className="console-user-wrap">
        {menuOpen && <AccountMenu signOutOnly onClose={() => setMenuOpen(false)} onSignOut={onSignOut} />}
        <button
          type="button"
          className="console-user"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
        >
          <span className="console-user__avatar">{user.initial}</span>
          <span className="console-user__text">
            <span className="console-user__name">{user.name}</span>
            <span className="console-user__email">{user.email}</span>
          </span>
          <MaskIcon src={USER_CHEVRON} size={20} className={`console-user__chevron${menuOpen ? ' is-open' : ''}`} />
        </button>
      </div>
    </aside>
  );
}

/** Collapsed sidebar: a narrow icon rail (logo, expand button, nav icons, avatar). */
function SidebarRail({ user, onExpand, onSignOut }) {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const billing = billingItems(user.type === 'org');
  const billingActive = billing.some((b) => pathname === b.to);
  const item = ({ isActive }) => `console-rail__item${isActive ? ' is-active' : ''}`;

  return (
    <aside className="console-sidebar console-sidebar--rail">
      <Link to="/tai-khoan" className="console-rail__logo" aria-label="Về Dashboard">
        <span className="console-logo__mark" aria-hidden="true">
          <img className="console-logo__l1" src={CICON('logo-layer1')} alt="" />
          <img className="console-logo__l2" src={CICON('logo-layer2')} alt="" />
        </span>
      </Link>

      <nav className="console-rail__nav" aria-label="Quản lý tài khoản">
        <button type="button" className="console-rail__item" onClick={onExpand} aria-label="Mở thanh bên" title="Mở thanh bên">
          <MaskIcon src={CICON('ic-layout-right')} size={24} />
        </button>
        <Link
          to="/tro-ly"
          className="console-rail__item"
          aria-label="Chuyển đến Trợ lý DeepEdu"
          title="Chuyển đến Trợ lý DeepEdu"
        >
          <MaskIcon src={CICON('ic-chat')} size={24} />
        </Link>
        <span className="console-rail__divider" aria-hidden="true" />
        <NavLink to="/tai-khoan" end className={item} aria-label="Dashboard" title="Dashboard">
          <MaskIcon src={CICON('ic-bar-chart')} size={24} />
        </NavLink>
        <NavLink to="/tai-khoan/du-an" className={item} aria-label="Quản lý dự án" title="Quản lý dự án">
          <MaskIcon src={PICON('ic-folder')} size={24} />
        </NavLink>
        <NavLink
          to={billing[0].to}
          className={() => item({ isActive: billingActive })}
          aria-label="Gói cước & credits"
          title="Gói cước & credits"
        >
          <MaskIcon src={CICON('ic-currency-dollar')} size={24} />
        </NavLink>
        <a
          href={API_DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="console-rail__item"
          aria-label="Tài liệu API"
          title="Tài liệu API"
        >
          <MaskIcon src={CICON('ic-asterisk')} size={24} />
        </a>
      </nav>

      <div className="console-rail__user">
        {menuOpen && (
          <AccountMenu signOutOnly className="account-menu--rail" onClose={() => setMenuOpen(false)} onSignOut={onSignOut} />
        )}
        <button
          type="button"
          className="console-rail__avatar"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          aria-label={`Tài khoản: ${user.name}`}
          title={`${user.name} · ${user.email}`}
        >
          {user.initial}
        </button>
      </div>
    </aside>
  );
}

/**
 * Account console (Dashboard, dự án, gói cước, giao dịch, thanh toán), opened from the assistant sidebar.
 * Organization (company email) and personal (webmail) accounts share it; only the sidebar label and data differ.
 * Billing state lives here so the pages agree on the current plan and linked methods.
 */
export default function ConsoleLayout() {
  const user = useCurrentUser();
  const { resetPersonal } = useSignup();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [planId, setPlanId] = useState('plus');
  // Demo card printed with the account holder's name, as on a real card ("NGUYEN CONG DUY").
  const [card, setCard] = useState(() => ({ ...CARD, holder: user ? toCardName(user.name) : CARD.holder }));
  const projects = useProjects(user);
  // Organization top-up wallet (credit bought on the Tổ chức page).
  const [topup, setTopup] = useState(ORG_TOPUP);
  // Pages put their header buttons here through a portal (e.g. "Tạo dự án").
  const [headerActions, setHeaderActions] = useState(null);

  if (!user) return <Navigate to="/dang-nhap" replace />;

  // Same as the assistant's account menu: forget the demo account, then go to Đăng nhập.
  const signOut = () => {
    resetPersonal();
    navigate('/dang-nhap', { replace: true });
  };

  // Company email → organization console; webmail → personal console (see state/accountType.js).
  const account = user.type === 'org' ? { type: 'org', ...user.org } : { type: 'personal' };

  const billing = {
    plan: PLANS.find((p) => p.id === planId),
    setPlanId,
    card,
    setCard,
    removeCard: () => setCard(null),
    topup,
    addTopup: (credits) => setTopup((t) => t + credits),
  };

  return (
    <div className={`console-app${collapsed ? ' is-collapsed' : ''}`}>
      {collapsed ? (
        <SidebarRail user={user} onExpand={() => setCollapsed(false)} onSignOut={signOut} />
      ) : (
        <Sidebar user={user} onCollapse={() => setCollapsed(true)} onSignOut={signOut} />
      )}

      <main className="console-main">
        <header className="console-header">
          {isProjectDetail(pathname) ? (
            <h1 className="console-header__crumbs">
              <Link to="/tai-khoan/du-an">
                Quản lý dự án <span aria-hidden="true">/</span>
              </Link>{' '}
              Chi tiết dự án
            </h1>
          ) : (
            <h1 className="console-header__title">{TITLES[pathname] || 'Dashboard'}</h1>
          )}
          <div className="console-header__actions" ref={setHeaderActions} />
        </header>
        <div className="console-scroll">
          <Outlet context={{ user, billing, projects, headerActions, account }} />
        </div>
      </main>
    </div>
  );
}
