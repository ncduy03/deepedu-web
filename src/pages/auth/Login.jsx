import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard, Separator, TextField } from '../../components/ui/index.jsx';
import { isValidEmail, useSignup } from '../../state/SignupContext.jsx';
import './auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sentTo, setSentTo] = useState('');
  const { personal, updatePersonal } = useSignup();
  const navigate = useNavigate();

  const demoSignIn = () => {
    updatePersonal({
      email: sentTo,
      fullName: personal.email === sentTo ? personal.fullName : '',
      registered: true,
    });
    navigate('/tro-ly');
  };

  const submit = (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    setError('');
    setSentTo(email.trim());
  };

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
          <TextField
            label="Email"
            type="email"
            placeholder="name@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            autoComplete="email"
          />
          {sentTo && (
            <div className="form-success">
              <p>
                Đã gửi liên kết đăng nhập đến <b>{sentTo}</b>. Hãy kiểm tra hộp thư của bạn.
              </p>
              {/* Demo only: no email is actually sent, so let the user "open" the link here. */}
              <button type="button" className="ui-link demo-login-link" onClick={demoSignIn}>
                Mở liên kết đăng nhập (demo) →
              </button>
            </div>
          )}
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
