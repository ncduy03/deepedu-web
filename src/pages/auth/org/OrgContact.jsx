import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Briefcase, Mail, Phone, User } from 'lucide-react';
import { TextField } from '../../../components/ui/index.jsx';
import { isValidEmail, useSignup } from '../../../state/SignupContext.jsx';
import OrgShell from './OrgShell.jsx';

const PHONE_RE = /^(\+?84|0)\d{8,10}$/;

export default function OrgContact() {
  const { org, updateOrg } = useSignup();
  const [form, setForm] = useState(org);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  if (!org.legalName) return <Navigate to="/dang-ky/to-chuc" replace />;

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const submit = (ev) => {
    ev.preventDefault();
    const e = {};
    if (!form.contactName.trim()) e.contactName = 'Vui lòng nhập họ và tên.';
    if (!form.position.trim()) e.position = 'Vui lòng nhập vị trí công tác.';
    if (!isValidEmail(form.contactEmail)) e.contactEmail = 'Email không hợp lệ.';
    else if (!form.contactEmail.trim().toLowerCase().endsWith(`@${org.domain}`))
      e.contactEmail = `Vui lòng dùng email thuộc tên miền @${org.domain}.`;
    if (!PHONE_RE.test(form.phone.replace(/[\s.-]/g, ''))) e.phone = 'Số điện thoại không hợp lệ.';
    setErrors(e);
    if (Object.keys(e).length) return;
    updateOrg(form);
    navigate('/dang-ky/to-chuc/xac-nhan');
  };

  return (
    <OrgShell
      step={2}
      title="Thông tin Người đại diện Liên hệ"
      subtitle="Cung cấp thông tin người đại diện ban đầu. Người đại diện ban đầu sẽ chính là quản trị viên của tổ chức để tiếp nhận thông báo xét duyệt, thiết lập tài khoản quản trị và phối hợp triển khai."
      onSubmit={submit}
    >
      <div className="org-grid">
        <TextField
          label="Họ và tên người đại diện"
          required
          leading={<User size={16} />}
          placeholder="Ví dụ: Nguyễn Văn A"
          helper="Họ và tên của người đại diện liên hệ ban đầu."
          value={form.contactName}
          onChange={(e) => set({ contactName: e.target.value })}
          error={errors.contactName}
          autoComplete="name"
        />
        <TextField
          label="Vị trí công tác"
          required
          leading={<Briefcase size={16} />}
          placeholder="Ví dụ: Giám đốc Công nghệ, Trưởng phòng CNTT, Trưởng khoa"
          helper="Chức danh hoặc vai trò của người liên hệ tại tổ chức."
          value={form.position}
          onChange={(e) => set({ position: e.target.value })}
          error={errors.position}
        />
        <TextField
          label="Email Liên hệ"
          required
          type="email"
          leading={<Mail size={16} />}
          placeholder={`Ví dụ: contact@${org.domain || 'example.edu.vn'}`}
          helper="Dùng để nhận thông báo xét duyệt và hướng dẫn thiết lập tài khoản. Vui lòng sử dụng email thuộc domain tổ chức đã đăng ký ở Bước 1."
          value={form.contactEmail}
          onChange={(e) => set({ contactEmail: e.target.value })}
          error={errors.contactEmail}
          autoComplete="email"
        />
        <TextField
          label="Số điện thoại"
          required
          type="tel"
          leading={<Phone size={16} />}
          placeholder="Ví dụ: 0912-345-678"
          helper="Dùng để liên hệ trực tiếp trong quá trình xác minh hồ sơ."
          value={form.phone}
          onChange={(e) => set({ phone: e.target.value })}
          error={errors.phone}
          autoComplete="tel"
        />
      </div>

      <div className="org-card__actions">
        <Link to="/dang-ky/to-chuc" className="ui-link ui-link--muted">
          <ArrowLeft size={16} />
          Quay lại
        </Link>
        <button type="submit" className="ui-btn ui-btn--primary ui-btn--icon-right">
          Tiếp tục
          <ArrowRight size={20} />
        </button>
      </div>
    </OrgShell>
  );
}
