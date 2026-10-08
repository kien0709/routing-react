import { Button, CloseButton, Dialog, Field, Input, NativeSelect, Portal, Stack } from "@chakra-ui/react";
import { useState } from "react";
import type { FormEvent } from "react";
import type { ManagedUser, UserInput } from "../../api/users";

// popup om een gebruiker aan te maken of te bewerken alleen admin
interface UserDialogProps {
  open: boolean;
  user: ManagedUser | null;
  loading?: boolean;
  onSubmit: (input: UserInput) => void;
  onClose: () => void;
}

const emptyForm: UserInput = { display_name: "", email: "", password: "", role: "user" };

export default function UserDialog({ open, user, loading, onSubmit, onClose }: UserDialogProps) {
  // de parent geeft een key mee dus bij een andere gebruiker start het formulier opnieuw
  const [form, setForm] = useState<UserInput>(
    user ? { display_name: user.display_name, email: user.email, password: "", role: user.role } : emptyForm,
  );
  const isEditing = user !== null;

  const update = (field: keyof UserInput, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const passwordTooShort = !!form.password && form.password.length < 6;
  const canSubmit = form.email.trim() && (isEditing || form.password) && !passwordTooShort;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    const input: UserInput = { ...form, email: form.email.trim(), display_name: form.display_name.trim() };
    // leeg wachtwoord bij bewerken betekent wachtwoord niet aanpassen
    if (!input.password) delete input.password;
    onSubmit(input);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
      placement="center"
      size={{ base: "xs", md: "md" }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="20px">
            <form onSubmit={handleSubmit}>
              <Dialog.Header>
                <Dialog.Title>{isEditing ? "Edit user" : "Add user"}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap={5}>
                  <Field.Root>
                    <Field.Label>Name</Field.Label>
                    <Input
                      borderRadius="10px"
                      onChange={(e) => update("display_name", e.target.value)}
                      placeholder="Full name"
                      value={form.display_name}
                    />
                  </Field.Root>
                  <Field.Root required>
                    <Field.Label>
                      Email <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                      borderRadius="10px"
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="name@example.com"
                      type="email"
                      value={form.email}
                    />
                  </Field.Root>
                  <Field.Root invalid={passwordTooShort} required={!isEditing}>
                    <Field.Label>
                      Password {!isEditing && <Field.RequiredIndicator />}
                    </Field.Label>
                    <Input
                      autoComplete="new-password"
                      borderRadius="10px"
                      onChange={(e) => update("password", e.target.value)}
                      placeholder={isEditing ? "Leave empty to keep current password" : "At least 6 characters"}
                      type="password"
                      value={form.password}
                    />
                    <Field.ErrorText>Password must be at least 6 characters.</Field.ErrorText>
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Role</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        borderRadius="10px"
                        onChange={(e) => update("role", e.target.value)}
                        value={form.role}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Field.Root>
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button borderRadius="10px" onClick={onClose} type="button" variant="outline">
                  Cancel
                </Button>
                <Button
                  bg="var(--color-primary)"
                  borderRadius="10px"
                  color="white"
                  disabled={!canSubmit}
                  loading={loading}
                  type="submit"
                  _hover={{ bg: "var(--color-primary-hover)" }}
                >
                  {isEditing ? "Save" : "Add user"}
                </Button>
              </Dialog.Footer>
            </form>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
