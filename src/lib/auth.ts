export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("auth") === "true"
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth")
  }
}
