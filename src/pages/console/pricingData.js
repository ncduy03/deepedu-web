// Content of "Gói cước chi tiết" (Figma "pricing_personal").

export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    desc: 'Làm quen với Trợ lý DeepEdu cho các nhu cầu học tập cơ bản.',
    monthly: 0,
    yearly: 0,
    credit: '100 credit / tháng',
    features: [
      ['Trợ lý chat với mô hình cơ bản', true],
      ['Tải tệp & phân tích tài liệu (3 tệp/ngày)', true],
      ['Lịch sử trò chuyện 30 ngày', true],
      ['Mô hình AI nâng cao', false],
      ['Tạo ảnh bằng AI', false],
      ['Mua thêm credit', false],
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    popular: true,
    desc: 'Dành cho học sinh, sinh viên cần dùng AI thường xuyên mỗi ngày.',
    monthly: 79000,
    yearly: 790000,
    credit: '500 credit / tháng',
    features: [
      ['Mọi tính năng của gói Free', true],
      ['Mô hình AI nâng cao (giới hạn)', true],
      ['Tải tệp & phân tích tài liệu (20 tệp/ngày)', true],
      ['Tạo ảnh bằng AI (30 ảnh/tháng)', true],
      ['Lịch sử trò chuyện không giới hạn', true],
      ['Mua thêm credit khi cần', true],
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    desc: 'Cho giáo viên, nghiên cứu viên và người dùng chuyên sâu.',
    monthly: 199000,
    yearly: 1990000,
    credit: '1.500 credit / tháng',
    features: [
      ['Mọi tính năng của gói Plus', true],
      ['Toàn bộ mô hình AI nâng cao, chọn mô hình thủ công', true],
      ['Tải tệp không giới hạn, tối đa 50MB/tệp', true],
      ['Tạo ảnh bằng AI (150 ảnh/tháng)', true],
      ['Credit dư được cộng dồn (tối đa 500)', true],
      ['Hỗ trợ ưu tiên & dùng thử tính năng mới', true],
    ],
  },
];

export const CREDIT_USES = [
  { icon: 'ic-chat', title: 'Câu hỏi với mô hình cơ bản', cost: '1 credit', note: 'Gemini Flash, GPT mini…' },
  { icon: 'ic-sparkle-18', title: 'Câu hỏi với mô hình nâng cao', cost: '5 credit', note: 'GPT, Claude, Gemini Pro' },
  { icon: 'ic-file', title: 'Phân tích tài liệu', cost: '3 credit / tệp', note: 'PDF, Word, slide, hình ảnh' },
  { icon: 'ic-image', title: 'Tạo ảnh bằng AI', cost: '10 credit / ảnh', note: 'Độ phân giải tới 1024px' },
];

// Comparison table. true = included, false = not included, string = value. Columns: Free, Plus, Pro.
export const COMPARISON = [
  {
    group: 'Chi phí & credit',
    rows: [
      ['Giá theo tháng', '0đ', '79.000đ', '199.000đ'],
      ['Giá theo năm', '—', '790.000đ', '1.990.000đ'],
      ['Credit hàng tháng', '100', '500', '1.500'],
      ['Mua thêm credit', false, true, true],
      ['Credit dư cộng dồn sang tháng sau', false, false, 'Tối đa 500'],
    ],
  },
  {
    group: 'Mô hình AI',
    rows: [
      ['Mô hình cơ bản (Gemini Flash, GPT mini…)', true, true, true],
      ['Mô hình nâng cao (GPT, Claude, Gemini Pro)', false, 'Giới hạn', true],
      ['Tự chọn mô hình cho từng câu hỏi', false, true, true],
      ['Độ dài ngữ cảnh mỗi hội thoại', 'Tiêu chuẩn', 'Mở rộng', 'Tối đa'],
    ],
  },
  {
    group: 'Tính năng',
    rows: [
      ['Trợ lý chat DeepEdu', true, true, true],
      ['Tải tệp & phân tích tài liệu', '3 tệp/ngày', '20 tệp/ngày', 'Không giới hạn'],
      ['Dung lượng tối đa mỗi tệp', '10MB', '25MB', '50MB'],
      ['Tạo ảnh bằng AI', false, '30 ảnh/tháng', '150 ảnh/tháng'],
      ['Soạn công thức toán (LaTeX)', true, true, true],
    ],
  },
  {
    group: 'Lưu trữ & dữ liệu',
    rows: [
      ['Lịch sử trò chuyện', '30 ngày', 'Không giới hạn', 'Không giới hạn'],
      ['Xuất hội thoại (PDF, Word)', false, true, true],
      ['Không dùng dữ liệu của bạn để huấn luyện AI', true, true, true],
    ],
  },
  {
    group: 'Hỗ trợ & thanh toán',
    rows: [
      ['Hỗ trợ qua email', 'Trong 72 giờ', 'Trong 24 giờ', 'Ưu tiên, trong 8 giờ'],
      ['Dùng thử sớm tính năng mới', false, false, true],
      ['Xuất hoá đơn VAT', false, true, true],
      ['Huỷ gói bất kỳ lúc nào', '—', true, true],
    ],
  },
];

