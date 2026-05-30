export const ONBOARDING_PROFILE_PATH = "/profile";

/**
 * Destino tras login/registro: perfil si falta completar, dashboard si no.
 */
export function getPostAuthNavigation(user, { from } = {}) {
  if (user?.profileCompleted) {
    return { pathname: "/", replace: true };
  }

  return {
    pathname: ONBOARDING_PROFILE_PATH,
    replace: true,
    state: { onboarding: true, from },
  };
}
