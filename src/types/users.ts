export type UserRole = "admin" | "viewer";

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: "active" | "invited" | "suspended";
  createdAt: string; // ISO string
};

export type UsersQuery = {
  page: number;       // 1-based
  pageSize: number;   // 10, 20, 50
  search?: string;    // email/name substring
  role?: UserRole | "all";
  sortBy?: "createdAt" | "email" | "role";
  sortDir?: "asc" | "desc";
};

export type UsersResponse = {
  items: User[];
  total: number;
  page: number;
  pageSize: number;
};