export const SESSION_EXPIRED_EVENT = "athlete-tracker:session-expired";

export function emitSessionExpired() {
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
}
