import Logo, { SocialMark } from '../components/Logo.jsx';

const COLUMNS = [
  [
    { label: 'Vấn đề', href: '#van-de' },
    { label: 'Giải pháp', href: '#giai-phap' },
    { label: 'Tầng công nghệ', href: '#cong-nghe' },
  ],
  [
    { label: 'Tầm nhìn', href: '#tam-nhin' },
    { label: 'Đối tác', href: '#doi-tac' },
    { label: 'Liên hệ', href: '#lien-he' },
  ],
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__about">
          <Logo set="footer" height={40} />
          <p>
            Dự án hạ tầng AI Giáo dục chuyên biệt cho Việt Nam, phát triển bởi đội ngũ kỹ sư AI kết hợp cùng các giáo
            sư, tiến sĩ đầu ngành sư phạm quốc gia.
          </p>
        </div>

        <nav className="footer__links">
          {COLUMNS.map((col, i) => (
            <div key={i} className="footer__col">
              {col.map((l) => (
                <a key={l.href} href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </nav>

        <div className="footer__meta">
          <div className="footer__socials">
            <a href="#top" className="social" aria-label="DeepEdu">
              <SocialMark />
            </a>
            <a href="https://www.facebook.com" className="social" aria-label="Facebook" target="_blank" rel="noreferrer">
              <img src="/assets/footer/social-facebook.svg" alt="" width="24" height="24" />
            </a>
            <a href="https://www.linkedin.com" className="social" aria-label="LinkedIn" target="_blank" rel="noreferrer">
              <span className="social__linkedin">
                <img src="/assets/footer/social-linkedin.svg" alt="" />
              </span>
            </a>
          </div>
          <p className="footer__copy">
            <span>Copyright ©2025</span>
            <span className="footer__copy-brand">Deepedu.vn</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
