import { useQuery } from "@tanstack/react-query";
import type { Policy } from "../../types/policies";
import { fetchPolicies } from "../../api/policies";

export function usePoliciesQuery() {
  return useQuery<Policy[]>({
    queryKey: ["policies"],
    queryFn: fetchPolicies,
    staleTime: 10_000,
  });
}