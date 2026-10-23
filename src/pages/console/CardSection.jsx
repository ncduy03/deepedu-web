import { useEffect, useRef, useState } from 'react';
import { CICON } from './ConsoleLayout.jsx';

const digits = (s) => s.replace(/\D/g, '');

/** "Thông tin thẻ thanh toán" dialog. Only the holder, last 4 digits and expiry are kept (never the number or CVV). */
export function CardDialog({ card, onClose, onSave }) {
  const [holder, setHolder] = useState(card?.holder || '');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState(card?.expiry || '');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const first = useRef(null);

  useEffect(() => first.current?.focus(), []);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = (e) => {
    e.preventDefault();
    const [mm, yy] = expiry.split('/');
    if (!holder.trim()) return setError('Vui lòng nhập tên chủ thẻ.');
    if (digits(number).length < 13) return setError('Số thẻ chưa hợp lệ.');
    if (!(Number(mm) >= 1 && Number(mm) <= 12 && yy?.length === 2)) return setError('Ngày hết hạn có dạng MM/YY.');
    if (cvv.length < 3) return setError('Mã CVV gồm 3–4 chữ số.');
    onSave({ holder: holder.trim().toUpperCase(), last4: digits(number).slice(-4), expiry });
  };

  return (
    <div className="dialog-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="dialog" role="dialog" aria-modal="true" aria-labelledby="card-dialog-title" onSubmit={submit} noValidate>
        <button type="button" className="dialog__close" onClick={onClose} aria-label="Đóng">
          <img src={CICON('ic-x-close')} alt="" width="24" height="24" />
        </button>
        <h2 id="card-dialog-title" className="dialog__title">
          Thông tin thẻ thanh toán
        </h2>
        <div className="dialog__body">
          <label className="dialog-field">
            <span>Tên chủ thẻ</span>
            <input ref={first} value={holder} onChange={(e) => setHolder(e.target.value)} placeholder="Điền thông tin" autoComplete="cc-name" />
          </label>
          <label className="dialog-field">
            <span>Số thẻ</span>
            <input
              value={number}
              onChange={(e) => setNumber(digits(e.target.value).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '))}
              placeholder="0000 0000 0000 0000"
              inputMode="numeric"
              autoComplete="cc-number"
            />
          </label>
          <div className="dialog__row">
            <label className="dialog-field">
              <span>Ngày hết hạn</span>
              <input
                value={expiry}
                onChange={(e) => {
                  const d = digits(e.target.value).slice(0, 4);
                  setExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
                }}
                placeholder="MM/YY"
                inputMode="numeric"
                autoComplete="cc-exp"
              />
            </label>
            <label className="dialog-field">
              <span>Mã CVV</span>
              <input
                value={cvv}
                onChange={(e) => setCvv(digits(e.target.value).slice(0, 4))}
                placeholder="Điền thông tin"
                inputMode="numeric"
                type="password"
                autoComplete="cc-csc"
              />
            </label>
          </div>
          {error && <p className="dialog__error">{error}</p>}
        </div>
        <div className="dialog__footer">
          <button type="button" className="ui-btn ui-btn--tertiary" onClick={onClose}>
            Huỷ
          </button>
          <button type="submit" className="ui-btn ui-btn--primary">
            Lưu thông tin
          </button>
        </div>
      </form>
    </div>
  );
}

/** Linked card row (or an "add card" prompt) + the PCI DSS note, with the edit dialog. */
export function CardSection({ card, setCard, removeCard, security = true, allowAdd = true }) {
  const [editing, setEditing] = useState(false);

  return (
    <>
      {card ? (
        <div className="console-card">
          <img src={CICON('visa-card')} alt="Visa" width="64" height="64" />
          <div className="console-card__info">
            <p className="console-card__number">•••• {card.last4}</p>
            <p className="console-card__meta">
              <strong>{card.holder}</strong>
              <span>Hết hạn:</span>
              <strong>{card.expiry}</strong>
            </p>
          </div>
          <button type="button" className="ui-btn ui-btn--tertiary ui-btn--xs" onClick={() => setEditing(true)}>
            Cập nhật thông tin
          </button>
          <button type="button" className="console-trash" onClick={removeCard} aria-label="Xoá thẻ">
            <img src={CICON('ic-trash')} alt="" width="24" height="24" />
          </button>
        </div>
      ) : (
        allowAdd && (
          <button type="button" className="console-add-method" onClick={() => setEditing(true)}>
            + Thêm thẻ thanh toán
          </button>
        )
      )}

      {security && (
      <div className="console-security">
        <span className="console-security__icon">
          <img src={CICON('ic-shield-check')} alt="" width="16" height="16" />
        </span>
        <div>
          <p className="console-security__title">Bảo mật tiêu chuẩn quốc tế PCI DSS</p>
          <p className="console-security__desc">
            Chi tiết thẻ của bạn được mã hóa và xử lý một cách an toàn. Chúng tôi sử dụng phương thức mã hóa token do
            nhà cung cấp thanh toán lưu trữ; số thẻ gốc hoặc mã CVV không bao giờ được lưu trữ hoặc ghi lại trên máy
            chủ của chúng tôi.
          </p>
        </div>
      </div>
      )}

      {editing && (
        <CardDialog
          card={card}
          onClose={() => setEditing(false)}
          onSave={(c) => {
            setCard(c);
            setEditing(false);
          }}
        />
      )}
    </>
  );
}
