import { Badge, Checkbox, Flex, HStack, IconButton, Text } from "@chakra-ui/react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type { TodoItem } from "../../api/todos";
import { userName } from "../../api/users";
import UserAvatar from "../UserAvatar";

// een regel met een taak met vinkje titel toegewezen persoon en knoppen
interface TaskRowProps {
  task: TodoItem;
  canEdit: boolean;
  canDelete: boolean;
  onToggle: (completed: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TaskRow({ task, canEdit, canDelete, onToggle, onEdit, onDelete }: TaskRowProps) {
  const assignee = task.assigned_to_detail;

  return (
    <Flex
      align="center"
      bg="bg.panel"
      borderColor="border"
      borderRadius="14px"
      borderWidth="1px"
      gap={3}
      px={{ base: 3, md: 4 }}
      py={3}
      transition="border-color 0.15s"
      _hover={{ borderColor: "var(--color-primary)" }}
    >
      <Checkbox.Root
        checked={task.completed}
        colorPalette="purple"
        disabled={!canEdit}
        onCheckedChange={(e) => onToggle(e.checked === true)}
      >
        <Checkbox.HiddenInput aria-label={`Mark ${task.title} as done`} />
        <Checkbox.Control borderRadius="full" />
      </Checkbox.Root>

      <Flex
        align={{ base: "flex-start", sm: "center" }}
        direction={{ base: "column", sm: "row" }}
        flex="1"
        gap={{ base: 1, sm: 3 }}
        minW={0}
      >
        <Text
          color={task.completed ? "fg.muted" : "fg"}
          flex="1"
          fontWeight="medium"
          minW={0}
          textDecoration={task.completed ? "line-through" : "none"}
          truncate
        >
          {task.title}
        </Text>

        {assignee ? (
          <HStack gap={2} minW={0}>
            <UserAvatar name={userName(assignee)} size="2xs" src={assignee.photo_url} />
            <Text color="fg.muted" fontSize="sm" truncate>
              {userName(assignee)}
            </Text>
          </HStack>
        ) : (
          <Badge colorPalette="gray" variant="subtle">
            Unassigned
          </Badge>
        )}
      </Flex>

      <HStack gap={1}>
        {canEdit && (
          <IconButton aria-label="Edit task" onClick={onEdit} size="sm" variant="ghost">
            <FiEdit2 />
          </IconButton>
        )}
        {canDelete && (
          <IconButton aria-label="Delete task" colorPalette="red" onClick={onDelete} size="sm" variant="ghost">
            <FiTrash2 />
          </IconButton>
        )}
      </HStack>
    </Flex>
  );
}
