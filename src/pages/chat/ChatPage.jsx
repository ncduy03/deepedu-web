import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo.jsx';
import { MaskIcon } from '../../components/ui/index.jsx';
import { useSignup } from '../../state/SignupContext.jsx';
import './ChatPage.css';

const SUGGESTIONS = [
  'Giải thích định lý Pythago kèm ví dụ minh họa dễ hiểu',
  'Tóm tắt các ý chính trong tài liệu mình vừa tải lên',
  'Lập kế hoạch ôn thi Tiếng Anh trong 4 tuần',
  'Tạo 10 câu hỏi trắc nghiệm ôn tập chủ đề Quang hợp',
];

// No AI backend is connected yet — the reply says so explicitly instead of pretending to answer.
const DEMO_REPLY =
  'Đây là bản giao diện demo: DeepEdu chưa được kết nối với mô hình AI nên chưa thể trả lời câu hỏi này. ' +
  'Khi hệ thống được kết nối, câu trả lời sẽ hiển thị tại đây.';

const ICON = (name) => `/assets/chat/${name}.svg`;

/** "√x" math-editor icon, reassembled from its Figma vector pieces (both groups are flipped vertically). */
function MathEditorIcon() {
  return (
    <span className="math-icon" aria-hidden="true">
      <span className="math-icon__root">
        <img src={ICON('math-g773')} alt="" />
      </span>
      <span className="math-icon__x">
        <img src={ICON('math-g776')} alt="" />
      </span>
      <span className="math-icon__x">
        <img src={ICON('math-g780')} alt="" />
      </span>
    </span>
  );
}

