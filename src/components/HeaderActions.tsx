import { Avatar, Box, Flex, Input, Text } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function HeaderActions() {
  // naam en rol van de ingelogde gebruiker tonen
  const { authenticatedUser } = useAuth();
  const name = authenticatedUser?.name || authenticatedUser?.email || "Loading...";

  return (
    <Flex
      align={{ base: "stretch", md: "center" }}
      direction={{ base: "column", md: "row" }}
      gap={6}
      justify="flex-end"
      w={{ base: "100%", lg: "auto" }}
    >
      <Box position="relative" w={{ base: "100%", md: "360px", "2xl": "420px" }}>
        <Input
          bg="bg.panel"
          border="0"
          borderRadius="10px"
          color="fg"
          h="45px"
          placeholder="Search"
          pr="44px"
          _placeholder={{ color: "gray.400" }}
        />
        <Box
          color="fg.muted"
          position="absolute"
          right="14px"
          top="50%"
          transform="translateY(-50%)"
        >
          <FiSearch size={20} />
        </Box>
      </Box>

      <Flex align="center" gap={3}>
        <Avatar.Root colorPalette="purple" h="42px" w="42px">
          <Avatar.Fallback name={name} />
          {authenticatedUser?.photoUrl && <Avatar.Image src={authenticatedUser.photoUrl} />}
        </Avatar.Root>
        <Box minW={0}>
          <Text color="fg" fontSize="14px" fontWeight="bold" truncate>
            {name}
          </Text>
          <Text color="fg.muted" fontSize="12px">
            {authenticatedUser?.isAdmin ? "Admin" : "User"}
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}
