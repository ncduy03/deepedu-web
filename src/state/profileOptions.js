// Shared option lists for sign-up and the account profile.

export const ROLES = [
  { id: 'hoc-sinh', label: 'Học sinh', icon: 'ic-user' },
  { id: 'sinh-vien', label: 'Sinh viên', icon: 'ic-grad' },
  { id: 'giao-vien', label: 'Giáo viên / Giảng viên', icon: 'ic-message' },
  { id: 'nghien-cuu', label: 'Nghiên cứu viên', icon: 'ic-flask' },
  { id: 'di-lam', label: 'Người đi làm', icon: 'ic-briefcase' },
  { id: 'khac', label: 'Khác', icon: 'ic-sparkles-chip' },
];

export const roleLabel = (id) => ROLES.find((r) => r.id === id)?.label || '';

export const INTEREST_GROUPS = [
  { title: 'Nền tảng', items: ['Toán', 'Ngữ văn', 'Tiếng Anh'] },
  { title: 'Khoa học tự nhiên', items: ['Vật lý', 'Hoá học', 'Sinh học', 'Tin học'] },
  { title: 'Khoa học xã hội', items: ['Lịch sử', 'Địa lý', 'Kinh tế', 'Pháp luật'] },
  { title: 'Khác', items: ['Kỹ năng mềm', 'Ngoại ngữ khác', 'Nghệ thuật'] },
];
