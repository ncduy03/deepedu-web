import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthCard, MaskIcon, Separator, TextField } from '../../components/ui/index.jsx';
import { isValidEmail } from '../../state/SignupContext.jsx';
import { ACCOUNT_ROLES, normalizeAccountType } from '../../state/accountType.js';
import CheckEmailCard from './CheckEmailCard.jsx';
import './auth.css';

/**
 * "Đăng nhập Client Portal" — email link sign-in. The visitor picks a role (Cá nhân / Tổ chức) first.
 * Router state may carry `role` (pre-selected role) and `next` (page to open after sign-in, e.g. from the pricing CTA).
 * After sending, shows "Kiểm tra email của bạn".
 */
export default function Login() {
  const { state } = useLocation();
  const next = state?.next;
  const [role, setRole] = useState(() => normalizeAccountType(state?.role));
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sentTo, setSentTo] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    setError('');
    setSentTo(email.trim());
  };

  if (sentTo) {
    return (
      <CheckEmailCard
        email={sentTo}
        resendLabel="Gửi lại liên kết"
        onChangeEmail={() => setSentTo('')}
        onDemoOpen={() => navigate('/xac-nhan-dang-nhap', { state: { email: sentTo, role, next } })}
      />
    );
  }

  return (
    <div className="login-page">
      <Link to="/" className="back-link" style={{ width: 520 }}>
        <img src="/assets/auth/ic-arrow-left.svg" alt="" width="16" height="16" />
        Quay lại trang chủ DeepEdu
      </Link>

      <AuthCard as="form" onSubmit={submit} noValidate>
        <span className="icon-box icon-box--lg">
          <img src="/assets/auth/ic-mail.svg" alt="" width="22" height="22" />
        </span>
        <h1 className="ui-h1">Đăng nhập Client Portal</h1>

        <div className="stack-16">
          <div className="role-picker">
            <span className="ui-field__label" id="login-role-label">
              Đăng nhập với vai trò
            </span>
            <div className="role-picker__options" role="radiogroup" aria-labelledby="login-role-label">
              {ACCOUNT_ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  role="radio"
                  aria-checked={role === r.id}
                  className={`role-picker__option${role === r.id ? ' is-active' : ''}`}
                  onClick={() => setRole(r.id)}
                >
                  <MaskIcon src={r.icon} size={18} />
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <TextField
            label="Email"
            type="email"
            placeholder="name@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            autoComplete="email"
            autoFocus
          />
          <button type="submit" className="ui-btn ui-btn--primary ui-btn--block">
            Gửi liên kết đăng nhập
          </button>
        </div>

        <Separator />
        <div className="caption-note">
          <p>Chúng tôi sẽ gửi một liên kết đăng nhập một lần đến email của bạn.</p>
          <p>Liên kết không phải mật khẩu và sẽ hết hạn sau một khoảng thời gian ngắn.</p>
        </div>
        <Separator />

        <div className="row-between">
          <span className="ui-body-sm text-medium">Chưa có tài khoản?</span>
          <Link to="/dang-ky" className="ui-link">
            Đăng ký ngay
          </Link>
        </div>
      </AuthCard>
    </div>
  );
}
