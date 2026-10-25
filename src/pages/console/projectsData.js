import { useMemo, useState } from 'react';

/** Demo data and state for "Quản lý dự án" (Figma "Quản lý dự án"). Everything lives in memory. */

export const PICON = (name) => `/assets/projects/${name}.svg`;

export const PROJECT_STATUS = { active: 'Hoạt động', paused: 'Tạm dừng' };

export const PROJECT_FILTERS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'active', label: 'Hoạt động' },
  { id: 'paused', label: 'Tạm dừng' },
];

/** 1234567 → "1.2M", 350000 → "350K", 59 → "59". */
export function formatCount(n) {
  const short = (v, unit) => `${Number(v.toFixed(1))}${unit}`;
  if (n >= 1e6) return short(n / 1e6, 'M');
  if (n >= 1e4) return short(n / 1e3, 'K');
  return n.toLocaleString('vi-VN');
}

const pad = (n) => String(n).padStart(2, '0');
const today = () => {
  const d = new Date();
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const ALPHANUM = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const randomChars = (n, chars = ALPHANUM) =>
  Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

/** Full secret, shown once after creating or regenerating a key. */
const newSecret = () => `sk-deepedu-${randomChars(40, 'abcdefghijklmnopqrstuvwxyz0123456789')}`;

const person = (email, name = email.split('@')[0]) => ({ email, name });

// Members of the demo organization; the signed-in user is added as the owner of every project.
const P = {
  duy5: person('duy.nguyen19+5@sotatek.com'),
  anh30: person('anh.do2+30@sotatek.com'),
  tuan: person('tuan.le@sotatek.com'),
  anh: person('anh.do2@sotatek.com', 'Ngọc Ánh NEW'),
  anh1: person('anh.do2+1@sotatek.com'),
};
const TEAM = [
  'minh.tran', 'hoa.pham', 'khanh.vu', 'lan.nguyen', 'quang.do', 'thu.ha',
  'son.bui', 'mai.dang', 'phuc.ly', 'trang.vo', 'long.hoang',
].map((u) => person(`${u}@sotatek.com`));
const EXTRA = ['nam.trinh', 'ngoc.cao', 'vy.lam'].map((u) => person(`${u}@sotatek.com`));

const member = (p, joined, { role = 'admin', active = true } = {}) => ({ ...p, joined, role, active });

const key = (id, name, created, { lastUsed = null, requests = 0, tokens = 0, credits = 0, active = true } = {}) => ({
  id,
  name,
  created,
  lastUsed,
  requests,
  tokens,
  credits,
  active,
});

/** One used key per simple project, so the token totals add up to the design's 17.2M. */
const simpleProject = (code, n, created, tokens, members = [], status = 'active') => ({
  id: `PJ_DEEPEDU-2026-0022_${code}`,
  name: `du an ${n}`,
  created,
  status,
  members: members.map((p) => member(p, created, { role: 'member' })),
  keys: [
    key(`${code}-1`, `du an ${n} - key 1`, created, {
      lastUsed: tokens ? '21/10/2026' : null,
      requests: Math.round(tokens / 95000),
      tokens,
      credits: Math.round(tokens / 22000),
    }),
  ],
});

function seedProjects() {
  return [
    {
      id: 'PJ_DEEPEDU-2026-0022_LX4T',
      name: 'KO XÓA - du an 12',
      created: '09/10/2026',
      status: 'active',
      members: [
        member(P.duy5, '22/10/2026', { active: false }),
        member(P.anh30, '22/10/2026'),
        member(P.tuan, '16/10/2026'),
        member(P.anh, '9/10/2026'),
        member(P.anh1, '13/10/2026', { role: 'member' }),
      ],
      keys: [
        key('LX4T-7', 'du an 12 - key 7', '22/10/2026', { lastUsed: '22/10/2026', requests: 7, tokens: 1_200_000, credits: 53 }),
        ...[6, 5, 4, 3, 2, 1].map((n) => key(`LX4T-${n}`, `du an 12 - key ${n}`, '22/10/2026')),
        key('LX4T-in', 'du an 12- key inactive', '20/10/2026', { active: false }),
        key('LX4T-ac', 'du an 12- key active', '20/10/2026', { lastUsed: '22/10/2026', requests: 59, tokens: 5_500_000, credits: 247 }),
      ],
    },
    simpleProject('SZ0Y', 11, '09/10/2026', 400_000),
    simpleProject('KAJE', 10, '09/10/2026', 300_000),
    simpleProject('FHI6', 9, '09/10/2026', 200_000),
    simpleProject('ID5J', 8, '09/10/2026', 200_000),
    simpleProject('QLZ7', 7, '09/10/2026', 2_300_000, [P.anh30]),
    simpleProject('WS2B', 6, '09/10/2026', 100_000),
    simpleProject('GAC0', 5, '09/10/2026', 100_000),
    simpleProject('0WYG', 4, '09/10/2026', 100_000),
    simpleProject('TWAH', 2, '09/10/2026', 6_100_000, TEAM),
    simpleProject('K8MR', 1, '08/10/2026', 700_000, EXTRA, 'paused'),
  ];
}

/**
 * Projects of the signed-in account. The user is the first admin of every project.
 * Returns the list plus actions used by the list / detail pages and their dialogs.
 */
export function useProjects(user) {
  const [projects, setProjects] = useState(seedProjects);

  return useMemo(() => {
    const owner = { email: user?.email || '', name: user?.name || '' };
    const list = projects.map((p) => ({
      ...p,
      members: [member(owner, p.created, { role: 'admin' }), ...p.members.filter((m) => m.email !== owner.email)],
    }));

    const update = (id, fn) => setProjects((all) => all.map((p) => (p.id === id ? fn(p) : p)));
    const updateKey = (pid, kid, fn) => update(pid, (p) => ({ ...p, keys: p.keys.map((k) => (k.id === kid ? fn(k) : k)) }));
    const updateMember = (pid, email, fn) =>
      update(pid, (p) => ({ ...p, members: p.members.map((m) => (m.email === email ? fn(m) : m)) }));

    return {
      list,
      get: (id) => list.find((p) => p.id === id),
      /** Distinct people across all projects. */
      memberCount: new Set(list.flatMap((p) => p.members.map((m) => m.email))).size,
      tokenCount: list.reduce((sum, p) => sum + p.keys.reduce((s, k) => s + k.tokens, 0), 0),

      create(name) {
        const id = `PJ_DEEPEDU-2026-${String(projects.length + 12).padStart(4, '0')}_${randomChars(4)}`;
        setProjects((all) => [{ id, name, created: today(), status: 'active', members: [], keys: [] }, ...all]);
        return id;
      },
      rename: (id, name) => update(id, (p) => ({ ...p, name })),
      setStatus: (id, status) => update(id, (p) => ({ ...p, status })),
      remove: (id) => setProjects((all) => all.filter((p) => p.id !== id)),

      /** Returns the new key's secret so it can be shown once. */
      addKey(pid, name) {
        const secret = newSecret();
        update(pid, (p) => ({ ...p, keys: [key(`${pid}-${Date.now()}`, name, today()), ...p.keys] }));
        return secret;
      },
      renameKey: (pid, kid, name) => updateKey(pid, kid, (k) => ({ ...k, name })),
      setKeyActive: (pid, kid, active) => updateKey(pid, kid, (k) => ({ ...k, active })),
      regenerateKey: () => newSecret(),
      removeKey: (pid, kid) => update(pid, (p) => ({ ...p, keys: p.keys.filter((k) => k.id !== kid) })),

      /** Adds a member (role "Thành viên"); returns false if the email is already in the project. */
      addMember(pid, email) {
        const project = list.find((p) => p.id === pid);
        if (!project || project.members.some((m) => m.email === email)) return false;
        update(pid, (p) => ({ ...p, members: [...p.members, member(person(email), today(), { role: 'member' })] }));
        return true;
      },
      setMemberActive: (pid, email, active) => updateMember(pid, email, (m) => ({ ...m, active })),
      removeMember: (pid, email) => update(pid, (p) => ({ ...p, members: p.members.filter((m) => m.email !== email) })),
    };
  }, [projects, user?.email, user?.name]);
}
