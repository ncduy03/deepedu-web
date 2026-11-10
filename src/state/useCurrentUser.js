import { useSignup } from './SignupContext.jsx';
import { DEMO_ORG, normalizeAccountType } from './accountType.js';

/**
 * The signed-in demo account as { name, email, initial, type, org }, or null for guests.
 * `type` is "personal" or "org" (the role picked at login); `org` is set for organization accounts.
 */
export function useCurrentUser() {
  const { personal } = useSignup();
  if (!personal.registered) return null;
  const name = personal.fullName || personal.email.split('@')[0];
  const type = normalizeAccountType(personal.accountType);
  return {
    name,
    email: personal.email,
    initial: (personal.fullName || personal.email).trim()[0].toUpperCase(),
    type,
    org: type === 'org' ? DEMO_ORG : null,
  };
}
