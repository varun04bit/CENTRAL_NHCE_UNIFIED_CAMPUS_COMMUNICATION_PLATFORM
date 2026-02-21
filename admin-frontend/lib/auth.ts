export function saveToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("adminToken", token);
  }
}

export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("adminToken");
  }
  return null;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("adminToken");
  }
}