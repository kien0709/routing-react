import { Box, Flex, Grid, Heading, Stack } from "@chakra-ui/react";
import { useState } from "react";
import HeaderActions from "../components/HeaderActions";
import ReviewCard from "../components/reviews/ReviewCard";
import ReviewListRow from "../components/reviews/ReviewListRow";
import ReviewViewToggle, { type ReviewView } from "../components/reviews/ReviewViewToggle";
import Sidebar from "../components/Sidebar";
import { reviews } from "../data/reviews";

export default function Reviews() {
  const [view, setView] = useState<ReviewView>("grid");

  return (
    
    <Flex bg="bg.muted" minH="100vh" direction={{ base: "column", md: "row" }}>
      <Sidebar />

      <Box flex="1" minW={0} p={{ base: 4, md: 6 }}>
        <Flex
          align={{ base: "stretch", lg: "flex-start" }}
          direction={{ base: "column", lg: "row" }}
          gap={6}
          justify="space-between"
          mb={6}
          w="100%"
        >
          <Box>
            <Heading size="lg" mb={1}>
              Reviews
            </Heading>
            <Heading size="sm" mb={1}>
              Product list
            </Heading>
          </Box>

          <HeaderActions />
        </Flex>

        <Flex justify="flex-end" mb={4} w="100%">
          <ReviewViewToggle onChange={setView} view={view} />
        </Flex>

        {view === "grid" ? (
          <Grid
            gap={3}
            templateColumns={{
              base: "minmax(0, 1fr)",
              sm: "repeat(2, minmax(0, 1fr))",
              xl: "repeat(4, minmax(0, 1fr))",
              "2xl": "repeat(auto-fit, minmax(240px, 1fr))",
            }}
          >
            {reviews.map((review) => (
              <ReviewCard key={review.product} review={review} />
            ))}
          </Grid>
        ) : (
          <Stack gap={3} w="100%">
            {reviews.map((review) => (
              <ReviewListRow key={review.product} review={review} />
            ))}
          </Stack>
        )}
      </Box>
    </Flex>
  );
}
