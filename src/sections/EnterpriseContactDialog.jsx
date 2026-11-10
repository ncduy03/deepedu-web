import { useEffect, useId, useState } from 'react';
import { TextField } from '../components/ui/index.jsx';
import { isValidEmail } from '../state/SignupContext.jsx';

const FIELDS = [
  { key: 'name', label: 'Họ và tên', placeholder: 'Nhập họ và tên', autoComplete: 'name' },
  { key: 'email', label: 'Email công việc', placeholder: 'Nhập email công việc', type: 'email', autoComplete: 'email' },
  { key: 'phone', label: 'Số điện thoại liên hệ', placeholder: 'Nhập số điện thoại', type: 'tel', autoComplete: 'tel' },
  {
    key: 'org',
    label: 'Trường / Tổ chức / Doanh nghiệp',
    placeholder: 'Nhập tên trường, tổ chức hoặc doanh nghiệp',
    autoComplete: 'organization',
  },
];

const EMPTY = { name: '', email: '', phone: '', org: '' };

function validate(v) {
  const errors = {};
  if (!v.name.trim()) errors.name = 'Vui lòng nhập họ và tên.';
  if (!isValidEmail(v.email)) errors.email = 'Vui lòng nhập email hợp lệ.';
  if (!/^\+?[0-9 .-]{9,15}$/.test(v.phone.trim())) errors.phone = 'Vui lòng nhập số điện thoại hợp lệ.';
  if (!v.org.trim()) errors.org = 'Vui lòng nhập tên trường, tổ chức hoặc doanh nghiệp.';
  return errors;
}

/** "Liên hệ tư vấn Enterprise" popup. No backend yet: submitting shows a thank-you message. */
export default function EnterpriseContactDialog({ onClose }) {
  const titleId = useId();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  const submit = (e) => {
    e.preventDefault();
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  };

  const change = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  return (
    <div className="lp-dialog-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="lp-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} onSubmit={submit} noValidate>
        <div className="lp-dialog__header">
          <div className="lp-dialog__top">
            <h2 id={titleId}>{sent ? 'Đã gửi yêu cầu tư vấn' : 'Liên hệ tư vấn Enterprise'}</h2>
            <button type="button" className="lp-dialog__close" onClick={onClose} aria-label="Đóng">
              <img src="/assets/landing-pricing/ic-close.svg" alt="" width="20" height="20" />
            </button>
          </div>
          <p>
            {sent
              ? `Cảm ơn ${values.name.trim()}! Chuyên viên DeepEdu sẽ liên hệ với bạn qua ${values.email.trim()} hoặc ${values.phone.trim()} trong 15 phút.`
              : 'Để lại thông tin để chuyên viên DeepEdu tư vấn giải pháp phù hợp. Chúng tôi sẽ liên hệ trong 15 phút để hỗ trợ bạn chọn phương án tốt nhất.'}
          </p>
        </div>

        {!sent && (
          <div className="lp-dialog__form">
            {FIELDS.map((f, i) => (
              <TextField
                key={f.key}
                label={f.label}
                placeholder={f.placeholder}
                type={f.type || 'text'}
                autoComplete={f.autoComplete}
                value={values[f.key]}
                onChange={change(f.key)}
                error={errors[f.key]}
                autoFocus={i === 0}
              />
            ))}
          </div>
        )}

        <div className="lp-dialog__footer">
          {sent ? (
            <button type="button" className="ui-btn ui-btn--primary" onClick={onClose} autoFocus>
              Đóng
            </button>
          ) : (
            <button type="submit" className="ui-btn ui-btn--primary ui-btn--icon-left">
              <img src="/assets/landing-pricing/ic-send.svg" alt="" width="24" height="24" />
              Gửi yêu cầu tư vấn
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
