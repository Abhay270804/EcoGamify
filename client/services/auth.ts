import type { EducationLevel } from "@/components/LevelSelector";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  educationLevel: EducationLevel;
  role?: "user" | "admin";
};

const USERS_KEY = "ecolearn_users";
const CURRENT_KEY = "ecolearn_current_user";

function loadUsers(): Record<string, User> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveUsers(users: Record<string, User>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  const id = localStorage.getItem(CURRENT_KEY);
  if (!id) return null;
  const users = loadUsers();
  return users[id] || null;
}

export function onAuthChange(cb: (u: User | null) => void) {
  const handler = () => cb(getCurrentUser());
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

function hash(pw: string) {
  try {
    return btoa(pw);
  } catch {
    return pw;
  }
}

export function register(
  name: string,
  email: string,
  password: string,
  educationLevel: EducationLevel,
): { ok: boolean; message?: string } {
  const users = loadUsers();
  const exists = Object.values(users).some(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );
  if (exists) return { ok: false, message: "Email already registered" };
  const id = cryptoRandomId();
  const user: User = {
    id,
    name,
    email,
    passwordHash: hash(password),
    educationLevel,
  };
  users[id] = user;
  saveUsers(users);
  localStorage.setItem(CURRENT_KEY, id);
  return { ok: true };
}

const DEFAULT_ADMIN_EMAIL = "admin@ecolearn.app";
const DEFAULT_ADMIN_PASS = "admin123";

function ensureAdmin() {
  const users = loadUsers();
  const existing = Object.values(users).find((u) => u.role === "admin");
  if (!existing) {
    const id = cryptoRandomId();
    users[id] = {
      id,
      name: "Admin",
      email: DEFAULT_ADMIN_EMAIL,
      passwordHash: hash(DEFAULT_ADMIN_PASS),
      educationLevel: "college" as EducationLevel,
      role: "admin",
    };
    saveUsers(users);
  }
}

export function login(
  email: string,
  password: string,
): { ok: boolean; message?: string } {
  ensureAdmin();
  const users = loadUsers();
  const user = Object.values(users).find(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );
  if (!user) return { ok: false, message: "User not found" };
  if (user.passwordHash !== hash(password))
    return { ok: false, message: "Invalid credentials" };
  localStorage.setItem(CURRENT_KEY, user.id);
  return { ok: true };
}

export function isAdmin() {
  return getCurrentUser()?.role === "admin";
}

export function logout() {
  localStorage.removeItem(CURRENT_KEY);
}

export function updateEducationLevel(level: EducationLevel) {
  const users = loadUsers();
  const current = getCurrentUser();
  if (!current) return;
  users[current.id] = { ...current, educationLevel: level };
  saveUsers(users);
}

export function listUsers(): User[] {
  return Object.values(loadUsers());
}

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto)
    return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
