import { Link } from 'react-router-dom';
import Logo from '../components/Logo.jsx';

export const NAV_LINKS = [
  { label: 'Vấn đề', href: '#van-de' },
  { label: 'Giải pháp', href: '#giai-phap' },
  { label: 'Tầng công nghệ', href: '#cong-nghe' },
  { label: 'Đối tác', href: '#doi-tac' },
  { label: 'Tầm nhìn', href: '#tam-nhin' },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href="#top" className="site-header__brand" aria-label="DeepEdu">
          <Logo set="header" height={32.053} />
        </a>
        <nav className="site-header__nav">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="site-header__actions">
          <Link to="/dang-ky" className="btn btn--brand btn--md">
            Đăng ký ngay
          </Link>
          <Link to="/tro-ly" className="btn btn--brand-secondary btn--md">
            Trải nghiệm DeepEdu
          </Link>
        </div>
      </div>
    </header>
  );
}
