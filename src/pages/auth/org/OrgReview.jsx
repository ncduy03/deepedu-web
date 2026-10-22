import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Building2, ExternalLink, Mail, Pencil, Phone, User } from 'lucide-react';
import { Checkbox } from '../../../components/ui/index.jsx';
import { useSignup } from '../../../state/SignupContext.jsx';
import OrgShell from './OrgShell.jsx';

function ReviewSection({ icon: Icon, title, editTo, columns, children }) {
  return (
    <section className="review-box">
      <header className="review-box__head">
        <h2>
          <Icon size={18} />
          {title}
        </h2>
        <Link to={editTo} className="ui-link">
          <Pencil size={14} />
          Sửa
        </Link>
      </header>
      <dl className="review-box__grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {children}
      </dl>
    </section>
  );
}

function Item({ label, children }) {
  return (
    <div className="review-item">
      <dt>{label}</dt>
      <dd>{children || '—'}</dd>
    </div>
  );
}

export default function OrgReview() {
  const { org, updateOrg } = useSignup();
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const navigate = useNavigate();

  if (!org.contactEmail) return <Navigate to="/dang-ky/to-chuc" replace />;

  const submit = (ev) => {
    ev.preventDefault();
    if (!terms || !privacy) return;
    const id = `DEEPEDU-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    updateOrg({ applicationId: id });
    navigate('/dang-ky/to-chuc/thanh-cong');
  };

  return (
    <OrgShell
      step={3}
      title="Kiểm tra & Xác nhận Hồ sơ"
      subtitle="Kiểm tra kỹ lưỡng các thông tin tổ chức và người liên hệ trước khi gửi hồ sơ xét duyệt đến DeepEdu."
      onSubmit={submit}
    >
      <ReviewSection icon={Building2} title="Thông tin Tổ chức Đăng ký" editTo="/dang-ky/to-chuc" columns={3}>
        <Item label="Tên Pháp lý">{org.legalName}</Item>
        <Item label="Tên Hiển thị">{org.displayName || org.legalName}</Item>
        <Item label="Loại hình Tổ chức">
          <span className="review-tag">{org.orgType}</span>
        </Item>
        <Item label="Quốc gia / Khu vực">{org.country}</Item>
        <Item label="Tên miền Tổ chức (Domain)">
          <span className="mono">@{org.domain}</span>
        </Item>
        <Item label="Website Tổ chức">
          {org.website && (
            <a href={org.website} target="_blank" rel="noreferrer" className="review-link">
              {org.website}
            </a>
          )}
        </Item>
      </ReviewSection>

      <ReviewSection icon={User} title="Thông tin Người đại diện Liên hệ" editTo="/dang-ky/to-chuc/lien-he" columns={4}>
        <Item label="Họ và tên">{org.contactName}</Item>
        <Item label="Vị trí công tác">{org.position}</Item>
        <Item label="Email Liên hệ">
          <span className="review-icon-value review-link">
            <Mail size={14} />
            {org.contactEmail}
          </span>
        </Item>
        <Item label="Số điện thoại">
          <span className="review-icon-value">
            <Phone size={14} />
            {org.phone}
          </span>
        </Item>
      </ReviewSection>

      <section className="review-box review-box--consent">
        <p className="review-box__eyebrow">CAM KẾT &amp; THỎA THUẬN DỊCH VỤ</p>
        <Checkbox checked={terms} onChange={setTerms} className="consent">
          Tôi đồng ý với{' '}
          <a href="#" className="consent__link">
            Điều khoản Dịch vụ
            <ExternalLink size={12} />
          </a>
          , quy định về quản trị định tuyến mô hình AI, phát sinh khóa ảo và giới hạn hạn mức tổ chức.
        </Checkbox>
        <Checkbox checked={privacy} onChange={setPrivacy} className="consent">
          Tôi đồng ý với{' '}
          <a href="#" className="consent__link">
            Chính sách Bảo mật
            <ExternalLink size={12} />
          </a>
          , bao gồm quy trình xử lý số liệu đo lường và cam kết không lưu giữ dữ liệu prompt của học sinh/sinh viên.
        </Checkbox>
      </section>

      <div className="org-card__actions">
        <Link to="/dang-ky/to-chuc/lien-he" className="ui-link ui-link--muted">
          <ArrowLeft size={16} />
          Quay lại Chỉnh sửa
        </Link>
        <button type="submit" className="ui-btn ui-btn--primary ui-btn--icon-right" disabled={!terms || !privacy}>
          Gửi hồ sơ đăng ký
          <ArrowRight size={20} />
        </button>
      </div>
    </OrgShell>
  );
}
