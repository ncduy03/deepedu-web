import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Check, Copy, ShieldCheck } from 'lucide-react';
import { AuthCard } from '../../../components/ui/index.jsx';
import { useSignup } from '../../../state/SignupContext.jsx';
import '../auth.css';

const NEXT_STEPS = [
  'Đội ngũ DeepEdu sẽ rà soát thông tin tổ chức của bạn và tiến hành phê duyệt trong thời gian sớm nhất.',
  'Sau khi hồ sơ được phê duyệt, bạn sẽ nhận được email mời thiết lập tài khoản quản trị viên cho tổ chức.',
  'Tiến hành các bước xác nhận và cấu hình ban đầu cho tài khoản.',
  'Tài khoản được kích hoạt và có thể sử dụng nền tảng.',
];

export default function OrgSuccess() {
  const { org } = useSignup();
  const [copied, setCopied] = useState(false);

  if (!org.applicationId) return <Navigate to="/dang-ky/to-chuc" replace />;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(org.applicationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable: nothing to do */
    }
  };

  return (
    <div className="step-page step-page--wide">
      <AuthCard width={838} className="success-card org-success">
        <span className="success-icon success-icon--positive">
          <Check size={36} strokeWidth={2.5} />
        </span>
        <div className="heading heading--center">
          <h1 className="ui-h1">Đã Gửi Hồ sơ Đăng ký Thành công!</h1>
          <p className="ui-body-sm text-medium">
            Hồ sơ đăng ký của tổ chức đã được tiếp nhận thành công. Thông tin liên lạc chính thức:{' '}
            <b className="text-strong">{org.contactEmail}</b>.
          </p>
        </div>

        <dl className="summary">
          <div className="summary__row">
            <dt>Mã hồ sơ:</dt>
            <dd className="summary__id">
              <span className="mono">{org.applicationId}</span>
              <button type="button" className="icon-btn" onClick={copy} aria-label="Sao chép mã hồ sơ">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </dd>
          </div>
          <div className="summary__row">
            <dt>Tổ chức đăng ký:</dt>
            <dd>{org.displayName || org.legalName}</dd>
          </div>
        </dl>

        <div className="plan-box">
          <p className="plan-box__title">
            <ShieldCheck size={16} className="text-primary" />
            CÁC BƯỚC TIẾP THEO
          </p>
          <ol className="next-steps">
            {NEXT_STEPS.map((s, i) => (
              <li key={i}>
                <span className="next-steps__num">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>

        <Link to="/" className="ui-btn ui-btn--primary ui-btn--block">
          Quay về Trang chủ
        </Link>
      </AuthCard>
    </div>
  );
}
