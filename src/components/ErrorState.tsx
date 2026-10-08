import { Button, EmptyState } from "@chakra-ui/react";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import { describeError } from "../api/errors";

// nette foutkaart met uitleg en een try again knop in plaats van alleen rode tekst
interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
}

// https://chakra-ui.com/docs/components/empty-state
export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { title, description } = describeError(error);

  return (
    <EmptyState.Root bg="bg.panel" borderRadius="20px" role="alert">
      <EmptyState.Content>
        <EmptyState.Indicator color="red.500">
          <FiAlertTriangle />
        </EmptyState.Indicator>
        <EmptyState.Title>{title}</EmptyState.Title>
        <EmptyState.Description textAlign="center">{description}</EmptyState.Description>
        {onRetry && (
          <Button borderRadius="10px" onClick={onRetry} size="sm" variant="outline">
            <FiRefreshCw /> Try again
          </Button>
        )}
      </EmptyState.Content>
    </EmptyState.Root>
  );
}
