import { Badge } from '../components/Pill.jsx';
import { LogoMark } from '../components/Logo.jsx';

const PILLARS = [
  {
    icon: '/assets/vision/icon-magic-stick.svg',
    title: 'Sư phạm chuẩn MoET',
    desc: 'Tương thích 100% chương trình Giáo dục phổ thông mới ban hành.',
  },
  {
    icon: '/assets/vision/icon-global.svg',
    title: 'Chủ quyền Dữ liệu',
    desc: 'Kho ngữ liệu 500B Token và hạ tầng máy chủ vận hành đặt tại nội địa.',
  },
  {
    icon: '/assets/vision/icon-tuning.svg',
    title: 'Đồng hành Quốc gia',
    desc: 'Phổ cập năng lực AI tạo sinh tới từng bản làng, trường huyện biên giới.',
  },
];

export default function Vision() {
  return (
    <section className="vision" id="tam-nhin">
      <div className="container vision__inner">
        <div className="vision__head">
          <Badge variant="inverted">Khát vọng chủ quyền số</Badge>
          <div className="vision__text">
            <h2 className="display-h4">
              Xây dựng hạ tầng AI
              <br />
              Giáo dục quốc gia
            </h2>
            <p>
              DeepEdu không chỉ dừng lại là một công cụ tiện ích. Chúng tôi hướng tới định vị trở thành nền tảng hạ tầng
              AI phục vụ giáo dục Việt Nam, giúp mọi giáo viên, nhà trường và học sinh thế hệ mới dễ dàng bứt phá, tiếp
              cận tinh hoa công nghệ AI được phát triển trên chính nền tảng tri thức, dữ liệu bản quyền và nhu cầu của
              chính Việt Nam.
            </p>
          </div>
        </div>

        <div className="vision__cards">
          {PILLARS.map((p) => (
            <article key={p.title} className="vision-card">
              <span className="vision-card__icon">
                <img src={p.icon} alt="" width="24" height="24" />
              </span>
              <div className="vision-card__text">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <LogoMark set="vision" size={714} className="vision__watermark" />
    </section>
  );
}
