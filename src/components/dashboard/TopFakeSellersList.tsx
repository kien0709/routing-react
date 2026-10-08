import { Box, Flex, Text } from "@chakra-ui/react";
import { FiUser } from "react-icons/fi";

const fakeSellers = [
  { name: "Rose Meadows", listing: "#2464", color: "#DFF7C7", icon: "#72B042" },
  { name: "Madden Esparza", listing: "#6345", color: "#FFE2E5", icon: "#EF4056" },
  { name: "Edison Norman", listing: "#9815", color: "#F5D8FF", icon: "#C13AF2" },
  { name: "Terrance Conner", listing: "#9245", color: "#DDE8FF", icon: "#365CEF" },
  { name: "Curtis Valentine", listing: "#2390", color: "#FFF0C8", icon: "#C79018" },
];

export default function TopFakeSellersList() {
  return (
    <Box>
      <Flex justify="space-between" align="center" mb={5}>
        <Text color="fg" fontSize="18px" fontWeight="semibold">
          Top 5 Fake Sellers
        </Text>
        <Text color="fg" fontSize="14px" fontWeight="medium">
          View all
        </Text>
      </Flex>

      <Flex direction="column" gap={4}>
        {fakeSellers.map((seller) => (
          <Flex key={seller.listing} align="center" justify="space-between">
            <Flex align="center" gap={3}>
              <Flex
                align="center"
                bg={seller.color}
                borderRadius="10px"
                color={seller.icon}
                h="36px"
                justify="center"
                w="36px"
              >
                <FiUser size={19} />
              </Flex>

              <Box>
                <Text color="fg" fontSize="13px" fontWeight="semibold" lineHeight="1.2">
                  {seller.name}
                </Text>
                <Text color="fg.muted" fontSize="11px" lineHeight="1.2">
                  Company name
                </Text>
              </Box>
            </Flex>

            <Text color="fg.muted" fontSize="15px" fontWeight="medium">
              Listing {seller.listing}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}
