import { Badge, Tag } from '../components/Pill.jsx';

const CARDS = [
  {
    icon: '/assets/problem/icon-warning.svg',
    iconClass: 'problem-card__icon--warning',
    caption: 'Địa điểm đặt máy chủ & dữ liệu',
    stat: '100% ngoài lãnh thổ Việt Nam',
    tag: 'Chủ quyền dữ liệu',
    title: 'Rủi ro chủ quyền số',
    desc: 'Dữ liệu hàng triệu học sinh Việt Nam lưu trữ tại máy chủ nước ngoài – mất kiểm soát về an toàn thông tin.',
  },
  {
    icon: '/assets/problem/icon-quality.svg',
    caption: 'Tỷ lệ tiếng Việt trong dữ liệu AI toàn cầu',
    stat: '< 1% tổng dữ liệu',
    fixedVisual: true,
    tag: 'Năng lực ngôn ngữ & nghiệp vụ',
    title: 'Chất lượng thấp',
    desc: 'Tiếng Việt chiếm dưới 1% dữ liệu huấn luyện của các frontier model quốc tế – xử lý nội dung chương trình BGD còn nhiều sai sót.',
  },
  {
    chart: '/assets/problem/icon-cost.svg',
    tag: 'Tính khả thi kinh tế',
    title: 'Chi phí cao',
    desc: 'Phụ thuộc API ngoại không bền vững về tài chính khi triển khai đại trà tới từng học sinh và trường học toàn quốc.',
  },
];

export default function Problems() {
  return (
    <section className="problems" id="van-de">
      <div className="container problems__inner">
        <div className="problems__head">
          <div className="problems__heading">
            <Badge size="md">Bối cảnh &amp; Vấn đề trực tế</Badge>
            <h2 className="display-h4 problems__title">
              Thách thức của
              <br />
              Giáo dục Việt Nam trong kỷ nguyên AI
            </h2>
          </div>
          <div className="problems__intro">
            <p>
              Việt Nam hiện đang phụ thuộc gần như hoàn toàn vào các mô hình trí tuệ nhân tạo nước ngoài để ứng dụng
              trong giảng dạy và quản lý học đường.
            </p>
            <p>
              Các mô hình quốc tế này chưa được thiết kế riêng cho hệ thống K-12 Việt Nam, dẫn đến các rào cản nghiêm
              trọng về chuẩn mực sư phạm cũng như an ninh mạng quốc gia.
            </p>
          </div>
        </div>

        <div className="problems__cards">
          {CARDS.map((c) => (
            <article key={c.title} className="problem-card">
              {c.chart ? (
                <div className="problem-card__visual problem-card__visual--chart">
                  <img className="problem-card__chart" src={c.chart} alt="" width="322.667" height="198" />
                </div>
              ) : (
                <div className={`problem-card__visual${c.fixedVisual ? ' problem-card__visual--fixed' : ''}`}>
                  <div className="problem-card__icon-wrap">
                    <span className={`problem-card__icon ${c.iconClass || ''}`}>
                      <img src={c.icon} alt="" />
                    </span>
                  </div>
                  <div className="problem-card__caption">
                    <p className="problem-card__caption-label">{c.caption}</p>
                    <p className="problem-card__caption-stat gradient-text">{c.stat}</p>
                  </div>
                </div>
              )}
              <div className="problem-card__body">
                <Tag>{c.tag}</Tag>
                <div className="problem-card__text">
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
