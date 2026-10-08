import { Box, Flex, Link, Separator, Stack, Text } from "@chakra-ui/react";
import { takedownNotifications } from "../../data/takedownNotifications";

export default function TakedownNotifications() {
  return (
    <Box
      bg="bg.panel"
      borderTopLeftRadius="24px"
      borderTopRightRadius="24px"
      h="260px"
      opacity={1}
      p={6}
      w="100%"
    >
      <Text color="fg" fontSize="18px" fontWeight="semibold">
        Notifications of Take Downs
      </Text>

      <Stack gap={3} mt={5}>
        {takedownNotifications.map((notification, index) => (
          <Stack key={notification.link} gap={3}>
            <Box>
              <Flex align="center" gap={2} wrap="wrap">
                <Text color="fg" fontSize="14px" fontWeight="semibold">
                  {notification.title}
                </Text>
                <Link
                  color="var(--color-primary)"
                  fontSize="13px"
                  href={notification.link}
                  lineHeight="1.5"
                >
                  {notification.link}
                </Link>
              </Flex>
              <Text color="fg.muted" fontSize="12px">
                {notification.createdAt}
              </Text>
            </Box>

            {index < takedownNotifications.length - 1 && <Separator />}
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
