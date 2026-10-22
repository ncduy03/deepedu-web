import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, AtSign, Globe } from 'lucide-react';
import { TextField } from '../../../components/ui/index.jsx';
import { useSignup } from '../../../state/SignupContext.jsx';
import OrgShell from './OrgShell.jsx';

export const ORG_TYPES = [
  'Trường Đại học / Cao đẳng',
  'Trường Phổ thông',
  'Viện / Trung tâm nghiên cứu',
  'Sở / Phòng Giáo dục',
  'Doanh nghiệp / EdTech',
  'Khác',
];

export const COUNTRIES = ['Việt Nam', 'Singapore', 'Thái Lan', 'Nhật Bản', 'Hàn Quốc', 'Khác'];

const DOMAIN_RE = /^(?!-)[a-z0-9-]+(\.[a-z0-9-]+)+$/i;

export default function OrgInfo() {
  const { org, updateOrg } = useSignup();
  const [form, setForm] = useState(org);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const submit = (ev) => {
    ev.preventDefault();
    const e = {};
    if (!form.legalName.trim()) e.legalName = 'Vui lòng nhập tên pháp lý.';
    if (!form.orgType) e.orgType = 'Vui lòng chọn loại hình tổ chức.';
    if (!form.country) e.country = 'Vui lòng chọn quốc gia hoặc khu vực.';
    if (!DOMAIN_RE.test(form.domain.trim())) e.domain = 'Tên miền không hợp lệ (ví dụ: example.edu.vn).';
    setErrors(e);
    if (Object.keys(e).length) return;
    updateOrg({ ...form, domain: form.domain.trim().toLowerCase() });
    navigate('/dang-ky/to-chuc/lien-he');
  };

  return (
    <OrgShell
      step={1}
      title="Thông tin Tổ chức"
      subtitle="Cung cấp thông tin trường học, viện nghiên cứu hoặc doanh nghiệp giáo dục của bạn để thiết lập môi trường DeepEdu."
      onSubmit={submit}
    >
      <div className="org-grid">
        <TextField
          label="Tên Pháp lý Tổ chức"
          required
          placeholder="Ví dụ: Công ty Cổ phần Công nghệ ABC"
          helper="Tên chính thức theo hồ sơ pháp lý của tổ chức."
          value={form.legalName}
          onChange={(e) => set({ legalName: e.target.value })}
          error={errors.legalName}
        />
        <TextField
          label="Tên Hiển thị Tổ chức"
          placeholder="Ví dụ: ABC AI Lab"
          helper="Tên hiển thị trên portal, API key và báo cáo sử dụng."
          value={form.displayName}
          onChange={(e) => set({ displayName: e.target.value })}
        />
        <TextField
          as="select"
          label="Loại hình Tổ chức"
          required
          helper="Chọn loại hình phù hợp nhất."
          value={form.orgType}
          onChange={(e) => set({ orgType: e.target.value })}
          error={errors.orgType}
        >
          <option value="" disabled>
            Chọn loại hình tổ chức
          </option>
          {ORG_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </TextField>
        <TextField
          as="select"
          label="Quốc gia / Khu vực"
          required
          helper="Dùng để áp dụng chính sách hỗ trợ và pháp lý phù hợp."
          value={form.country}
          onChange={(e) => set({ country: e.target.value })}
          error={errors.country}
        >
          <option value="" disabled>
            Chọn quốc gia hoặc khu vực
          </option>
          {COUNTRIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </TextField>
        <TextField
          label="Tên miền Tổ chức (Domain)"
          required
          mono
          leading={<AtSign size={16} />}
          placeholder="Ví dụ: example.edu.vn"
          helper="Dùng cho xác minh tổ chức, SSO và mời thành viên."
          value={form.domain}
          onChange={(e) => set({ domain: e.target.value.replace(/^@/, '') })}
          error={errors.domain}
        />
        <TextField
          label="Website Tổ chức"
          type="url"
          leading={<Globe size={16} />}
          placeholder="Ví dụ: https://www.example.edu.vn"
          helper="Website chính thức của tổ chức."
          value={form.website}
          onChange={(e) => set({ website: e.target.value })}
        />
      </div>

      <div className="org-card__actions">
        <Link to="/dang-ky" className="ui-link ui-link--muted">
          Hủy
        </Link>
        <button type="submit" className="ui-btn ui-btn--primary ui-btn--icon-right">
          Tiếp tục: Thông tin liên hệ
          <ArrowRight size={20} />
        </button>
      </div>
    </OrgShell>
  );
}
