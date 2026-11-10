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

// Rate used in the design: $11.84 ≈ 300.721đ.
export const VND_PER_USD = 300721 / 11.84;

/** One API key's usage on one day. `google` = the part of the tokens served by Google models (rest is OpenAI). */
const use = (req, input, output, usd, google = { input: 0, output: 0 }) => ({ req, input, output, usd, google });

// Daily usage per API key (ids from projectsData.js), keyed "dd/mm" (2026). Days not listed had no activity.
// 16/10 → 23/10 matches the design's "7 ngày" sample: 66 requests, 6.7M tokens (6.5M in / 194.9K out),
// $11.84 ≈ 300.721đ; 20/10 = 37 requests, 2.7M tokens, $5.9; 22/10 = key active 13 + key 7 7 requests.
const KEY_USAGE = {
  '24/09': { 'TWAH-1': use(6, 118000, 9200, 0.98) },
  '26/09': { 'TWAH-1': use(4, 82000, 6100, 0.67), 'QLZ7-1': use(2, 41000, 5200, 0.49) },
  '29/09': { 'TWAH-1': use(9, 176000, 14800, 1.55) },
  '30/09': { 'QLZ7-1': use(4, 74000, 6600, 0.71) },
  '20/10': { 'LX4T-ac': use(37, 2661400, 78600, 5.9) },
  '21/10': { 'LX4T-ac': use(9, 1225800, 41200, 2.48, { input: 105100, output: 3000 }) },
  '22/10': { 'LX4T-ac': use(13, 1454900, 38100, 1.4), 'LX4T-7': use(7, 1163000, 37000, 2.06) },
};

const pad = (n) => String(n).padStart(2, '0');

/** Daily rows for a period, oldest first: { label: "20/10", keys: { [keyId]: usage } }; quiet days have no keys. */
export function usageFor(periodId) {
  const period = PERIODS.find((p) => p.id === periodId);
  const count = period.days ?? USAGE_TODAY.getDate(); // "Tháng này" = 1st of the month → today
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(USAGE_TODAY);
    d.setDate(d.getDate() - (count - 1 - i));
    const key = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
    return { label: `${d.getDate()}/${d.getMonth() + 1}`, keys: KEY_USAGE[key] || {} };
  });
}

// ---------- Plans ----------
// Plan cards come from the landing "Bảng giá" data (sections/pricingPlans.js), per account type.
export const DEFAULT_PLAN = { personal: 'maker', org: 'starter' };

// Current billing cycle (no auto-renewal: the user pays again before `renewOn`).
export const PLAN_CYCLE = { from: '01/10/26', to: '31/10/26', renewOn: '31/10/26', daysLeft: 5 };

// Credit wallet: balance = bought − used. Top-up credit never expires.
export const CREDITS = { bought: 10009000, used: 10000 };
export const VND_PER_CREDIT = 50;
export const TOPUP_PRESETS = [500, 1000, 5000, 10000];

// ---------- Recent requests ("Request gần đây") ----------
export const REQUEST_RANGES = [
  { id: '3d', label: '3 ngày', days: 3 },
  { id: '7d', label: '7 ngày', days: 7 },
  { id: '30d', label: '30 ngày', days: 30 },
];

// [days ago, time, task, status, credits]
const REQUEST_ROWS = [
  [0, '14:25', 'Soạn giáo án AI (CV 5512)', 'success', 15],
  [0, '11:02', 'Tạo đề kiểm tra 15 phút', 'success', 12],
  [1, '16:40', 'Tóm tắt chương 3 Kinh tế vi mô', 'success', 8],
  [1, '09:15', 'Soạn giáo án AI (CV 5512)', 'failed', 0],
  [2, '20:31', 'Tạo bản trình chiếu Quang hợp', 'success', 24],
  [2, '08:47', 'Chấm bài luận tiếng Anh', 'success', 10],
  [4, '14:05', 'Soạn giáo án AI (CV 5512)', 'success', 15],
  [5, '10:22', 'Tạo bài tập Hình học 9', 'success', 9],
  [6, '19:58', 'Kế hoạch ôn thi IELTS 6.5', 'success', 6],
  [9, '15:11', 'Tạo đề kiểm tra 1 tiết', 'success', 18],
  [12, '09:36', 'Soạn giáo án AI (CV 5512)', 'success', 15],
  [15, '21:03', 'Giải thích quá trình quang hợp', 'failed', 0],
  [19, '13:44', 'Tạo bản trình chiếu Lịch sử 11', 'success', 22],
  [23, '08:20', 'Tóm tắt sách giáo khoa Sinh 10', 'success', 11],
  [27, '17:52', 'Soạn giáo án AI (CV 5512)', 'success', 15],
];

const REQUEST_TODAY = new Date(2026, 10, 3);
const pad2 = (n) => String(n).padStart(2, '0');

export const REQUESTS = REQUEST_ROWS.map(([daysAgo, time, task, status, credits], i) => {
  const d = new Date(REQUEST_TODAY);
  d.setDate(d.getDate() - daysAgo);
  return {
    id: i,
    daysAgo,
    time: `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${time}`,
    task,
    status,
    credits,
    cost: credits * 500,
  };
});

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
