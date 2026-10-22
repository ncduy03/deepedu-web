import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard, MiniStepper, Separator, TextField } from '../../../components/ui/index.jsx';
import { isValidEmail, useSignup } from '../../../state/SignupContext.jsx';
import { PERSONAL_STEPS } from './steps.js';
import '../auth.css';

export default function PersonalAccount() {
  const { personal, updatePersonal } = useSignup();
  const [email, setEmail] = useState(personal.email);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    updatePersonal({ email: email.trim() });
    navigate('/dang-ky/ca-nhan/xac-minh');
  };

  return (
    <div className="step-page">
      <Link to="/dang-ky" className="back-link" style={{ width: 520 }}>
        <img src="/assets/auth/ic-arrow-left.svg" alt="" width="16" height="16" />
        Quay lại
      </Link>

      <AuthCard as="form" onSubmit={submit} noValidate>
        <MiniStepper steps={PERSONAL_STEPS} current={1} />
        <div className="heading">
          <h1 className="ui-h1">Tạo tài khoản cá nhân</h1>
          <p className="ui-body-sm text-medium">
            Miễn phí, chỉ mất chưa đến 1 phút. Dành cho học sinh, sinh viên, giáo viên và người học tự do.
          </p>
        </div>

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
          <button type="submit" className="ui-btn ui-btn--primary ui-btn--icon-right ui-btn--block">
            Tiếp tục
            <img src="/assets/auth/ic-arrow-right-white.svg" alt="" width="24" height="24" />
          </button>
        </div>

        <p className="ui-caption text-light">Tiếp tục nghĩa là bạn đồng ý với Điều khoản &amp; Chính sách Bảo mật.</p>
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
