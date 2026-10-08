  import { Button, Group } from "@chakra-ui/react";

export type ReviewView = "grid" | "list";

type ReviewViewToggleProps = {
  onChange: (view: ReviewView) => void;
  view: ReviewView;
};

export default function ReviewViewToggle({ onChange, view }: ReviewViewToggleProps) {
  return (
    <Group>
      <Button
        bg={view === "grid" ? "var(--color-primary)" : "bg.panel"}
        color={view === "grid" ? "white" : "fg"}
        onClick={() => onChange("grid")}
        size="sm"
        variant={view === "grid" ? "solid" : "outline"}
        _hover={{ bg: view === "grid" ? "var(--color-primary-hover)" : "bg.muted" }}
      >
        Grid View
      </Button>
      <Button
        bg={view === "list" ? "var(--color-primary)" : "bg.panel"}
        color={view === "list" ? "white" : "fg"}
        onClick={() => onChange("list")}
        size="sm"
        variant={view === "list" ? "solid" : "outline"}
        _hover={{ bg: view === "list" ? "var(--color-primary-hover)" : "bg.muted" }}
      >
        List View
      </Button>
    </Group>
  );
}