export const TOPUP_PACKS = [
  { credit: '200 credit', price: '49.000đ', note: '245đ / credit' },
  { credit: '500 credit', price: '109.000đ', note: '218đ / credit · Tiết kiệm 11%', featured: true },
  { credit: '1.200 credit', price: '239.000đ', note: '199đ / credit · Tiết kiệm 19%' },
];

export const PAYMENT_METHODS = [
  ['VISA', '#1a1f71'],
  ['Mastercard', '#eb001b'],
  ['JCB', '#0b4ea2'],
  ['MoMo', '#a50064'],
  ['ZaloPay', '#0068ff'],
  ['VNPay', '#005baa'],
  ['Chuyển khoản QR', '#16a34a'],
];

export const PAYMENT_POLICIES = [
  'Giá đã bao gồm VAT. Gói tự động gia hạn theo chu kỳ, bạn có thể tắt trong mục Lịch sử & Thanh toán.',
  'Nâng cấp có hiệu lực ngay, phần chênh lệch được tính theo số ngày còn lại. Hạ gói có hiệu lực từ chu kỳ tiếp theo.',
  'Thông tin thẻ được mã hoá theo tiêu chuẩn PCI DSS, DeepEdu không lưu số thẻ hoặc mã CVV.',
];

// Only the first answer is written in Figma; the others follow the comparison table and payment policy above.
export const FAQ = [
  {
    q: 'Hết credit giữa tháng thì sao?',
    a: 'Bạn vẫn đăng nhập và xem lại lịch sử bình thường. Để tiếp tục hỏi, bạn có thể mua thêm credit (gói Plus, Pro) hoặc nâng cấp gói. Gói Free sẽ được làm mới vào đầu chu kỳ tiếp theo.',
  },
  {
    q: 'Credit chưa dùng hết có được cộng dồn không?',
    a: 'Với gói Pro, credit chưa dùng được cộng dồn sang tháng sau, tối đa 500 credit. Gói Free và Plus được làm mới về hạn mức gốc mỗi chu kỳ. Credit mua thêm có hạn sử dụng 12 tháng.',
  },
  {
    q: 'Tôi có thể đổi gói giữa chu kỳ không?',
    a: 'Có. Nâng cấp có hiệu lực ngay, phần chênh lệch được tính theo số ngày còn lại. Hạ gói có hiệu lực từ chu kỳ tiếp theo.',
  },
  {
    q: 'Tài khoản cá nhân có dùng chung được với tài khoản trường/tổ chức không?',
    a: 'Tài khoản cá nhân và tài khoản Tổ chức được quản lý riêng. Nếu trường của bạn dùng gói Tổ chức, quản trị viên sẽ mời bạn vào không gian của trường bằng email.',
  },
  {
    q: 'Làm sao để xuất hoá đơn VAT?',
    a: 'Gói Plus và Pro có thể xuất hoá đơn VAT cho từng giao dịch trong mục Lịch sử & Thanh toán.',
  },
];
