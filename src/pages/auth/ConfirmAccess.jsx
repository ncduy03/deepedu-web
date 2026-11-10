import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSignup } from '../../state/SignupContext.jsx';
import { DEMO_ORG, normalizeAccountType } from '../../state/accountType.js';
import './auth.css';

/**
 * "Xác nhận truy cập DeepEdu" — opened from the email link (demo: "Mở liên kết đăng nhập").
 * Router state carries the email, the role picked at login and an optional `next` page;
 * "Tiếp tục" signs in and opens `next` (default: the assistant).
 */
export default function ConfirmAccess() {
  const { state } = useLocation();
  const email = state?.email;
  const accountType = normalizeAccountType(state?.role);
  const { personal, updatePersonal, resetPersonal } = useSignup();
  const navigate = useNavigate();

  if (!email) return <Navigate to="/dang-nhap" replace />;

  // Organization role: also show which organization is being entered.
  const org = accountType === 'org';

  const signIn = () => {
    // Same email as the account already in this browser: keep its profile; otherwise start a fresh one.
    if (personal.email === email) updatePersonal({ accountType, registered: true });
    else {
      resetPersonal();
      updatePersonal({ email, accountType, registered: true });
    }
    navigate(state?.next || '/tro-ly', { replace: true });
  };

  return (
    <div className="login-page">
      <section className="confirm-access">
        <div className="confirm-access__heading">
          <h1 className="ui-h1">Xác nhận truy cập DeepEdu</h1>
          <p className="ui-body text-medium">Bạn đang thực hiện truy cập hệ thống DeepEdu với thông tin:</p>
        </div>

        <dl className="confirm-access__info">
          {org && (
            <div className="confirm-access__row">
              <dt>Tổ chức:</dt>
              <dd className="confirm-access__org">{DEMO_ORG.name}</dd>
            </div>
          )}
          <div className="confirm-access__row">
            <dt>Email:</dt>
            <dd>{email}</dd>
          </div>
        </dl>

        <div className="confirm-access__footer">
          <p className="ui-body-sm text-medium">Vui lòng nhấn Tiếp tục để hoàn tất đăng nhập vào Client Portal.</p>
          <button type="button" className="ui-btn ui-btn--primary ui-btn--icon-right" onClick={signIn} autoFocus>
            Tiếp tục
            <img src="/assets/auth/ic-arrow-right-white.svg" alt="" width="24" height="24" />
          </button>
        </div>
      </section>
    </div>
  );
}
