import type { Role, Session } from "../types/auth";

type LoginInput = { email: string; password: string };

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function login(input: LoginInput): Promise<Session> {
  await sleep(600);

  // Simple demo rules (we’ll replace with MSW later if we want)
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!email.includes("@")) throw new Error("Please enter a valid email address.");
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");

  // Role demo: emails containing "admin" become admin
  const role: Role = email.includes("admin") ? "admin" : "viewer";

  return {
    user: { email, role },
    token: crypto.randomUUID(),
  };
}