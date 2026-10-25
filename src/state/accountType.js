// Temporary demo rule: the email domain decides the account type.
// Free webmail (gmail.com, …) → personal account; any other domain (e.g. sotatek.com) → organization.

const PERSONAL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.com.vn',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'icloud.com',
]);

const domainOf = (email) => String(email).trim().toLowerCase().split('@')[1] || '';

/** "personal" for free webmail addresses, "org" for company domains. */
export function accountTypeFor(email) {
  const domain = domainOf(email);
  return !domain || PERSONAL_DOMAINS.has(domain) ? 'personal' : 'org';
}

// Demo organization shown for company emails (sample data from the "Dashboard - org" design).
export const DEMO_ORG = { name: 'Trường THCS Ba Đình', code: 'DEEPEDU-2026-0022' };
