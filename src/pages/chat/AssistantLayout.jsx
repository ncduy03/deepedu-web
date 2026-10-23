import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo.jsx';
import { MaskIcon } from '../../components/ui/index.jsx';
import { useSignup } from '../../state/SignupContext.jsx';
import { DEMO_CONVERSATIONS } from './demoConversations.js';
import './ChatPage.css';

export const ICON = (name) => `/assets/chat/${name}.svg`;

// Header icon + title for each assistant page.
const PAGES = {
  '/tro-ly': { title: 'Trợ lý DeepEdu', icon: ICON('ic-notebook'), tint: false },
  '/tro-ly/ho-so': { title: 'Hồ sơ tài khoản', icon: ICON('ic-menu-user'), tint: true },
  '/tro-ly/ho-so/chinh-sua': { title: 'Hồ sơ tài khoản', icon: ICON('ic-menu-user'), tint: true },
  '/tro-ly/gop-y': { title: 'Góp ý sản phẩm', icon: ICON('ic-menu-message'), tint: true },
};

function AccountMenu({ onClose, onSignOut }) {
  const { pathname } = useLocation();
  const ref = useRef(null);

  // Close on outside click / Escape.
  useEffect(() => {
    const onDown = (e) => !ref.current?.parentElement.contains(e.target) && onClose();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const item = (to, icon, label) => (
    <Link
      to={to}
      role="menuitem"
      className={`account-menu__item${pathname.startsWith(to) ? ' is-current' : ''}`}
      onClick={onClose}
    >
      <img src={ICON(icon)} alt="" width="18" height="18" />
      {label}
    </Link>
  );

  return (
    <div className="account-menu" role="menu" ref={ref}>
      {item('/tro-ly/ho-so', 'ic-menu-user', 'Hồ sơ tài khoản')}
      <button type="button" role="menuitem" className="account-menu__item" title="Sắp ra mắt" onClick={onClose}>
        <img src={ICON('ic-menu-credit-card')} alt="" width="18" height="18" />
        Gói cước &amp; credits
      </button>
      {item('/tro-ly/gop-y', 'ic-menu-message', 'Góp ý sản phẩm')}
      <hr className="account-menu__divider" />
      <button type="button" role="menuitem" className="account-menu__item account-menu__item--danger" onClick={onSignOut}>
        <img src={ICON('ic-menu-log-out')} alt="" width="18" height="18" />
        Đăng xuất
      </button>
    </div>
  );
}

function Sidebar({ user, history, activeId, onNewChat, onSelect, onCollapse, onSignOut }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <aside className="chat-sidebar">
      <div className="chat-sidebar__nav">
        <div className="chat-sidebar__head">
          <Link to="/" aria-label="Trang chủ DeepEdu">
            <Logo set="header" height={32.053} />
          </Link>
          <button type="button" className="chat-icon-btn" onClick={onCollapse} aria-label="Thu gọn thanh bên">
            <img src={ICON('ic-sidebar-collapse')} alt="" width="20" height="20" />
          </button>
        </div>

        <div className="chat-sidebar__section">
          {user && (
            <div className="chat-sidebar__label">
              <span>Đoạn chat gần đây</span>
              <img src={ICON('ic-search')} alt="" width="20" height="20" />
            </div>
          )}
          <div className="chat-sidebar__list">
            <button type="button" className="chat-new-btn" onClick={onNewChat}>
              <img src={ICON('ic-pen')} alt="" width="20" height="20" />
              Hội thoại mới
            </button>
            {user &&
              history.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  className={`chat-history-item${h.id === activeId ? ' is-active' : ''}`}
                  onClick={() => onSelect(h.id)}
                  title={h.title}
                >
                  {h.title}
                </button>
              ))}
          </div>
        </div>
      </div>

      {user ? (
        <div className="chat-user-wrap">
          {menuOpen && <AccountMenu onClose={() => setMenuOpen(false)} onSignOut={onSignOut} />}
          <button
            type="button"
            className="chat-user"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <span className="chat-user__avatar">{user.initial}</span>
            <span className="chat-user__text">
              <span className="chat-user__name">{user.name}</span>
              <span className="chat-user__email">{user.email}</span>
            </span>
            <img
              className={`chat-user__chevron${menuOpen ? ' is-open' : ''}`}
              src={ICON('ic-alt-arrow-down-user')}
              alt=""
              width="20"
              height="20"
            />
          </button>
        </div>
      ) : (
        // Guests: the sign-in card sits in the account slot at the bottom of the sidebar.
        <div className="guest-card">
          <p className="guest-card__title">Lưu lại các cuộc trò chuyện</p>
          <p className="guest-card__desc">Đăng nhập để xem lại lịch sử, tải tệp và tạo ảnh với DeepEdu.</p>
          <Link to="/dang-nhap" className="ui-btn ui-btn--primary ui-btn--xs ui-btn--block">
            Đăng nhập
          </Link>
        </div>
      )}
    </aside>
  );
}

