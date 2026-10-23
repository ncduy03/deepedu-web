// Demo data for the personal account console (Figma "Quản lý tài khoản – Cá nhân"). No backend yet.

export const PERIODS = [
  { id: 'today', label: 'Hôm nay', days: 1 },
  { id: '7d', label: '7 ngày', days: 8 },
  { id: '30d', label: '30 ngày', days: 30 },
  { id: 'month', label: 'Tháng này' },
  { id: 'custom', label: 'Tuỳ chỉnh', icon: 'ic-calendar', soon: true },
];

// Demo "today": the usage data below ends here, so the dashboard looks the same whenever it is opened.
export const USAGE_TODAY = new Date(2026, 9, 23);

const day = (req, input, output, credit) => ({ req, input, output, credit });
const NONE = day(0, 0, 0, 0);

// Daily usage per task type, keyed "dd/mm" (2026). Days not listed had no activity.
// 16/10 → 23/10 matches the Figma "7 ngày" frames: 46 requests, 1.2M tokens (1.1M in / 96.4K out), 180 credit.
const USAGE = {
  '24/09': { chat: day(6, 118000, 9200, 16), image: NONE },
  '26/09': { chat: day(4, 82000, 6100, 11), image: day(2, 41000, 5200, 8) },
  '29/09': { chat: day(9, 176000, 14800, 26), image: NONE },
  '30/09': { chat: day(3, 52000, 4000, 7), image: day(1, 22000, 2600, 4) },
  '20/10': { chat: day(21, 449000, 31200, 60), image: NONE },
  '21/10': { chat: day(5, 224000, 14000, 40), image: NONE },
  '22/10': { chat: day(13, 300000, 30000, 54), image: day(7, 165000, 21200, 26) },
};

// Share of tokens served by Google models (the rest is OpenAI).
export const GOOGLE_SHARE = 0.03;

const pad = (n) => String(n).padStart(2, '0');

/** Daily usage rows for a period, oldest first, with zero rows for quiet days. */
export function usageFor(periodId) {
  const period = PERIODS.find((p) => p.id === periodId);
  const count = period.days ?? USAGE_TODAY.getDate(); // "Tháng này" = 1st of the month → today
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(USAGE_TODAY);
    d.setDate(d.getDate() - (count - 1 - i));
    const key = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
    const u = USAGE[key] || { chat: NONE, image: NONE };
    return { label: `${d.getDate()}/${d.getMonth() + 1}`, ...u };
  });
}

// ---------- Plans ----------
export const PLANS = [
  { id: 'free', name: 'Free', price: '0đ / Miễn phí', credit: '100 credit', label: 'Free' },
  { id: 'plus', popular: true, name: 'Plus', price: '79.000đ / tháng', credit: '500 credit', label: 'Plus · 79.000đ / tháng' },
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
      { label: 'Soạn giáo án', plans: ['free', 'plus', 'pro', 'pro-year'] },
      { label: 'Tạo bài tập', plans: ['plus', 'pro', 'pro-year'] },
      { label: 'Tạo bản trình chiếu', plans: ['pro', 'pro-year'] },
    ],
  },
];

// ---------- Transactions ----------
const card = { brand: 'visa', label: '•••• 4242' };
const link = { brand: 'visa', label: 'link' };
const momo = { label: 'Ví MoMo' };
const zalo = { label: 'ZaloPay' };
const plus = 'Gói Plus · 500 credit';
const topup = '+ 200 credit';

// [date "dd/mm/yyyy hh:mm", id, amount, credit received, method, status]
const ROWS = [
  ['21/10/2026 15:45', 'TOPUP-20261021-2210', '49.000đ', topup, link, 'success'],
  ['01/10/2026 09:12', 'SUB-20261001-0417', '79.000đ', plus, card, 'success'],
  ['18/09/2026 21:40', 'TOPUP-20260918-2210', '49.000đ', topup, momo, 'success'],
  ['01/09/2026 09:10', 'SUB-20260901-0398', '79.000đ', plus, card, 'success'],
  ['01/08/2026 09:05', 'SUB-20260801-0371', '79.000đ', plus, card, 'success'],
  ['12/07/2026 15:22', 'TOPUP-20260712-1876', '49.000đ', topup, zalo, 'success'],
  ['01/07/2026 09:02', 'SUB-20260701-0345', '79.000đ', plus, card, 'success'],
  ['01/06/2026 08:58', 'SUB-20260601-0312', '79.000đ', plus, card, 'success'],
  ['20/05/2026 14:31', 'TOPUP-20260520-1702', '49.000đ', topup, momo, 'success'],
  ['01/05/2026 09:01', 'SUB-20260501-0289', '79.000đ', plus, card, 'success'],
  ['01/04/2026 09:03', 'SUB-20260401-0263', '79.000đ', plus, card, 'success'],
  ['28/03/2026 19:47', 'TOPUP-20260328-1544', '49.000đ', topup, zalo, 'failed'],
  ['01/03/2026 08:55', 'SUB-20260301-0240', '79.000đ', plus, card, 'success'],
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
  { id: '7d', label: '7 Ngày', days: 7 },
  { id: '30d', label: '30 Ngày', days: 30 },
  { id: '3m', label: '3 tháng', days: 91 },
  { id: '12m', label: '12 tháng', days: 365 },
  { id: 'all', label: 'Tất cả', days: null },
];

// ---------- Payment methods ----------
export const CARD = { last4: '4242', holder: 'NGUYEN VAN MINH', expiry: '12/27' };