function Sidebar({ user, history, activeId, onNewChat, onSelect, onCollapse }) {
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

          {!user && (
            <div className="guest-card">
              <p className="guest-card__title">Lưu lại các cuộc trò chuyện</p>
              <p className="guest-card__desc">Đăng nhập để xem lại lịch sử, tải tệp và tạo ảnh với DeepEdu.</p>
              <Link to="/dang-nhap" className="ui-btn ui-btn--primary ui-btn--xs ui-btn--block">
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>

      {user ? (
        <div className="chat-user">
          <span className="chat-user__avatar">{user.initial}</span>
          <span className="chat-user__text">
            <span className="chat-user__name">{user.name}</span>
            <span className="chat-user__email">{user.email}</span>
          </span>
          <img className="chat-user__chevron" src={ICON('ic-alt-arrow-down-user')} alt="" width="20" height="20" />
        </div>
      ) : (
        <div className="guest-footer">
          <p>Bạn là trường / tổ chức?</p>
          <Link to="/dang-nhap" className="ui-link ui-link--info ui-link--xs">
            Đăng nhập Tổ chức
          </Link>
        </div>
      )}
    </aside>
  );
}

function Composer({ value, onChange, onSend, guest, onRequireLogin, attachments, onAttach, onRemoveAttachment }) {
  const textRef = useRef(null);
  const fileRef = useRef(null);
  const imageRef = useRef(null);
  const canSend = value.trim().length > 0;

  // Grow the textarea with its content (up to the CSS max-height).
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const pick = (ref) => (guest ? onRequireLogin() : ref.current?.click());

  return (
    <div className="composer">
      <form
        className="composer__box"
        onSubmit={(e) => {
          e.preventDefault();
          if (canSend) onSend();
        }}
      >
        {attachments.length > 0 && (
          <div className="composer__files">
            {attachments.map((f, i) => (
              <span key={`${f.name}-${i}`} className="composer__file">
                {f.name}
                <button type="button" onClick={() => onRemoveAttachment(i)} aria-label={`Bỏ tệp ${f.name}`}>
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <textarea
          ref={textRef}
          className="composer__input"
          rows={1}
          placeholder="Nhập yêu cầu tại đây"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              if (canSend) onSend();
            }
          }}
        />
        <div className="composer__bar">
          <div className="composer__tools">
            <button
              type="button"
              className="composer__tool"
              onClick={() => pick(imageRef)}
              title={guest ? 'Đăng nhập để tải ảnh' : 'Tải ảnh'}
            >
              <img src={ICON('ic-gallery')} alt="" width="24" height="24" />
            </button>
            <button
              type="button"
              className="composer__tool"
              onClick={() => pick(fileRef)}
              title={guest ? 'Đăng nhập để tải tệp' : 'Đính kèm tệp'}
            >
              <img src={ICON('ic-paperclip')} alt="" width="24" height="24" />
            </button>
            <button
              type="button"
              className="composer__tool"
              title="Chèn công thức"
              onClick={() => onChange(`${value}√()`)}
            >
              <MathEditorIcon />
            </button>
            <input ref={imageRef} type="file" accept="image/*" hidden multiple onChange={onAttach} />
            <input ref={fileRef} type="file" hidden multiple onChange={onAttach} />
          </div>
          <div className="composer__actions">
            <button type="button" className="composer__menu" title="Sắp ra mắt">
              Công cụ
              <img src={ICON('ic-alt-arrow-down')} alt="" width="20" height="20" />
            </button>
            <button type="submit" className="composer__send" disabled={!canSend} aria-label="Gửi">
              <MaskIcon src={ICON('ic-arrow-up')} size={20} />
            </button>
          </div>
        </div>
      </form>
      <p className="composer__note">DeepEdu có thể mắc lỗi. Hãy kiểm tra các thông tin quan trọng.</p>
    </div>
  );
}

let nextId = 1;

export default function ChatPage() {
  const { personal } = useSignup();
  const navigate = useNavigate();
  const user = personal.registered
    ? {
        name: personal.fullName || personal.email.split('@')[0],
        email: personal.email,
        initial: (personal.fullName || personal.email).trim()[0].toUpperCase(),
      }
    : null;
  const guest = !user;

  const [collapsed, setCollapsed] = useState(false);
  const [draft, setDraft] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [conversations, setConversations] = useState([]); // { id, title, messages: [{ role, text }] }
  const [activeId, setActiveId] = useState(null);
  const scrollRef = useRef(null);

  const active = conversations.find((c) => c.id === activeId);
  const messages = active?.messages ?? [];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  const send = (text = draft) => {
    const body = text.trim();
    if (!body) return;
    const userMsg = { role: 'user', text: body, files: attachments.map((f) => f.name) };
    const botMsg = { role: 'assistant', text: DEMO_REPLY };
    if (active) {
      setConversations((cs) =>
        cs.map((c) => (c.id === active.id ? { ...c, messages: [...c.messages, userMsg, botMsg] } : c)),
      );
    } else {
      const id = nextId++;
      setConversations((cs) => [{ id, title: body, messages: [userMsg, botMsg] }, ...cs]);
      setActiveId(id);
    }
    setDraft('');
    setAttachments([]);
  };

  const newChat = () => {
    setActiveId(null);
    setDraft('');
    setAttachments([]);
  };

  return (
    <div className={`chat-app${collapsed ? ' is-collapsed' : ''}`}>
      {!collapsed && (
        <Sidebar
          user={user}
          history={conversations}
          activeId={activeId}
          onNewChat={newChat}
          onSelect={setActiveId}
          onCollapse={() => setCollapsed(true)}
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
            <img src={ICON('ic-notebook')} alt="" width="24" height="24" />
          </span>
          <h1 className="chat-header__title">Trợ lý DeepEdu</h1>
          {guest && (
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

        <div className="chat-scroll" ref={scrollRef}>
          {messages.length === 0 ? (
            <section className="chat-welcome">
              <div className="chat-welcome__hero">
                <img className="chat-orb" src="/assets/chat/assistant-orb.png" alt="" />
                <h2>Chào mừng bạn đến với DeepEdu!</h2>
                <p>
                  {guest
                    ? 'Hỏi bất cứ điều gì về học tập, nghiên cứu hay giảng dạy. Đăng nhập để lưu lịch sử trò chuyện và dùng đầy đủ công cụ.'
                    : 'Hãy chia sẻ điều bạn đang muốn học, tìm hiểu hoặc cần hỗ trợ. DeepEdu sẽ đồng hành cùng bạn để tìm ra câu trả lời phù hợp nhất.'}
                </p>
              </div>
              <div className="suggestions">
                <p className="suggestions__title">
                  <img src={ICON('ic-stars')} alt="" width="24" height="24" />
                  Câu hỏi gợi ý
                </p>
                <ul>
                  {SUGGESTIONS.map((s) => (
                    <li key={s}>
                      <button type="button" onClick={() => send(s)}>
                        <span>{s}</span>
                        <img src={ICON('ic-arrow-right')} alt="" width="20" height="20" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ) : (
            <section className="chat-thread" aria-live="polite">
              {messages.map((m, i) =>
                m.role === 'user' ? (
                  <div key={i} className="msg msg--user">
                    {m.files?.length > 0 && <p className="msg__files">📎 {m.files.join(', ')}</p>}
                    {m.text}
                  </div>
                ) : (
                  <div key={i} className="msg msg--assistant">
                    <img className="msg__avatar" src="/assets/chat/assistant-orb.png" alt="" />
                    <p>{m.text}</p>
                  </div>
                ),
              )}
            </section>
          )}
        </div>

        <Composer
          value={draft}
          onChange={setDraft}
          onSend={() => send()}
          guest={guest}
          onRequireLogin={() => navigate('/dang-nhap')}
          attachments={attachments}
          onAttach={(e) => {
            const files = Array.from(e.target.files || []);
            setAttachments((a) => [...a, ...files]);
            e.target.value = '';
          }}
          onRemoveAttachment={(i) => setAttachments((a) => a.filter((_, j) => j !== i))}
        />
      </main>
    </div>
  );
}
