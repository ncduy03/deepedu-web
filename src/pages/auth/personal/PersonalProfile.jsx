import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthCard, Checkbox, MaskIcon, MiniStepper, Separator, TextField } from '../../../components/ui/index.jsx';
import { useSignup } from '../../../state/SignupContext.jsx';
import { PERSONAL_STEPS } from './steps.js';
import { ROLES } from '../../../state/profileOptions.js';
import '../auth.css';

const THIS_YEAR = new Date().getFullYear();

export default function PersonalProfile() {
  const { personal, updatePersonal } = useSignup();
  const [form, setForm] = useState(personal);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  if (!personal.email) return <Navigate to="/dang-ky/ca-nhan" replace />;

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Vui lòng nhập họ và tên.';
    if (!form.role) e.role = 'Vui lòng chọn vai trò của bạn.';
    const y = Number(form.birthYear);
    if (!form.birthYear) e.birthYear = 'Bắt buộc.';
    else if (!Number.isInteger(y) || y < 1900 || y > THIS_YEAR) e.birthYear = 'Năm không hợp lệ.';
    if (!form.acceptTerms) e.acceptTerms = 'Bạn cần đồng ý với điều khoản để tiếp tục.';
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    updatePersonal({ ...form, registered: true });
    navigate('/dang-ky/ca-nhan/thanh-cong');
  };

  const skip = () => {
    updatePersonal({ ...form, registered: true });
    navigate('/dang-ky/ca-nhan/thanh-cong');
  };

  return (
    <div className="step-page step-page--wide">
      <AuthCard as="form" width={600} onSubmit={submit} noValidate>
        <MiniStepper steps={PERSONAL_STEPS} current={3} />
        <div className="heading">
          <h1 className="ui-h1">Cho chúng tôi biết thêm về bạn</h1>
          <p className="ui-body-sm text-medium">
            DeepEdu dùng thông tin này để gợi ý mô hình, mẫu câu lệnh và nội dung phù hợp với bạn.
          </p>
        </div>

        <div className="account-chip">
          <span className="avatar">{personal.email[0].toUpperCase()}</span>
          <div>
            <p className="account-chip__email">{personal.email}</p>
            <p className="account-chip__status">Email đã được xác minh</p>
          </div>
        </div>

        <div className="stack-24">
          <TextField
            label="Họ và tên *"
            placeholder="VD: Nguyễn Văn Minh"
            value={form.fullName}
            onChange={(e) => set({ fullName: e.target.value })}
            error={errors.fullName}
            autoComplete="name"
          />

          <fieldset className="role-picker">
            <legend className="ui-field__label">Bạn là *</legend>
            <div className="role-picker__chips">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`role-chip${form.role === r.id ? ' is-selected' : ''}`}
                  aria-pressed={form.role === r.id}
                  onClick={() => set({ role: r.id })}
                >
                  <MaskIcon src={`/assets/auth/${r.icon}.svg`} size={18} />
                  {r.label}
                </button>
              ))}
            </div>
            {errors.role && <p className="ui-field__error">{errors.role}</p>}
          </fieldset>

          <div className="row-fields">
            <TextField
              className="row-fields__grow"
              label="Trường / Đơn vị (không bắt buộc)"
              placeholder="VD: Đại học Bách khoa Hà Nội"
              value={form.school}
              onChange={(e) => set({ school: e.target.value })}
            />
            <TextField
              className="row-fields__year"
              label="Năm sinh *"
              placeholder="VD: 2004"
              inputMode="numeric"
              maxLength={4}
              value={form.birthYear}
              onChange={(e) => set({ birthYear: e.target.value.replace(/\D/g, '') })}
              error={errors.birthYear}
            />
          </div>

          <p className="tip ui-caption text-medium">
            <img src="/assets/auth/ic-info.svg" alt="" width="16" height="16" />
            Dưới 16 tuổi cần có sự đồng ý của cha mẹ hoặc người giám hộ để sử dụng DeepEdu.
          </p>
        </div>

        <Separator />

        <div className="stack-12">
          <Checkbox checked={form.acceptTerms} onChange={(v) => set({ acceptTerms: v })}>
            Tôi đồng ý với Điều khoản Dịch vụ và Chính sách Bảo mật của DeepEdu. *
          </Checkbox>
          {errors.acceptTerms && <p className="ui-field__error">{errors.acceptTerms}</p>}
          <Checkbox checked={form.marketing} onChange={(v) => set({ marketing: v })}>
            Nhận mẹo học tập với AI và ưu đãi gói Pro qua email (không bắt buộc).
          </Checkbox>
        </div>

        <div className="row-between">
          <button type="button" className="ui-link ui-link--neutral" onClick={skip}>
            Bỏ qua, điền sau
          </button>
          <button type="submit" className="ui-btn ui-btn--primary ui-btn--icon-right">
            Hoàn tất
            <img src="/assets/auth/ic-arrow-right-white.svg" alt="" width="24" height="24" />
          </button>
        </div>
      </AuthCard>
    </div>
  );
}
