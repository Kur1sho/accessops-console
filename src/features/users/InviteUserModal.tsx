import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { inviteUser } from "../../api/invite";
import type { UsersQuery, UsersResponse } from "../../types/users";
import { useAuth } from "../../app/auth/AuthContext";

const schema = z.object({
  email: z.string().email("Enter a valid email."),
  name: z.string().min(2, "Name is required."),
});

type Values = z.infer<typeof schema>;

export function InviteUserModal({
  open,
  onClose,
  currentQuery,
}: {
  open: boolean;
  onClose: () => void;
  currentQuery: UsersQuery;
}) {
  const qc = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const { session } = useAuth();
  const actorEmail = session?.user.email ?? "unknown";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit(values: Values) {
    setServerError(null);

    try {
      const newUser = await inviteUser({ ...values, actorEmail });

      qc.setQueryData<UsersResponse | undefined>(["users", currentQuery], (old) => {
        if (!old) return old;
        return {
          ...old,
          items: [newUser, ...old.items],
          total: old.total + 1,
        };
      });

      await qc.invalidateQueries({ queryKey: ["users"] });

      reset();
      onClose();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Invite failed.");
    }
  }

  return (
    <Modal
      title="Invite User"
      open={open}
      onClose={() => {
        reset();
        setServerError(null);
        onClose();
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: 12 }}>
        <Input
          label="Email"
          placeholder="new.user@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Name"
          placeholder="New User"
          error={errors.name?.message}
          {...register("name")}
        />

        {serverError && <div style={{ color: "#fca5a5", fontWeight: 900 }}>{serverError}</div>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              reset();
              setServerError(null);
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Inviting..." : "Send Invite"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}