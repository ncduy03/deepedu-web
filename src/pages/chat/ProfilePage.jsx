import { Link, Navigate, useOutletContext } from 'react-router-dom';
import { useSignup } from '../../state/SignupContext.jsx';
import { roleLabel } from '../../state/profileOptions.js';
import { ICON } from './AssistantLayout.jsx';
import './AccountPages.css';

function Field({ label, value }) {
  return (
    <div className="acc-field">
      <p className="acc-field__label">{label}</p>
      <p className={`acc-field__value${value ? '' : ' is-empty'}`}>{value || 'Chưa cập nhật'}</p>
    </div>
  );
}

export function ProfileHeader({ user, role, action }) {
  return (
    <div className="acc-header">
      <span className="acc-avatar">{user.initial}</span>
      <div className="acc-header__name">
        <h2>{user.name}</h2>
        <div className="acc-header__tags">
          {role && <span className="acc-header__role">{role}</span>}
          <span className="acc-badge">Cá nhân · Free</span>
        </div>
      </div>
      {action}
    </div>
  );
}

/** "Hồ sơ tài khoản" — read-only profile of the signed-in (demo) account. */
export default function ProfilePage() {
  const { user } = useOutletContext();
  const { personal } = useSignup();
  if (!user) return <Navigate to="/dang-nhap" replace />;

  const role = roleLabel(personal.role);

  return (
    <div className="acc-scroll">
      <div className="acc-content">
        <ProfileHeader
          user={user}
          role={role}
          action={
            <Link to="/tro-ly/ho-so/chinh-sua" className="ui-btn ui-btn--primary ui-btn--sm">
              <img src={ICON('ic-pencil-white')} alt="" width="20" height="20" />
              Chỉnh sửa
            </Link>
          }
        />
        <hr className="acc-separator" />

        <div className="acc-cards">
          <section className="acc-card">
            <h3>Thông tin cá nhân</h3>
            <Field label="Họ và tên" value={personal.fullName} />
            <Field label="Địa chỉ email" value={personal.email} />
            <Field label="Năm sinh" value={personal.birthYear} />
          </section>
          <section className="acc-card">
            <h3>Học tập &amp; công việc</h3>
            <Field label="Vai trò" value={role} />
            <Field label="Trường / Đơn vị" value={personal.school} />
            <Field label="Lĩnh vực quan tâm" value={personal.interests?.join(', ')} />
          </section>
        </div>

        <section className="acc-card acc-card--wide">
          <h3>Tài khoản &amp; đăng nhập</h3>
          <div className="acc-card__row">
            <div className="acc-field">
              <p className="acc-field__label">Loại tài khoản</p>
              <p className="acc-field__value acc-field__value--inline">
                Cá nhân · Gói Free
                <button type="button" className="ui-link ui-link--info" title="Sắp ra mắt">
                  Nâng cấp gói
                </button>
              </p>
            </div>
            <Field label="Phương thức đăng nhập" value="Email · mã xác minh một lần" />
          </div>
          <p className="acc-note">
            DeepEdu không dùng mật khẩu. Mỗi lần đăng nhập, chúng tôi sẽ gửi mã xác minh đến email của bạn.
          </p>
        </section>
      </div>
    </div>
  );
}
