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
  registered: false,
};

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

/** Holds in-progress sign-up data so each step page can read/write it. No backend yet. */
export function SignupProvider({ children }) {
  const [personal, setPersonal] = useState(EMPTY_PERSONAL);
  const [org, setOrg] = useState(EMPTY_ORG);

  const value = useMemo(
    () => ({
      personal,
      updatePersonal: (patch) => setPersonal((p) => ({ ...p, ...patch })),
      resetPersonal: () => setPersonal(EMPTY_PERSONAL),
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
