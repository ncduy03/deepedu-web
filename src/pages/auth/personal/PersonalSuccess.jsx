import { Link, Navigate } from 'react-router-dom';
import { AuthCard } from '../../../components/ui/index.jsx';
import { useSignup } from '../../../state/SignupContext.jsx';
import '../auth.css';

const FREE_FEATURES = [
  'Truy cập các mô hình AI cơ bản',
  'Hạn mức sử dụng làm mới mỗi ngày',
  'Lưu lịch sử trò chuyện trên mọi thiết bị',
];

export default function PersonalSuccess() {
  const { personal } = useSignup();
  if (!personal.email) return <Navigate to="/dang-ky/ca-nhan" replace />;

  // "Chào mừng Minh" — Vietnamese given name is the last word of the full name.
  const firstName = personal.fullName.trim().split(/\s+/).pop();

  return (
    <div className="step-page step-page--wide">
      <AuthCard width={600} className="success-card">
        <span className="success-icon">
          <img src="/assets/auth/ic-checkmark-success.svg" alt="" width="28" height="28" />
        </span>
        <div className="heading heading--center">
          <h1 className="ui-h1">Tạo tài khoản thành công!</h1>
          <p className="ui-body-sm text-medium">
            Chào mừng {firstName || 'bạn'} đến với DeepEdu. Tài khoản cá nhân của bạn đã sẵn sàng sử dụng ngay.
          </p>
        </div>

        <dl className="summary">
          <div className="summary__row">
            <dt>Email đăng nhập</dt>
            <dd>{personal.email}</dd>
          </div>
          <div className="summary__row">
            <dt>Loại tài khoản</dt>
            <dd>Cá nhân</dd>
          </div>
          <div className="summary__row">
            <dt>Gói hiện tại</dt>
            <dd>Free</dd>
          </div>
        </dl>

        <div className="plan-box">
          <p className="plan-box__title">
            <img src="/assets/auth/ic-sparkles-16.svg" alt="" width="16" height="16" />
            GÓI FREE BAO GỒM
          </p>
          {FREE_FEATURES.map((f) => (
            <p key={f} className="plan-box__item">
              <img src="/assets/auth/ic-check-circle.svg" alt="" width="18" height="18" />
              {f}
            </p>
          ))}
        </div>

        <div className="stack-12">
          <Link to="/tro-ly" className="ui-btn ui-btn--primary ui-btn--icon-right ui-btn--block">
            Bắt đầu trò chuyện
            <img src="/assets/auth/ic-arrow-right-white.svg" alt="" width="24" height="24" />
          </Link>
          <Link to="/" className="ui-btn ui-btn--tertiary ui-btn--icon-left ui-btn--block">
            <img src="/assets/auth/ic-sparkles-24.svg" alt="" width="24" height="24" />
            Xem các gói nâng cấp
          </Link>
        </div>
      </AuthCard>
    </div>
  );
}
