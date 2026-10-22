import { Link } from 'react-router-dom';
import './auth.css';

const FEATURES = [
  {
    icon: '/assets/auth/ic-shield.svg',
    title: 'Phân quyền Tổ chức',
    desc: 'Kiểm soát chi tiết quyền hạn thành viên, phân bổ API key và quota theo khoa, viện nghiên cứu và bộ môn.',
    highlight: 'Sẵn sàng cho SAML 2.0 & Google Workspace',
  },
  {
    icon: '/assets/auth/ic-cpu.svg',
    title: 'Quản trị Mô hình AI',
    desc: 'Quản lý tập trung chính sách truy cập mô hình (Gemini, Claude, GPT, Open Source), thiết lập màng lọc an toàn cho người học.',
    highlight: 'Quy chuẩn an toàn nội dung giáo dục',
  },
  {
    icon: '/assets/auth/ic-chart.svg',
    title: 'Minh bạch Sử dụng & Chi phí',
    desc: 'Theo dõi thời gian thực lượng token tiêu thụ, phân bổ chi phí minh bạch cho từng dự án, đề tài và trần ngân sách.',
    highlight: 'Cảnh báo ngân sách thời gian thực',
  },
];

export default function SignupChoice() {
  return (
    <div className="choice">
      <section className="choice__hero">
        <div className="choice__text">
          <h1 className="ui-giant-display">Bắt đầu với DeepEdu</h1>
          <p>
            Nền tảng AI cho giáo dục Việt Nam. Đăng ký tổ chức để quản trị tập trung mô hình AI và chi phí, hoặc tạo tài
            khoản cá nhân miễn phí để bắt đầu ngay.
          </p>
        </div>
        <div className="choice__ctas">
          <Link to="/dang-ky/to-chuc" className="ui-btn ui-btn--primary ui-btn--icon-right">
            Đăng ký cho Tổ chức
            <img src="/assets/auth/ic-arrow-right-white.svg" alt="" width="24" height="24" />
          </Link>
          <Link to="/dang-ky/ca-nhan" className="ui-btn ui-btn--tertiary ui-btn--icon-right">
            Đăng ký cho Cá nhân
            <img src="/assets/auth/ic-arrow-right-dark.svg" alt="" width="24" height="24" />
          </Link>
        </div>
      </section>

      <hr className="choice__divider" />

      <section className="choice__features">
        <p className="choice__eyebrow">ĐƯỢC THIẾT KẾ CHO CÁC TRƯỜNG ĐẠI HỌC, TRƯỜNG PHỔ THÔNG VÀ TỔ CHỨC GIÁO DỤC</p>
        <div className="choice__cards">
          {FEATURES.map((f) => (
            <article key={f.title} className="feature-card">
              <span className="feature-card__icon">
                <img src={f.icon} alt="" width="20" height="20" />
              </span>
              <div className="feature-card__content">
                <h3 className="ui-h4">{f.title}</h3>
                <p className="ui-body-sm">{f.desc}</p>
              </div>
              <p className="feature-card__highlight">
                <img src="/assets/auth/ic-check-small.svg" alt="" width="14" height="14" />
                {f.highlight}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
