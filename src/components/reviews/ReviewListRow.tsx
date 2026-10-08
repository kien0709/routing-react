import { Box, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import type { Review } from "../../data/reviews";

type ReviewListRowProps = {
  review: Review;
};

export default function ReviewListRow({ review }: ReviewListRowProps) {
  return (
    <Flex
      align="center"
      bg="bg.panel"
      borderRadius="16px"
      gap={4}
      opacity={1}
      p={4}
      w="100%"
      wrap={{ base: "wrap", sm: "nowrap" }}
    >
      <Image
        alt={review.product}
        borderRadius="12px"
        h="72px"
        objectFit="cover"
        src={review.image}
        w="88px"
      />
      <Box flex="1" minW="140px">
        <Text color="fg.muted" fontSize="13px" mb={1}>
          Product review
        </Text>
        <Heading color="fg" size="sm">
          {review.product}
        </Heading>
        <Text color="fg.muted" fontSize="12px">
          Reviewed by {review.reviewer}
        </Text>
      </Box>
      <Flex align="center" gap={2} justify="flex-end" w={{ base: "100%", sm: "auto" }}>
        <Button
          bg="var(--color-primary)"
          borderRadius="10px"
          color="white"
          fontSize="13px"
          gap={2}
          h="34px"
          minW="107px"
          px="12px"
          py="6px"
          size="sm"
          _hover={{ bg: "var(--color-primary-hover)" }}
        >
          View details
        </Button>
        <Button
          bg="var(--color-source)"
          borderRadius="8px"
          color="white"
          fontSize="12px"
          gap={2}
          h="26px"
          minW="72px"
          px="12px"
          py="2px"
          size="sm"
          _hover={{ bg: "var(--color-source-hover)" }}
        >
          Source
        </Button>
      </Flex>
    </Flex>
  );
}
