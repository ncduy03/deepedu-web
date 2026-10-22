import { Badge } from '../components/Pill.jsx';

const PARTNERS = [
  {
    name: 'Học viện Công nghệ Bưu chính Viễn thông (PTIT)',
    desc: 'PTIT là trường đại học tiên phong về công nghệ thông tin và viễn thông tại Việt Nam, nổi bật với môi trường học tập năng động, đội ngũ giảng viên chất lượng và hoạt động nghiên cứu hiện đại.',
    logo: '/assets/partners/ptit.png',
    framed: { width: 113, height: 140 },
  },
  {
    name: 'Công ty Cổ phần Công nghệ SotaTek',
    desc: 'SotaTek là một doanh nghiệp phát triển phần mềm, blockchain và AI. Công ty có đội ngũ kỹ sư trẻ, sáng tạo, đã triển khai hàng trăm dự án công nghệ cho khách hàng trên toàn cầu.',
    logo: '/assets/partners/sotatek.png',
  },
  {
    name: 'AI for Vietnam Foundation',
    desc: 'AI for Vietnam là một tổ chức tiên phong thúc đẩy ứng dụng trí tuệ nhân tạo tại Việt Nam. Tổ chức này kết nối chuyên gia, tổ chức các dự án, hội thảo, giúp xây dựng hệ sinh thái công nghệ bền vững và thúc đẩy chuyển đổi số quốc gia.',
    logo: '/assets/partners/aiforvietnam.png',
  },
  {
    name: 'Công ty Cổ phần Công nghệ DopikAI',
    desc: 'DopikAI chuyên cung cấp các giải pháp Trí tuệ Nhân tạo và chuyển đổi số. Với đội ngũ chuyên gia trong các lĩnh vực Computer Vision, NLP và Big Data, DopikAI hỗ trợ doanh nghiệp tối ưu vận hành và thúc đẩy đổi mới sáng tạo thông qua ứng dụng AI.',
    logo: '/assets/partners/dopikai.png',
    framed: { width: 125, height: 132 },
    square: true,
  },
];

export default function Partners() {
  return (
    <section className="partners" id="doi-tac">
      <div className="container partners__inner">
        <div className="partners__head">
          <Badge variant="brand-on-white" size="md">
            ĐỐI TÁC
          </Badge>
          <h2 className="partners__title">Tổ chức phối hợp</h2>
        </div>

        <div className="partners__cards">
          {PARTNERS.map((p) => (
            <article key={p.name} className="partner-card">
              {p.framed ? (
                <span className={`partner-card__frame${p.square ? ' partner-card__frame--square' : ''}`}>
                  <img src={p.logo} alt={p.name} style={p.framed} />
                </span>
              ) : (
                <img className="partner-card__logo" src={p.logo} alt={p.name} />
              )}
              <div className="partner-card__text">
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
