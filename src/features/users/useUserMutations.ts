import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "../../types/users";
import type { AuditAction } from "../../types/audit";
import { updateUser } from "../../api/userMutations";

export function useUpdateUserMutation(actorEmail: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: { user: User; action: AuditAction }) => {
      updateUser(input.user, actorEmail, input.action);
    },
    onSuccess: async () => {
      // Refresh all user list queries (any page/filter/sort)
      await qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}