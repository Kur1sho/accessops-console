export type UserRole = "admin" | "viewer";
export type UserStatus = "active" | "invited" | "suspended";

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};

export type UsersQuery = {
  q?: string;
  role?: "all" | UserRole;
  status?: "all" | UserStatus;
  sortBy?: "createdAt" | "email" | "name" | "role";
  sortDir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export type UsersResponse = {
  items: User[];
  total: number;
};