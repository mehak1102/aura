/** Legacy — admin auth is cookie-only; clear any leftover JWT. */
export function getStoredToken() {
  return null
}

export function setStoredToken(_token: string | null) {
  localStorage.removeItem('aura_admin_token')
}
