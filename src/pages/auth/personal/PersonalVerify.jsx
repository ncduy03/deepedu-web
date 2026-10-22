import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthCard, MiniStepper, OtpInput, Separator } from '../../../components/ui/index.jsx';
import { useSignup } from '../../../state/SignupContext.jsx';
import { PERSONAL_STEPS } from './steps.js';
import '../auth.css';

const RESEND_SECONDS = 45;

const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export default function PersonalVerify() {
  const { personal } = useSignup();
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const navigate = useNavigate();

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  if (!personal.email) return <Navigate to="/dang-ky/ca-nhan" replace />;

  const submit = (e) => {
    e.preventDefault();
    if (code.length === 6) navigate('/dang-ky/ca-nhan/ho-so');
  };

  return (
    <div className="step-page">
      <Link to="/dang-ky/ca-nhan" className="back-link" style={{ width: 520 }}>
        <img src="/assets/auth/ic-arrow-left.svg" alt="" width="16" height="16" />
        Quay lại
      </Link>

      <AuthCard as="form" onSubmit={submit}>
        <MiniStepper steps={PERSONAL_STEPS} current={2} />
        <div className="heading">
          <h1 className="ui-h1">Xác minh email của bạn</h1>
          <div className="verify-subtitle">
            <p className="ui-body-sm text-medium">Chúng tôi đã gửi mã xác minh gồm 6 số đến</p>
            <p className="verify-subtitle__email">
              <b>{personal.email}</b>
              <Link to="/dang-ky/ca-nhan" className="ui-link ui-link--info">
                Đổi email
              </Link>
            </p>
          </div>
        </div>

        <OtpInput value={code} onChange={setCode} />

        <button type="submit" className="ui-btn ui-btn--primary ui-btn--block" disabled={code.length < 6}>
          Xác minh
        </button>

        <p className="resend">
          <span className="text-medium">Không nhận được mã?</span>
          {seconds > 0 ? (
            <span className="resend__timer">Gửi lại sau {formatTime(seconds)}</span>
          ) : (
            <button type="button" className="ui-link" onClick={() => setSeconds(RESEND_SECONDS)}>
              Gửi lại mã
            </button>
          )}
        </p>

        <Separator />
        <div className="tip">
          <img src="/assets/auth/ic-info.svg" alt="" width="16" height="16" />
          <div className="caption-note">
            <p>Mã có hiệu lực trong 10 phút.</p>
            <p>Nếu không thấy email, hãy kiểm tra thư mục Spam hoặc Quảng cáo.</p>
          </div>
        </div>
      </AuthCard>
    </div>
  );
}
