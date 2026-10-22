import { useState } from 'react';
import { Badge } from '../components/Pill.jsx';

const CARDS = [
  {
    tag: '500 tỷ Token',
    title: ['Kho dữ liệu', 'học thuật quy mô lớn'],
    desc: '500 tỷ token tiếng Việt lĩnh vực giáo dục chất lượng cao được thu thập, bảo chứng bản quyền, làm sạch và chuẩn hóa tối ưu phục vụ riêng cho việc huấn luyện AI bản địa.',
  },
  {
    tag: 'Chuẩn hóa 100%',
    title: ['Tri thức giáo dục', 'Việt Nam chuẩn hóa'],
    desc: 'Toàn bộ 3 bộ SGK phổ thông mới (K1-K12) được số hóa, vector hóa và liên kết dạng đồ thị tri thức ngữ nghĩa sâu bám sát cấu trúc của Bộ GD&ĐT.',
  },
  {
    tag: 'Máy chủ nội địa',
    title: ['Hạ tầng chủ quyền', 'dữ liệu trong nước'],
    desc: 'Hệ thống máy chủ tối tân đặt hoàn toàn tại Việt Nam giúp bảo mật thông tin học đường và kiểm soát an toàn dữ liệu học sinh tuyệt đối.',
  },
  {
    tag: 'Tiết kiệm 50% - 60%',
    title: ['Chi phí tối ưu', 'vượt trội diện rộng'],
    desc: 'Giảm trực tiếp 50% đến 60% ngân sách vận hành hệ thống thực tế nhờ tự chủ công nghệ nén mô hình bản ngữ so với việc sử dụng thuần API ngoại.',
  },
];

export default function Solutions() {
  // Figma card component has Default / Hover variants; the first card is shown expanded in the page design.
  const [active, setActive] = useState(0);

  return (
    <section className="solutions" id="giai-phap">
      <div className="container solutions__inner">
        <div className="solutions__heading">
          <Badge>Chủ động công nghệ Việt</Badge>
          <div className="solutions__text">
            <h2 className="display-h4">
              Nền tảng vượt trội
              <br />
              Vận hành tự chủ toàn diện
            </h2>
            <p>
              DeepEdu tháo gỡ hoàn toàn các rào cản của AI ngoại để thiết lập hạ tầng trí tuệ nhân tạo bền vững, chính
              xác và tiết kiệm nhất cho cộng đồng giáo dục.
            </p>
          </div>
        </div>

        <div className="solutions__grid">
          {CARDS.map((c, i) => {
            const isActive = i === active;
            return (
              <article
                key={c.tag}
                className={`solution-card${isActive ? ' is-active' : ''}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                tabIndex={0}
              >
                <div className="solution-card__top">
                  <span className="solution-card__tag">
                    <span>{c.tag}</span>
                  </span>
                  <h3 className="solution-card__title">
                    {c.title[0]}
                    <br />
                    {c.title[1]}
                  </h3>
                  {isActive && <p className="solution-card__desc">{c.desc}</p>}
                </div>
                {!isActive && <p className="solution-card__num">({i + 1})</p>}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
