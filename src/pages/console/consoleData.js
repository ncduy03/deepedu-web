// Demo data for the personal account console (Figma "Quản lý tài khoản – Cá nhân"). No backend yet.

export const PERIODS = [
  { id: 'today', label: 'Hôm nay' },
  { id: '7d', label: '7 ngày' },
  { id: '30d', label: '30 ngày' },
  { id: 'month', label: 'Tháng này' },
  { id: 'custom', label: 'Tuỳ chỉnh', icon: 'ic-calendar' },
];

// Metric cards per period. "Hôm nay" uses the Figma values.
export const METRICS = {
  today: { used: '180 credit', left: '320 / 500', chats: '46', files: '12' },
  '7d': { used: '142 credit', left: '320 / 500', chats: '31', files: '8' },
  '30d': { used: '410 credit', left: '320 / 500', chats: '118', files: '27' },
  month: { used: '180 credit', left: '320 / 500', chats: '46', files: '12' },
  custom: { used: '180 credit', left: '320 / 500', chats: '46', files: '12' },
};

export const METRIC_CARDS = [
  { key: 'used', label: 'Credit đã dùng', icon: 'ic-percent-circle' },
  { key: 'left', label: 'Credit còn lại', icon: 'ic-cpu' },
  { key: 'chats', label: 'Cuộc trò chuyện', icon: 'ic-coins' },
  { key: 'files', label: 'Tệp đã tải lên', icon: 'ic-dollar-receive' },
];

// Daily credit use per AI provider. x runs 0…993 across 15/7 → 5/8 (chart width in Figma), y is credits (0–40).
export const CHART_SERIES = [
  {
    id: 'google',
    label: 'Google',
    color: 'var(--ui-bg-fill-primary)',
    points: [[0, 37.5], [40, 38.8], [66, 37], [105, 38.1], [193, 31.5], [326, 37.5], [417, 31.5], [490, 30.8], [551, 34.1], [649, 34.1], [746, 33.5], [802, 32.2], [894, 35.3], [958, 32.3], [995, 32.3]],
  },
  {
    id: 'openai',
    label: 'OpenAI',
    color: 'var(--ui-display-blue)',
    points: [[5, 23.8], [39, 23.8], [116, 22.2], [187, 26], [212, 24.6], [449, 23.9], [500, 28.2], [571, 27.4], [664, 22.3], [776, 28.2], [827, 28.2], [900, 22.3], [923, 23.8], [955, 22.2], [995, 23.8]],
  },
  {
    id: 'anthropic',
    label: 'Anthropic',
    color: 'var(--ui-content-strong)',
    points: [[2, 17.6], [226, 17.6], [257, 18.9], [306, 17.1], [405, 18.7], [526, 19.7], [632, 16.6], [758, 18.1], [862, 19.2], [995, 16.6]],
  },
];

export const CHART_DAYS = ['15/7', '18/7', '21/7', '24/7', '27/7', '30/7', '2/8', '5/8'];

// ---------- Plans ----------
export const PLANS = [
  { id: 'free', name: 'Free', price: '0đ / Miễn phí', credit: '100 credit', label: 'Free' },
  { id: 'plus', name: 'Plus', price: '79.000đ / tháng', credit: '500 credit', label: 'Plus · 79.000đ / tháng' },
  { id: 'pro', name: 'Pro', price: '199.000đ / tháng', credit: '1.500 credit', label: 'Pro · 199.000đ / tháng' },
  { id: 'pro-year', name: 'Pro (năm)', price: '1.990.000đ / năm', credit: '1.500 credit / tháng', label: 'Pro · 1.990.000đ / năm' },
];

