import { useEffect, useId, useRef, useState } from 'react';
import { PICON } from './projectsData.js';

/** Overlay + 480px card shared by every "Quản lý dự án" popup. Escape or a click outside closes it. */
function DialogShell({ onClose, className = '', labelledBy, children, as: Tag = 'div', ...rest }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="dialog-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <Tag className={`pj-dialog ${className}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy} {...rest}>
        {children}
      </Tag>
    </div>
  );
}

function DialogHeader({ id, title, subtitle, onClose }) {
  return (
    <div className="pj-dialog__header">
      <div className="pj-dialog__titles">
        <h2 id={id} className="pj-dialog__title">
          {title}
        </h2>
        {subtitle && <p className="pj-dialog__subtitle">{subtitle}</p>}
      </div>
      <button type="button" className="pj-dialog__close" onClick={onClose} aria-label="Đóng">
        <img src={PICON('ic-close-20')} alt="" width="20" height="20" />
      </button>
    </div>
  );
}

/**
 * Popup with one text field: Khởi tạo dự án, Sửa tên dự án, Tạo API Key mới, Đổi tên API Key.
 * The confirm button stays disabled until the value is non-empty and changed; `validate` may return an error text.
 */
export function FormDialog({
  title,
  subtitle,
  label,
  redMark = false,
  placeholder,
  initial = '',
  confirmLabel,
  cancelLabel = 'Hủy bỏ',
  divider = false,
  validate,
  onClose,
  onSubmit,
}) {
  const titleId = useId();
  const inputId = useId();
  const [value, setValue] = useState(initial);
  const [error, setError] = useState('');
  const input = useRef(null);
  const name = value.trim();
  const canSubmit = name.length > 0 && name !== initial.trim();

  useEffect(() => {
    input.current?.focus();
    input.current?.select();
  }, []);

  return (
    <DialogShell
      as="form"
      className="pj-dialog--form"
      labelledBy={titleId}
      onClose={onClose}
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        const problem = validate?.(name);
        if (problem) setError(problem);
        else onSubmit(name);
      }}
      noValidate
    >
      <DialogHeader id={titleId} title={title} subtitle={subtitle} onClose={onClose} />
      <div className="pj-field">
        <label className="pj-field__label" htmlFor={inputId}>
          {label} {redMark ? <span className="pj-field__required">*</span> : '*'}
        </label>
        <input
          ref={input}
          id={inputId}
          className={`pj-field__input${value ? ' is-filled' : ''}`}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError('');
          }}
          aria-invalid={error ? true : undefined}
          placeholder={placeholder}
          maxLength={120}
        />
        {error && <p className="pj-field__error">{error}</p>}
      </div>
      {divider && <hr className="pj-dialog__divider" />}
      <div className="pj-dialog__footer">
        <button type="button" className="ui-btn ui-btn--tertiary" onClick={onClose}>
          {cancelLabel}
        </button>
        <button type="submit" className="ui-btn ui-btn--primary" disabled={!canSubmit}>
          {confirmLabel}
        </button>
      </div>
    </DialogShell>
  );
}

/** Confirmation popup. Tone: primary (kích hoạt), warning (tạm dừng / vô hiệu hóa), danger (xóa). */
export function ConfirmDialog({
  title,
  subtitle,
  tone = 'primary',
  confirmLabel,
  cancelLabel = 'Hủy bỏ',
  alert,
  children,
  onClose,
  onConfirm,
}) {
  const titleId = useId();
  const confirm = useRef(null);
  useEffect(() => confirm.current?.focus(), []);

  return (
    <DialogShell className="pj-dialog--confirm" labelledBy={titleId} onClose={onClose}>
      <DialogHeader id={titleId} title={title} subtitle={subtitle} onClose={onClose} />
      <div className="pj-dialog__text">{children}</div>
      {alert && (
        <div className="pj-alert" role="note">
          <img src={PICON('ic-alert-triangle')} alt="" width="18" height="18" />
          <p>{alert}</p>
        </div>
      )}
      <div className="pj-dialog__footer">
        <button type="button" className="ui-btn ui-btn--tertiary" onClick={onClose}>
          {cancelLabel}
        </button>
        <button ref={confirm} type="button" className={`ui-btn pj-btn--${tone}`} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </DialogShell>
  );
}

