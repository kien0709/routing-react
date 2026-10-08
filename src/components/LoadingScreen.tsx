import { Box, Flex, Grid, Skeleton, Stack, VisuallyHidden } from "@chakra-ui/react";

// grijze schets van de app met sidebar en pagina terwijl we je account controleren
// zodat het scherm niet van leeg naar vol springt
export default function LoadingScreen() {
  return (
    <Flex aria-busy="true" bg="bg.muted" minH="100vh" direction={{ base: "column", md: "row" }}>
      <VisuallyHidden>Checking your account</VisuallyHidden>

      {/* sidebar */}
      <Stack
        bg="bg.panel"
        borderColor="border"
        borderRightWidth={{ base: 0, md: "1px" }}
        gap={3}
        minH={{ base: "auto", md: "100vh" }}
        p={5}
        w={{ base: "100%", md: "210px" }}
      >
        <Skeleton height="28px" mb={5} width="70%" />
        {[1, 2, 3, 4].map((key) => (
          <Skeleton display={{ base: "none", md: "block" }} height="40px" key={key} />
        ))}
      </Stack>

      {/* pagina */}
      <Box flex="1" p={{ base: 4, md: 8 }}>
        <Skeleton height="36px" mb={3} width="200px" />
        <Skeleton height="18px" mb={8} width="280px" maxW="100%" />
        <Grid gap={4} mb={6} templateColumns={{ base: "1fr", sm: "repeat(3, 1fr)" }}>
          {[1, 2, 3].map((key) => (
            <Skeleton borderRadius="16px" height="84px" key={key} />
          ))}
        </Grid>
        <Skeleton borderRadius="20px" height="360px" />
      </Box>
    </Flex>
  );
}
