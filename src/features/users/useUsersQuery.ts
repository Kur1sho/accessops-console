import { useQuery } from "@tanstack/react-query";
import type { UsersQuery, UsersResponse } from "../../types/users";
import { fetchUsers } from "../../api/users";

export function useUsersQuery(q: UsersQuery) {
  return useQuery<UsersResponse>({
    queryKey: ["users", q],
    queryFn: () => fetchUsers(q),
    placeholderData: (prev) => prev,
    staleTime: 5_000,
  });
}