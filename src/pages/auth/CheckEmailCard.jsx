import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './auth.css';

const RESEND_SECONDS = 60;

/**
 * "Kiểm tra email của bạn" — shown after a sign-up or sign-in link is sent.
 * Resend unlocks after a countdown; `onDemoOpen` stands in for clicking the link in the email.
 */
export default function CheckEmailCard({ email, resendLabel, onChangeEmail, onDemoOpen }) {
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const waiting = seconds > 0;

  return (
    <div className="login-page">
      <div className="check-email">
        <Link to="/" className="back-link back-link--sm">
          <img src="/assets/auth/ic-arrow-left-14.svg" alt="" width="14" height="14" />
          Quay lại trang chủ DeepEdu
        </Link>

        <section className="check-email__card">
          <div className="check-email__header">
            <span className="icon-box icon-box--positive">
              <img src="/assets/auth/ic-mail-positive.svg" alt="" width="20" height="20" />
            </span>
            <h1 className="check-email__title">Kiểm tra email của bạn</h1>
          </div>

          <p className="check-email__text">
            Hệ thống đã gửi email tới địa chỉ <b>{email}</b>. Vui lòng kiểm tra email và ấn vào đường link để đăng nhập.
            Liên kết chỉ dùng một lần và sẽ hết hạn sau 15 phút.
          </p>

          <div className="check-email__actions">
            <button
              type="button"
              className="ui-btn ui-btn--primary ui-btn--icon-left ui-btn--block check-email__resend"
              disabled={waiting}
              onClick={() => setSeconds(RESEND_SECONDS)}
            >
              <img src="/assets/auth/ic-refresh-white.svg" alt="" width="24" height="24" />
              {waiting ? `${resendLabel} (${seconds}s)` : resendLabel}
            </button>
            <button type="button" className="ui-btn ui-btn--tertiary ui-btn--block" onClick={onChangeEmail}>
              Dùng email khác
            </button>
          </div>

          {/* Demo only: no email is actually sent, so let the user "open" the link here. */}
          <button type="button" className="ui-link demo-login-link check-email__demo" onClick={onDemoOpen}>
            Mở liên kết đăng nhập (demo) →
          </button>
        </section>
      </div>
    </div>
  );
}
