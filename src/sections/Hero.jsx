import { Badge } from '../components/Pill.jsx';

export default function Hero() {
  return (
    <section className="hero" id="top">
      <img className="hero__visual" src="/assets/hero/hero-visual.jpg" alt="" />
      <div className="hero__content">
        <Badge weight={800}>Nền tảng AI của người Việt</Badge>
        <h1 className="hero__title">
          <span>Nền tảng AI</span>
          <span>cho Giáo dục</span>
          <span>Việt Nam</span>
        </h1>
        <p className="hero__desc">
          Mô hình AI giáo dục đầu tiên được phát triển chuyên biệt cho chương trình phổ thông Việt Nam, với kho dữ liệu
          tiếng Việt quy mô lớn và tri thức giáo dục được chuẩn hóa theo chương trình Bộ Giáo dục &amp; Đào tạo.
        </p>
      </div>
    </section>
  );
}
