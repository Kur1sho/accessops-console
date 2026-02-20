import { useQuery } from "@tanstack/react-query";
import type { UsersQuery } from "../../types/users";
import { fetchUsers } from "../../api/users";

export function useUsersQuery(q: UsersQuery) {
  return useQuery({
    queryKey: ["users", q],
    queryFn: () => fetchUsers(q),
    staleTime: 15_000,
    keepPreviousData: true,
  });
}