import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  rightContent?: ReactNode;
  trend?: string | null;
  value: string;
};

export default function MetricCard({ icon, label, rightContent, trend = "+ 20.5%", value }: MetricCardProps) {
  return (
    <Box
      bg="bg.panel"
      borderRadius="16px"
      display="flex"
      alignItems="stretch"
      justifyContent="space-between"
      gap={4}
      h="180px"
      opacity={1}
      p={8}
      w="100%"
    >
      <Box>
        <Flex align="center" color="fg.muted" gap={2} mb={7}>
          {icon}
          <Text fontSize="15px">{label}</Text>
        </Flex>

        <Flex align="center" gap={3} mb={3}>
          <Heading color="fg" fontSize="38px" lineHeight="1">
            {value}
          </Heading>
          {trend && (
            <Box
              bg="var(--color-trend-bg)"
              borderRadius="999px"
              color="var(--color-trend-text)"
              fontSize="11px"
              fontWeight="semibold"
              px={3}
              py={1}
            >
              {trend}
            </Box>
          )}
        </Flex>

        <Text color="fg.muted" fontSize="14px">
          October 2023
        </Text>
      </Box>

      {rightContent && (
        <Flex align="center" flexShrink={0}>
          {rightContent}
        </Flex>
      )}
    </Box>
  );
}
