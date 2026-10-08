import { Button, CloseButton, Dialog, Portal, Text } from "@chakra-ui/react";

// popup die vraagt weet je het zeker voor het verwijderen
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

// https://chakra-ui.com/docs/components/dialog
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  loading,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
      placement="center"
      role="alertdialog"
      size={{ base: "xs", md: "sm" }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="20px">
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text color="fg.muted">{description}</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button borderRadius="10px" onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button borderRadius="10px" colorPalette="red" loading={loading} onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
