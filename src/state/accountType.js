// Account type is chosen on the login screen ("Cá nhân" / "Tổ chức"); the email domain no longer decides it.

export const ACCOUNT_ROLES = [
  { id: 'personal', label: 'Cá nhân', icon: '/assets/auth/ic-user.svg' },
  { id: 'org', label: 'Tổ chức', icon: '/assets/auth/ic-briefcase.svg' },
];

/** "org" or "personal" (anything else falls back to personal). */
export const normalizeAccountType = (type) => (type === 'org' ? 'org' : 'personal');

// Demo organization for organization accounts (sample data from the "Dashboard - org" design).
export const DEMO_ORG = { name: 'Trường THCS Ba Đình', code: 'DEEPEDU-2026-0022' };
