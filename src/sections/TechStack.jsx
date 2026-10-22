import { Tag } from '../components/Pill.jsx';

function CheckItem({ children }) {
  return (
    <li className="check-item">
      <img src="/assets/tech/check-circle.svg" alt="" width="20" height="20" />
      <p>{children}</p>
    </li>
  );
}

const PRODUCTS = [
  {
    name: 'EduOne',
    icon: '/assets/tech/icon-academic-cap.svg',
    desc: 'Thí điểm 5.000 giáo viên THPT tại 63 tỉnh thành từ 12/2025, thiết kế so sánh đối chứng khoa học.',
    top: 54.25,
    width: 430,
  },
  {
    name: 'UniTeach',
    icon: '/assets/tech/icon-notebook.svg',
    desc: 'Closed beta giáo viên THCS & THPT; soạn giáo án chuẩn Công văn BGD tự động hoá.',
    top: 190.25,
    width: 433,
  },
  {
    name: 'UniLearn',
    icon: '/assets/tech/icon-book.svg',
    desc: (
      <>
        Ký kết triển khai với đối tác; ra mắt chính thức
        <br />
        năm học 2026–2027.
      </>
    ),
    top: 322.25,
    width: 430,
  },
];

export default function TechStack() {
  return (
    <section className="tech" id="cong-nghe">
      <div className="container tech__inner">
        <h2 className="display-h4 tech__title">Tầng công nghệ vượt trội</h2>

        <div className="tech__rows">
          {/* 01 — Foundation */}
          <div className="tech-row tech-row--center">
            <div className="tech-row__text">
              <div className="tech-row__intro">
                <Tag>01- Tầng Foundation</Tag>
                <h3 className="heading-h2">
                  Hạ tầng dữ liệu
                  <br />
                  tiếng Việt chất lượng học thuật cao
                </h3>
                <p className="tech-row__desc">
                  Vấn đề tiếng Việt nghèo nàn và thiếu chất lượng của các AI ngoại được khắc phục triệt để bằng hệ thống
                  kho ngữ liệu giáo dục nền móng khổng lồ được thu thập và thẩm định bản quyền khắt khe tại Việt Nam.
                </p>
              </div>
              <ul className="check-list">
                <CheckItem>
                  <b>400 tỷ token tiếng Việt:</b> Bao gồm 350B crawl dữ liệu AIV phối hợp sâu rộng cùng 50B số hoá độc
                  quyền từ hệ thống thư viện khảo thí DeepEdu.
                </CheckItem>
                <CheckItem>
                  <b>200.000+ mẫu fine-tuning corpus:</b> Chia thành 70K mẫu chuyên sâu cho sư phạm và 130K mẫu giao
                  tiếp tiếng Việt tổng quát được gắn nhãn chú thích chất lượng cực cao.
                </CheckItem>
                <CheckItem>
                  <b>DeepEduBench tiêu chuẩn:</b> Hơn 20.000+ câu hỏi đánh giá độc lập công bố công khai chất lượng AI
                  khảo thí phổ thông tại rank.aiforvietnam.org.
                </CheckItem>
              </ul>
            </div>
            <div className="tech-visual tech-visual--foundation">
              <img className="tech-visual__bg" src="/assets/tech/foundation.png" alt="" />
              <span className="tech-visual__cursor">
                <span>
                  <img src="/assets/tech/cursor.svg" alt="" />
                </span>
              </span>
            </div>
          </div>

          {/* 02 — Core */}
          <div className="tech-row tech-row--between">
            <div className="tech-visual tech-visual--core">
              <img className="tech-visual__bg" src="/assets/tech/core.png" alt="" />
            </div>
            <div className="tech-row__text tech-row__text--narrow">
              <div className="tech-row__intro">
                <Tag>02- Tầng Core</Tag>
                <h3 className="heading-h2">Mô hình ngôn ngữ EduGPT chuyên biệt cho K-12</h3>
                <p className="tech-row__desc">
                  Sở hữu hệ thống mô hình cốt lõi tự lực, loại bỏ hoàn toàn vấn đề vi phạm đạo đức, xuyên tạc văn học
                  lịch sử phổ thông thường gặp phải trên các nền tảng AI ngoại ngữ.
                </p>
              </div>
              <ul className="check-list check-list--bold">
                <CheckItem>4 models EduGPT đã benchmark và triển khai: 2 LLM fine-tuned (4B–8B) + 2 EduEmb embedding model.</CheckItem>
                <CheckItem>Toàn bộ 3 bộ SGK K1–K12 đã vector hoá; RAG chuẩn Công văn 5512 BGD.</CheckItem>
              </ul>
            </div>
          </div>

          {/* 03 — Applications */}
          <div className="tech-row tech-row--start">
            <div className="tech-row__text">
              <div className="tech-row__intro">
                <Tag>01- Tầng Foundation</Tag>
                <h3 className="heading-h2">Bộ giải pháp số phục vụ trực tiếp cộng đồng Giáo dục Việt Nam</h3>
                <p className="tech-row__desc">
                  Đưa trí tuệ nhân tạo tương tác thực tế tới từng giáo viên, sở ban ngành giáo dục và toàn thể học sinh
                  thông qua hệ sinh thái ứng dụng đa dạng, chuẩn mực.
                </p>
              </div>
            </div>
            <div className="tech-visual tech-visual--apps">
              <img className="tech-visual__bg tech-visual__bg--apps" src="/assets/tech/solutions-bg.png" alt="" />
              <span className="tech-visual__tint" />

              <div className="assistant">
                <div className="assistant__avatar">
                  <img className="assistant__ball" src="/assets/tech/ai-assistant.png" alt="" />
                  <div className="assistant__face">
                    <img className="assistant__face-base" src="/assets/tech/assistant-face.svg" alt="" />
                    <img className="assistant__face-shade" src="/assets/tech/assistant-shade.svg" alt="" />
                    <img className="assistant__eyes" src="/assets/tech/assistant-eyes.svg" alt="" />
                  </div>
                </div>
              </div>

              <span className="branch branch--top">
                <img src="/assets/tech/branch-top.svg" alt="" />
              </span>
              <span className="branch branch--bottom">
                <img src="/assets/tech/branch-bottom.svg" alt="" />
              </span>
              <span className="branch branch--middle">
                <img src="/assets/tech/branch-middle.svg" alt="" />
              </span>

              {PRODUCTS.map((p) => (
                <div key={p.name} className="product-card" style={{ top: p.top, width: p.width }}>
                  <div className="product-card__inner">
                    <span className="product-card__icon">
                      <img src={p.icon} alt="" width="32" height="32" />
                    </span>
                    <div className="product-card__text">
                      <p className="product-card__name">{p.name}</p>
                      <p className="product-card__desc">{p.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
