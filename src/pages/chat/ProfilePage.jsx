import { Link, Navigate, useOutletContext } from 'react-router-dom';
import { useSignup } from '../../state/SignupContext.jsx';
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

/** Avatar + name + email, shared by the profile and edit pages. */
export function ProfileHeader({ user, action }) {
  return (
    <div className="acc-header">
      <span className="acc-avatar">{user.initial}</span>
      <div className="acc-header__name">
        <h2>{user.name}</h2>
        <p className="acc-header__email">{user.email}</p>
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

  return (
    <div className="acc-scroll">
      <div className="acc-content acc-content--profile">
        <ProfileHeader
          user={user}
          action={
            <Link to="/tro-ly/ho-so/chinh-sua" className="ui-btn ui-btn--primary ui-btn--sm">
              <img src={ICON('ic-pencil-white')} alt="" width="20" height="20" />
              Chỉnh sửa
            </Link>
          }
        />
        <hr className="acc-separator" />

        <section className="acc-card">
          <h3>Thông tin cá nhân</h3>
          <Field label="Họ và tên" value={personal.fullName || user.name} />
          <Field label="Địa chỉ email" value={personal.email || user.email} />
        </section>
      </div>
    </div>
  );
}
