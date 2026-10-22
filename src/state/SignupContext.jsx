import { createContext, useContext, useMemo, useState } from 'react';

const SignupContext = createContext(null);

const EMPTY_PERSONAL = {
  email: '',
  fullName: '',
  role: '',
  school: '',
  birthYear: '',
  acceptTerms: false,
  marketing: false,
  interests: [],
  registered: false,
};

// Fields of the signed-in demo account that are remembered across reloads.
const SAVED_FIELDS = ['email', 'fullName', 'role', 'school', 'birthYear', 'interests', 'registered'];

const EMPTY_ORG = {
  legalName: '',
  displayName: '',
  orgType: '',
  country: '',
  domain: '',
  website: '',
  contactName: '',
  position: '',
  contactEmail: '',
  phone: '',
  applicationId: '',
};

// Demo "signed-in" account, kept in localStorage so it survives a page reload. No backend yet.
const ACCOUNT_KEY = 'deepedu.demoAccount';

function loadAccount() {
  try {
    const saved = JSON.parse(localStorage.getItem(ACCOUNT_KEY));
    return saved?.registered ? { ...EMPTY_PERSONAL, ...saved } : EMPTY_PERSONAL;
  } catch {
    return EMPTY_PERSONAL;
  }
}

function saveAccount(p) {
  try {
    if (p.registered) {
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(Object.fromEntries(SAVED_FIELDS.map((k) => [k, p[k]]))));
    } else {
      localStorage.removeItem(ACCOUNT_KEY);
    }
  } catch {
    /* storage unavailable: demo login just won't persist */
  }
}

/** Holds in-progress sign-up data so each step page can read/write it. No backend yet. */
export function SignupProvider({ children }) {
  const [personal, setPersonal] = useState(loadAccount);
  const [org, setOrg] = useState(EMPTY_ORG);

  const value = useMemo(
    () => ({
      personal,
      updatePersonal: (patch) =>
        setPersonal((p) => {
          const next = { ...p, ...patch };
          saveAccount(next);
          return next;
        }),
      resetPersonal: () => {
        saveAccount(EMPTY_PERSONAL);
        setPersonal(EMPTY_PERSONAL);
      },
      org,
      updateOrg: (patch) => setOrg((o) => ({ ...o, ...patch })),
      resetOrg: () => setOrg(EMPTY_ORG),
    }),
    [personal, org],
  );

  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>;
}

export function useSignup() {
  const ctx = useContext(SignupContext);
  if (!ctx) throw new Error('useSignup must be used inside <SignupProvider>');
  return ctx;
}

export const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