const ORG_BENEFITS = [
  'Mời thêm thành viên vào dự án, không giới hạn',
  'Phân quyền Quản trị viên / Thành viên theo từng dự án',
  'Quản lý credit, ngân sách và API Key tập trung',
  'Đăng nhập SSO (SAML 2.0 & Google Workspace)',
];

/** Shown when a personal account tries an organization-only feature (Thêm thành viên). */
export function UpgradeDialog({ onClose, onUpgrade }) {
  const titleId = useId();
  return (
    <DialogShell className="pj-dialog--upgrade" labelledBy={titleId} onClose={onClose}>
      <div className="pj-upgrade__top">
        <span className="pj-upgrade__icon">
          <img src={PICON('ic-users-24')} alt="" width="24" height="24" />
        </span>
        <button type="button" className="pj-dialog__close" onClick={onClose} aria-label="Đóng">
          <img src={PICON('ic-close-20')} alt="" width="20" height="20" />
        </button>
      </div>
      <div className="pj-upgrade__heading">
        <h2 id={titleId}>Mời thành viên cùng làm việc?</h2>
        <p>
          Tài khoản Cá nhân chỉ có 1 thành viên là bạn. Nâng cấp lên gói Tổ chức để mời đồng nghiệp, học viên cùng sử
          dụng dự án.
        </p>
      </div>
      <div className="pj-upgrade__benefits">
        <p className="pj-upgrade__benefits-title">GÓI TỔ CHỨC BAO GỒM</p>
        <ul>
          {ORG_BENEFITS.map((b) => (
            <li key={b}>
              <img src={PICON('ic-check-green-16')} alt="" width="16" height="16" />
              {b}
            </li>
          ))}
        </ul>
      </div>
      <p className="pj-upgrade__price">
        Gói Team chỉ từ <strong>99.000đ / tháng</strong> · 500 credit
      </p>
      <div className="pj-upgrade__footer">
        <a className="pj-upgrade__contact" href="mailto:contact@deepedu.vn">
          Liên hệ tư vấn
        </a>
        <div className="pj-dialog__footer">
          <button type="button" className="ui-btn ui-btn--tertiary" onClick={onClose}>
            Để sau
          </button>
          <button type="button" className="ui-btn ui-btn--primary" onClick={onUpgrade}>
            Xem gói Tổ chức
          </button>
        </div>
      </div>
    </DialogShell>
  );
}

/** Shows a new API key value once, right after it is created or regenerated. */
export function KeyRevealDialog({ keyName, secret, onClose }) {
  const titleId = useId();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <DialogShell className="pj-dialog--confirm" labelledBy={titleId} onClose={onClose}>
      <DialogHeader id={titleId} title="API Key của bạn" subtitle={keyName} onClose={onClose} />
      <div className="pj-secret">
        <code>{secret}</code>
        <button
          type="button"
          className="pj-secret__copy"
          onClick={() => navigator.clipboard?.writeText(secret).then(() => setCopied(true), () => {})}
        >
          <img src={`/assets/console/${copied ? 'ic-check-circle' : 'ic-copy'}.svg`} alt="" width="16" height="16" />
          {copied ? 'Đã sao chép' : 'Sao chép'}
        </button>
      </div>
      <div className="pj-alert" role="note">
        <img src={PICON('ic-alert-triangle')} alt="" width="18" height="18" />
        <p>
          Hãy lưu API Key ở nơi an toàn. Giá trị này chỉ được hiển thị <strong>một lần duy nhất</strong>.
        </p>
      </div>
      <div className="pj-dialog__footer">
        <button type="button" className="ui-btn ui-btn--primary" onClick={onClose}>
          Tôi đã lưu Key
        </button>
      </div>
    </DialogShell>
  );
}
