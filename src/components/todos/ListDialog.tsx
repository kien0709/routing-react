import { Button, CloseButton, Dialog, Field, Input, Portal } from "@chakra-ui/react";
import { useState } from "react";
import type { FormEvent } from "react";

// popup om een lijst aan te maken of te hernoemen
interface ListDialogProps {
  open: boolean;
  initialTitle?: string;
  loading?: boolean;
  onSubmit: (title: string) => void;
  onClose: () => void;
}

export default function ListDialog({ open, initialTitle = "", loading, onSubmit, onClose }: ListDialogProps) {
  const [title, setTitle] = useState(initialTitle);
  const isEditing = initialTitle !== "";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim()) onSubmit(title.trim());
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
      placement="center"
      size={{ base: "xs", md: "sm" }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="20px">
            <form onSubmit={handleSubmit}>
              <Dialog.Header>
                <Dialog.Title>{isEditing ? "Rename list" : "New list"}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Field.Root required>
                  <Field.Label>Title</Field.Label>
                  <Input
                    autoFocus
                    borderRadius="10px"
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Sprint planning"
                    value={title}
                  />
                </Field.Root>
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
                  {isEditing ? "Save" : "Create list"}
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
