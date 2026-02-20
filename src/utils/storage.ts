const KEY = "accessops.session";

export function saveSession(value: unknown) {
  localStorage.setItem(KEY, JSON.stringify(value));
}

export function loadSession<T>(): T | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(KEY);
}