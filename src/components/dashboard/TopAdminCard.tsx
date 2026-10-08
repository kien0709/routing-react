import { Avatar, Box, Button, Flex, Group, Stack, Text } from "@chakra-ui/react";

export default function TopAdminCard() {
  return (
    <Box
      bg="bg.panel"
      borderRadius="24px"
      h="236px"
      opacity={1}
      p={6}
      w="100%"
    >
      <Flex align="center" justify="space-between" mb={5}>
        <Text color="fg" fontSize="20px" fontWeight="semibold">
          Top Admin
        </Text>
        <Text color="fg" fontSize="16px" fontWeight="semibold">
          View all
        </Text>
      </Flex>

      <Flex align="flex-start" gap={5} justify="space-between" wrap={{ base: "wrap", lg: "nowrap" }}>
        <Stack align="center" gap={2} flexShrink={0} w="88px">
          <Avatar.Root h="76px" w="76px">
            <Avatar.Fallback name="Carl Meadows" />
            <Avatar.Image src="https://bit.ly/sage-adebayo" />
          </Avatar.Root>

          <Box textAlign="center">
            <Text color="fg" fontSize="14px" fontWeight="medium" lineHeight="1.2">
              Carl Meadows
            </Text>
            <Text color="fg.muted" fontSize="12px" lineHeight="1.5">
              Admin
            </Text>
          </Box>
        </Stack>

        <Box flex={{ base: "1 1 215px", lg: "0 0 215px" }} minW="215px" opacity={1}>
          <Group gap={3} orientation="vertical" w="100%">
            <Button
              bg="bg.muted"
              border="0"
              borderRadius="12px"
              color="fg"
              h="51px"
              justifyContent="space-between"
              opacity={1}
              px={5}
              size="sm"
              variant="outline"
              w="215px"
              _hover={{ bg: "bg.muted" }}
            >
              <Text color="fg.muted" fontSize="13px" fontWeight="medium">
                Notices Reviewed:
              </Text>
              <Text color="fg" fontSize="18px" fontWeight="bold">
                23,353
              </Text>
            </Button>
            <Button
              bg="var(--color-primary)"
              border="0"
              borderRadius="12px"
              color="white"
              fontSize="18px"
              fontWeight="bold"
              h="57px"
              opacity={1}
              size="sm"
              variant="solid"
              w="215px"
              _hover={{ bg: "var(--color-primary-hover)" }}
            >
              View Details
            </Button>
          </Group>
        </Box>
      </Flex>
    </Box>
  );
}
