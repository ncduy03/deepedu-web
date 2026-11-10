import { useState } from 'react';
import { Navigate, useNavigate, useOutletContext } from 'react-router-dom';
import { TextField } from '../../components/ui/index.jsx';
import { useSignup } from '../../state/SignupContext.jsx';
import { ProfileHeader } from './ProfilePage.jsx';
import './AccountPages.css';

/** "Hồ sơ tài khoản – Chỉnh sửa": only the name is editable. Saves into the demo account (localStorage). */
export default function ProfileEditPage() {
  const { user } = useOutletContext();
  const { personal, updatePersonal } = useSignup();
  const navigate = useNavigate();
  const currentName = user?.name || '';
  const [fullName, setFullName] = useState(currentName);

  if (!user) return <Navigate to="/dang-nhap" replace />;

  const name = fullName.trim();
  const canSave = name.length > 0 && name !== currentName;

  const save = (e) => {
    e.preventDefault();
    if (!canSave) return;
    updatePersonal({ fullName: name });
    navigate('/tro-ly/ho-so');
  };

  return (
    <div className="acc-scroll">
      <form className="acc-content acc-content--profile" onSubmit={save} noValidate>
        <ProfileHeader user={user} />
        <hr className="acc-separator" />

        <section className="acc-card acc-card--form">
          <h3>Thông tin cá nhân</h3>
          <TextField
            label="Họ và tên"
            placeholder="VD: Nguyễn Văn Minh"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
          />
          <TextField label="Địa chỉ email" className="acc-disabled" value={personal.email} disabled />
        </section>

        <div className="acc-actions">
          <button type="button" className="ui-btn ui-btn--tertiary" onClick={() => navigate('/tro-ly/ho-so')}>
            Hủy
          </button>
          <button type="submit" className="ui-btn ui-btn--primary" disabled={!canSave}>
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
}
