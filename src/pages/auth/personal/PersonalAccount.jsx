import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard, Separator, TextField } from '../../../components/ui/index.jsx';
import { isValidEmail, useSignup } from '../../../state/SignupContext.jsx';
import '../auth.css';

/** "Đăng ký Client Portal" — sign-up by email link (no OTP). Next: "Kiểm tra email của bạn". */
export default function PersonalAccount() {
  const { personal, updatePersonal, resetPersonal } = useSignup();
  const [email, setEmail] = useState(personal.email);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    // A different email starts a fresh demo account instead of reusing the old profile.
    if (email.trim() !== personal.email) resetPersonal();
    updatePersonal({ email: email.trim() });
    navigate('/dang-ky/ca-nhan/xac-minh');
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
        <h1 className="ui-h1">Đăng ký Client Portal</h1>

        <div className="stack-16">
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
            Gửi liên kết đăng ký
          </button>
        </div>

        <Separator />
        <div className="caption-note">
          <p>Chúng tôi sẽ gửi một liên kết kích hoạt tài khoản đến email của bạn.</p>
          <p>Liên kết không phải mật khẩu và sẽ hết hạn sau một khoảng thời gian ngắn.</p>
        </div>
        <Separator />

        <div className="row-between">
          <span className="ui-body-sm text-medium">Đã có tài khoản?</span>
          <Link to="/dang-nhap" className="ui-link">
            Đăng nhập
          </Link>
        </div>
      </AuthCard>
    </div>
  );
}
