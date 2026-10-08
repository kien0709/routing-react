import { Box, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import type { Review } from "../../data/reviews";

type ReviewCardProps = {
  review: Review;
};

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
  
    <Box
      bg="bg.panel"
      borderRadius="16px"
      boxShadow="sm"
      h="300px"
      opacity={1}
      p={4}
      w="100%"
    >
      <Image
        alt={review.product}
        borderRadius="12px"
        h="130px"
        mb={3}
        objectFit="cover"
        src={review.image}
        w="100%"
      />
      <Text color="fg.muted" fontSize="13px" mb={2}>
        Product review
      </Text>
      <Heading color="fg" size="sm" mb={2}>
        {review.product}
      </Heading>
      <Text color="fg.muted" fontSize="12px" mb={3}>
        Reviewed by {review.reviewer}
      </Text>
      <Flex align="center" gap={2}>
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
    </Box>
  );
}
