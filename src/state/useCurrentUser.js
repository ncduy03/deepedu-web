import { useSignup } from './SignupContext.jsx';

/** The signed-in demo account as { name, email, initial }, or null for guests. */
export function useCurrentUser() {
  const { personal } = useSignup();
  if (!personal.registered) return null;
  const name = personal.fullName || personal.email.split('@')[0];
  return {
    name,
    email: personal.email,
    initial: (personal.fullName || personal.email).trim()[0].toUpperCase(),
  };
}
