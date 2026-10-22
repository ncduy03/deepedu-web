import { useState } from 'react';
import { Navigate, useNavigate, useOutletContext } from 'react-router-dom';
import { TextField } from '../../components/ui/index.jsx';
import { useSignup } from '../../state/SignupContext.jsx';
import { INTEREST_GROUPS, ROLES, roleLabel } from '../../state/profileOptions.js';
import { ProfileHeader } from './ProfilePage.jsx';
import './AccountPages.css';

const THIS_YEAR = new Date().getFullYear();

function Chip({ selected, onClick, children }) {
  return (
    <button type="button" className={`acc-chip${selected ? ' is-selected' : ''}`} aria-pressed={selected} onClick={onClick}>
      {children}
    </button>
  );
}

/** "Hồ sơ tài khoản – Chỉnh sửa". Saves into the demo account (localStorage). */
export default function ProfileEditPage() {
  const { user } = useOutletContext();
  const { personal, updatePersonal } = useSignup();
  const navigate = useNavigate();
  const initial = {
    fullName: personal.fullName,
    birthYear: personal.birthYear,
    role: personal.role,
    school: personal.school,
    interests: personal.interests || [],
  };
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');

  if (!user) return <Navigate to="/dang-nhap" replace />;

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const toggleInterest = (name) =>
    set({ interests: form.interests.includes(name) ? form.interests.filter((i) => i !== name) : [...form.interests, name] });

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  const save = (e) => {
    e.preventDefault();
    const y = Number(form.birthYear);
    if (form.birthYear && (!Number.isInteger(y) || y < 1900 || y > THIS_YEAR)) {
      setError('Năm sinh không hợp lệ.');
      return;
    }
    updatePersonal({ ...form, fullName: form.fullName.trim(), school: form.school.trim() });
    navigate('/tro-ly/ho-so');
  };

  return (
    <div className="acc-scroll">
      <form className="acc-content acc-content--edit" onSubmit={save} noValidate>
        <ProfileHeader user={user} role={roleLabel(form.role)} />
        <hr className="acc-separator acc-separator--tight" />

        <section className="acc-card acc-card--form">
          <h3>Thông tin cá nhân</h3>
          <TextField
            label="Họ và tên"
            placeholder="VD: Nguyễn Văn Minh"
            value={form.fullName}
            onChange={(e) => set({ fullName: e.target.value })}
            autoComplete="name"
          />
          <TextField
            label="Địa chỉ email"
            className="acc-readonly"
            value={personal.email}
            readOnly
            helper="Email dùng để đăng nhập nên không thể thay đổi."
          />
          <TextField
            label="Năm sinh"
            className="acc-year"
            placeholder="VD: 2004"
            inputMode="numeric"
            maxLength={4}
            value={form.birthYear}
            onChange={(e) => {
              setError('');
              set({ birthYear: e.target.value.replace(/\D/g, '') });
            }}
            error={error}
          />
        </section>

        <section className="acc-card acc-card--form">
          <h3>Học tập &amp; công việc</h3>
          <div className="acc-group">
            <p className="ui-field__label">Vai trò</p>
            <div className="acc-chips">
              {ROLES.map((r) => (
                <Chip key={r.id} selected={form.role === r.id} onClick={() => set({ role: r.id })}>
                  {r.label}
                </Chip>
              ))}
            </div>
          </div>
          <TextField
            label="Trường / Đơn vị"
            placeholder="VD: Đại học Bách khoa Hà Nội"
            value={form.school}
            onChange={(e) => set({ school: e.target.value })}
          />
          <div className="acc-group">
            <p className="ui-field__label">
              Lĩnh vực quan tâm <span className="acc-hint">(chọn nhiều)</span>
            </p>
            {INTEREST_GROUPS.map((g) => (
              <div key={g.title} className="acc-interest-group">
                <p className="acc-interest-group__title">{g.title}</p>
                <div className="acc-chips">
                  {g.items.map((name) => (
                    <Chip key={name} selected={form.interests.includes(name)} onClick={() => toggleInterest(name)}>
                      {name}
                    </Chip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="acc-actions">
          <button type="button" className="ui-btn ui-btn--tertiary" onClick={() => navigate('/tro-ly/ho-so')}>
            Hủy
          </button>
          <button type="submit" className="ui-btn ui-btn--primary" disabled={!dirty}>
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
}