// Feature rows of the comparison table; `plans` lists which plans include it.
export const PLAN_SECTIONS = [
  {
    title: 'Chi phí & Hạn mức Credit (DeepEdu)',
    rows: [
      { label: 'Giá dịch vụ', value: (p) => p.price },
      { label: 'Credit hàng tháng', value: (p) => p.credit },
    ],
  },
  {
    title: 'Tính năng cốt lõi',
    rows: [
      { label: 'Trợ lý DeepEdu (chat)', plans: ['free', 'plus', 'pro', 'pro-year'] },
      { label: 'Tải tệp & phân tích tài liệu', plans: ['free', 'plus', 'pro', 'pro-year'] },
      { label: 'Tạo ảnh bằng AI', plans: ['plus', 'pro', 'pro-year'] },
      { label: 'Mô hình AI nâng cao', plans: ['pro', 'pro-year'] },
    ],
  },
];

// ---------- Transactions ----------
const visa = { brand: 'visa', label: 'Visa****4242' };
const momo = { label: 'Ví MoMo' };
const zalo = { label: 'ZaloPay' };
const plus = 'Gói Plus · 1 tháng';
const topup = '+ 200 credit';

// [date "dd/mm/yyyy hh:mm", id, amount, content, method, status]
const ROWS = [
  ['01/10/2026 09:12', 'SUB-20261001-0417', '79.000đ', plus, visa, 'success'],
  ['18/09/2026 21:40', 'TOPUP-20260918-2210', '49.000đ', topup, momo, 'success'],
  ['01/09/2026 09:10', 'SUB-20260901-0398', '79.000đ', plus, visa, 'success'],
  ['01/08/2026 09:05', 'SUB-20260801-0371', '79.000đ', plus, visa, 'success'],
  ['12/07/2026 15:22', 'TOPUP-20260712-1876', '49.000đ', topup, zalo, 'success'],
  ['01/07/2026 09:02', 'SUB-20260701-0345', '79.000đ', plus, visa, 'success'],
  ['01/06/2026 08:58', 'SUB-20260601-0312', '79.000đ', plus, visa, 'success'],
  ['20/05/2026 14:31', 'TOPUP-20260520-1702', '49.000đ', topup, momo, 'success'],
  ['01/05/2026 09:01', 'SUB-20260501-0289', '79.000đ', plus, visa, 'success'],
  ['01/04/2026 09:03', 'SUB-20260401-0263', '79.000đ', plus, visa, 'success'],
  ['28/03/2026 19:47', 'TOPUP-20260328-1544', '49.000đ', topup, zalo, 'failed'],
  ['01/03/2026 08:55', 'SUB-20260301-0240', '79.000đ', plus, visa, 'success'],
  ['01/02/2026 09:07', 'SUB-20260201-0218', '79.000đ', plus, visa, 'success'],
  ['15/01/2026 10:12', 'TOPUP-20260115-1390', '99.000đ', '+ 500 credit', momo, 'success'],
  ['01/01/2026 09:00', 'SUB-20260101-0197', '79.000đ', plus, visa, 'success'],
  ['01/12/2025 09:04', 'SUB-20251201-0176', '79.000đ', plus, visa, 'success'],
  ['01/11/2025 09:06', 'SUB-20251101-0158', '79.000đ', plus, visa, 'success'],
];

function parseDate(s) {
  const [d, m, rest] = s.split('/');
  const [y, time] = rest.split(' ');
  const [hh, mm] = time.split(':');
  return new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm));
}

export const TRANSACTIONS = ROWS.map(([time, id, amount, content, method, status]) => ({
  time,
  date: parseDate(time),
  id,
  amount,
  content,
  method,
  status,
}));

export const STATUS = {
  success: 'Thành công',
  failed: 'Thất bại',
};

export const RANGES = [
  { id: '3', label: '3 tháng', months: 3 },
  { id: '6', label: '6 tháng', months: 6 },
  { id: '12', label: '12 tháng', months: 12 },
  { id: 'all', label: 'Tất cả', months: null },
];

// ---------- Payment methods ----------
export const CARD = { last4: '4242', holder: 'NGUYEN VAN MINH', expiry: '08/28' };

export const WALLETS = [
  { id: 'momo', name: 'Ví MoMo', short: 'MoMo', color: '#a50064', phone: '090****567' },
  { id: 'zalopay', name: 'ZaloPay', short: 'Zalo', color: '#0069e0', phone: '090****567' },
];
