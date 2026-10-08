import { Box, Flex, HStack, Progress, Text } from "@chakra-ui/react";
import type { TodoList } from "../../api/todos";
import { userName } from "../../api/users";
import UserAvatar from "../UserAvatar";

// kaartje van een lijst met voortgangsbalk klik om hem te openen
interface ListCardProps {
  list: TodoList;
  selected: boolean;
  showOwner: boolean;
  onSelect: () => void;
}

export default function ListCard({ list, selected, showOwner, onSelect }: ListCardProps) {
  const done = list.done_count;
  const total = list.item_count;
  const percentage = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <Box
      as="button"
      bg={selected ? "var(--color-primary)" : "bg.panel"}
      borderColor={selected ? "var(--color-primary)" : "border"}
      borderRadius="16px"
      borderWidth="1px"
      color={selected ? "white" : "fg"}
      cursor="pointer"
      onClick={onSelect}
      p={4}
      textAlign="left"
      transition="all 0.15s"
      w="100%"
      _hover={{ borderColor: "var(--color-primary)" }}
    >
      <Flex align="center" gap={2} justify="space-between" mb={3}>
        <Text fontWeight="semibold" truncate>
          {list.title}
        </Text>
        <Text flexShrink={0} fontSize="sm" opacity={0.8}>
          {done}/{total}
        </Text>
      </Flex>

      <Progress.Root colorPalette={selected ? "whiteAlpha" : "purple"} size="xs" value={percentage}>
        <Progress.Track bg={selected ? "whiteAlpha.400" : "bg.muted"} borderRadius="full">
          <Progress.Range bg={selected ? "white" : "var(--color-primary)"} />
        </Progress.Track>
      </Progress.Root>

      {showOwner && (
        <HStack gap={2} mt={3}>
          <UserAvatar name={userName(list.owner)} size="2xs" src={list.owner.photo_url} />
          <Text fontSize="xs" opacity={0.8} truncate>
            {userName(list.owner)}
          </Text>
        </HStack>
      )}
    </Box>
  );
}
