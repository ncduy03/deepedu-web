export default function CallToAction() {
  return (
    <section className="cta" id="lien-he">
      <div className="container">
        <div className="cta__box">
          <img className="cta__bg" src="/assets/cta/bg-base.png" alt="" />
          <img className="cta__overlay" src="/assets/cta/bg-overlay.png" alt="" />
          <div className="cta__text">
            <h2 className="heading-h2">
              Sẵn sàng đồng hành cùng
              <br />
              tương lai Giáo dục Việt Nam?
            </h2>
            <p>
              Khám phá cách DeepEdu giúp giáo viên, nhà trường và học sinh ứng dụng trí tuệ nhân tạo (AI) hiệu quả hơn
              mỗi ngày trong công tác giảng dạy thực nghiệm.
            </p>
          </div>
          <a href="mailto:contact@deepedu.vn" className="btn btn--brand btn--lg">
            Đăng ký Demo
            <img src="/assets/cta/icon-letter.svg" alt="" width="20" height="20" />
          </a>
        </div>
      </div>
    </section>
  );
}
