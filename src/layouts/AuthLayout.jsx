import { Link, Outlet } from 'react-router-dom';
import './AuthLayout.css';

export function AuthHeader() {
  return (
    <header className="auth-header">
      <Link to="/" className="auth-brand">
        <span className="auth-brand__logo">DE</span>
        <span className="auth-brand__text">
          <span className="auth-brand__name">DeepEdu</span>
          <span className="auth-brand__tagline">Nền tảng AI cho giáo dục Việt Nam</span>
        </span>
      </Link>
      <div className="auth-header__actions">
        <a href="#" className="auth-docs-link">
          <img src="/assets/auth/ic-file.svg" alt="" width="16" height="16" />
          Tài liệu &amp; API
        </a>
        <Link to="/dang-nhap" className="btn btn--brand btn--md">
          Đăng nhập
        </Link>
        <Link to="/tro-ly" className="btn btn--brand-secondary btn--md">
          Trải nghiệm DeepEdu
        </Link>
      </div>
    </header>
  );
}

export function AuthFooter() {
  return (
    <footer className="auth-footer">
      <div className="auth-footer__brand">
        <span className="auth-footer__logo">
          <img src="/assets/auth/ic-shield-footer.svg" alt="" width="16" height="16" />
          DeepEdu
        </span>
        <span className="auth-footer__divider" />
        <span className="auth-footer__security">
          <img src="/assets/auth/ic-lock.svg" alt="" width="12" height="12" />
          Bảo mật đa tầng &amp; An toàn dữ liệu giáo dục
        </span>
      </div>
      <nav className="auth-footer__links">
        <a href="#">Chính sách Bảo mật</a>
        <a href="#">Điều khoản Dịch vụ</a>
        <a href="#">
          Tài liệu Kỹ thuật
          <img src="/assets/auth/ic-ext.svg" alt="" width="12" height="12" />
        </a>
        <a href="#">Hỗ trợ</a>
      </nav>
      <p className="auth-footer__copy">© 2026 DeepEdu Vietnam. Bảo lưu mọi quyền.</p>
    </footer>
  );
}

/** Shell for sign-up screens: header, canvas-colored main area, footer. */
export default function AuthLayout() {
  return (
    <div className="auth-shell">
      <AuthHeader />
      <main className="auth-main">
        <Outlet />
      </main>
      <AuthFooter />
    </div>
  );
}