let nextId = 1;

/**
 * Shell of the assistant: sidebar (history + account menu) and page header.
 * Child routes (chat, profile, feedback) render in <Outlet /> and share the conversation state via context.
 */
export default function AssistantLayout() {
  const { personal, resetPersonal } = useSignup();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = personal.registered
    ? {
        name: personal.fullName || personal.email.split('@')[0],
        email: personal.email,
        initial: (personal.fullName || personal.email).trim()[0].toUpperCase(),
      }
    : null;

  const [collapsed, setCollapsed] = useState(false);
  // Signed-in demo users start with sample history; guests start empty. { id, title, messages: [{ role, text }] }
  const [conversations, setConversations] = useState(() => (user ? DEMO_CONVERSATIONS : []));
  const [activeId, setActiveId] = useState(null); // conversation shown in the chat area
  // Sidebar highlight. As in the Figma frames, the first chat is highlighted while the welcome screen shows.
  const [highlightId, setHighlightId] = useState(() => (user ? DEMO_CONVERSATIONS[0].id : null));

  const open = (id) => {
    setActiveId(id);
    setHighlightId(id);
    if (pathname !== '/tro-ly') navigate('/tro-ly');
  };

  const newChat = () => {
    setActiveId(null);
    setHighlightId(null);
    if (pathname !== '/tro-ly') navigate('/tro-ly');
  };

  /** Append a user message + reply to the open conversation, or start a new one. */
  const addExchange = (userMsg, botMsg) => {
    const current = conversations.find((c) => c.id === activeId);
    if (current) {
      setConversations((cs) =>
        cs.map((c) => (c.id === current.id ? { ...c, messages: [...c.messages, userMsg, botMsg] } : c)),
      );
    } else {
      const id = `new-${nextId++}`;
      setConversations((cs) => [{ id, title: userMsg.text, messages: [userMsg, botMsg] }, ...cs]);
      setActiveId(id);
      setHighlightId(id);
    }
  };

  const page = PAGES[pathname] || PAGES['/tro-ly'];

  return (
    <div className={`chat-app${collapsed ? ' is-collapsed' : ''}`}>
      {!collapsed && (
        <Sidebar
          user={user}
          history={conversations}
          activeId={pathname === '/tro-ly' ? highlightId : null}
          onNewChat={newChat}
          onSelect={open}
          onCollapse={() => setCollapsed(true)}
          onSignOut={() => {
            resetPersonal();
            navigate('/dang-nhap');
          }}
        />
      )}

      <main className="chat-main">
        <header className="chat-header">
          {collapsed && (
            <button
              type="button"
              className="chat-icon-btn chat-icon-btn--expand"
              onClick={() => setCollapsed(false)}
              aria-label="Mở thanh bên"
            >
              <img src={ICON('ic-sidebar-collapse')} alt="" width="20" height="20" />
            </button>
          )}
          <span className="chat-header__icon">
            {page.tint ? (
              <MaskIcon src={page.icon} size={24} className="chat-header__mask" />
            ) : (
              <img src={page.icon} alt="" width="24" height="24" />
            )}
          </span>
          <h1 className="chat-header__title">{page.title}</h1>
          {!user && (
            <div className="chat-header__actions">
              <Link to="/dang-nhap" className="ui-btn ui-btn--tertiary ui-btn--xs">
                Đăng nhập
              </Link>
              <Link to="/dang-ky" className="ui-btn ui-btn--primary ui-btn--xs">
                Đăng ký miễn phí
              </Link>
            </div>
          )}
        </header>

        <Outlet context={{ user, conversations, activeId, addExchange }} />
      </main>
    </div>
  );
}
