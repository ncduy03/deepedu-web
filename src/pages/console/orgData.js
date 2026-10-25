// Demo data for the organization page "Tổ chức – Gói cước & credits". No backend yet.

export const OICON = (name) => `/assets/org/${name}.svg`;

export const ORG_PLAN = {
  name: 'School',
  limit: 2500, // credit per billing cycle
  cycle: { from: '15/10/2026', to: '15/11/2026' },
  used: 301, // plan credit used in this cycle
};

// Opening top-up balance (credit bought separately; never expires).
export const ORG_TOPUP = 200;

// "Mua thêm Credits nạp ví" packages.
export const TOPUP_PACKAGES = [
  { id: 'p100', price: '100.000đ', credits: 100 },
  { id: 'p500', price: '500.000đ', credits: 500 },
];

// Usage per API key id (ids from projectsData.js). Keys not listed: no usage, "Chưa truy cập".
// Totals match the design: 361 credit, 72 requests, 7,722,175 input / 239,653 output tokens.
export const KEY_STATS = {
  'LX4T-ac': { credits: 247, requests: 59, input: 5317172, output: 160259, lastUsed: '3 ngày trước' },
  'LX4T-7': { credits: 53, requests: 7, input: 1147549, output: 34628, lastUsed: '3 ngày trước' },
  'TWAH-1': { credits: 42, requests: 4, input: 870884, output: 30607, lastUsed: '16 ngày trước' },
  'QLZ7-1': { credits: 19, requests: 2, input: 386570, output: 14159, lastUsed: '25 ngày trước' },
};

// Who created each key; others were created by the signed-in admin. A missing name shows "—".
const CREATORS = {
  'LX4T-': { name: 'Ngọc Ánh NEW', email: 'anh.do2@sotatek.com' },
  'TWAH-1': { name: '', email: 'anh.do2+1@sotatek.com' },
};

export function creatorOf(keyId, owner) {
  const match = Object.entries(CREATORS).find(([prefix]) => keyId.startsWith(prefix));
  return match ? match[1] : owner;
}

export const KEY_STATUS_FILTERS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'active', label: 'Hoạt động' },
  { id: 'inactive', label: 'Vô hiệu hóa' },
];
