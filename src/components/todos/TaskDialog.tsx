import { Button, Checkbox, CloseButton, Dialog, Field, Input, Portal, Stack } from "@chakra-ui/react";
import { useState } from "react";
import type { FormEvent } from "react";
import type { TodoItem, TodoItemInput } from "../../api/todos";
import type { UserOption } from "../../api/users";
import AssigneeSelect from "./AssigneeSelect";

// popup om een taak te bewerken met titel toegewezen persoon en klaar
interface TaskDialogProps {
  task: TodoItem | null;
  users: UserOption[];
  loading?: boolean;
  onSubmit: (input: TodoItemInput) => void;
  onClose: () => void;
}

export default function TaskDialog({ task, users, loading, onSubmit, onClose }: TaskDialogProps) {
  // de parent geeft een key mee dus bij een andere taak start het formulier opnieuw
  const [title, setTitle] = useState(task?.title ?? "");
  const [assignedTo, setAssignedTo] = useState<number | null>(task?.assigned_to ?? null);
  const [completed, setCompleted] = useState(task?.completed ?? false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim()) onSubmit({ title: title.trim(), assigned_to: assignedTo, completed });
  };

  return (
    <Dialog.Root
      open={task !== null}
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
                <Dialog.Title>Edit task</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap={5}>
                  <Field.Root required>
                    <Field.Label>Title</Field.Label>
                    <Input borderRadius="10px" onChange={(e) => setTitle(e.target.value)} value={title} />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Assigned to</Field.Label>
                    <AssigneeSelect onChange={setAssignedTo} users={users} value={assignedTo} />
                  </Field.Root>
                  <Checkbox.Root
                    checked={completed}
                    colorPalette="purple"
                    onCheckedChange={(e) => setCompleted(e.checked === true)}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>Completed</Checkbox.Label>
                  </Checkbox.Root>
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
                  disabled={!title.trim()}
                  loading={loading}
                  type="submit"
                  _hover={{ bg: "var(--color-primary-hover)" }}
                >
                  Save
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
