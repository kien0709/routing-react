import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ColorModeButton } from "./ui/color-mode";
import { MdReviews } from "react-icons/md";
import { IoMdHome } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { PiHashFill } from "react-icons/pi";
import { IoIosNotifications } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import { FaDiceFive } from "react-icons/fa";
import type { IconType } from "react-icons";
import { IoLogOut } from "react-icons/io5";
import { FiCheckSquare } from "react-icons/fi";


type NavItem = {
  label: string;
  path?: string;
  icon: IconType;
  adminOnly?: boolean;
};

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: IoMdHome },
  { label: "Todos", path: "/todos", icon: FiCheckSquare },
  { label: "Reviews", path: "/reviews", icon: MdReviews },
  { label: "Keywords", icon: PiHashFill },
  { label: "Web crawler", icon: FaDiceFive },
  { label: "Notifications", icon: IoIosNotifications },
  { label: "Settings", icon: IoSettingsSharp },
  { label: "Users", path: "/users", icon: FaUser, adminOnly: true },
];

export default function Sidebar() {
  const { authenticatedUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Flex
      as="aside"
      alignSelf={{ base: "auto", md: "stretch" }}
      bg="bg.panel"
      borderRightWidth="1px"
      borderColor="border"
      direction="column"
      justify="space-between"
      minH={{ base: "auto", md: "100vh" }}
      p={5}
      flexShrink={0}
      w={{ base: "100%", md: "210px" }}
    >
      <Box>
        <Flex align="center" justify="space-between" mb={8}>
          <Heading color="fg" size="md">
            React Admin
          </Heading>
          <ColorModeButton />
        </Flex>

        <Stack gap={2}>
          {navItems
            .filter((item) => !item.adminOnly || authenticatedUser?.isAdmin)
            .map((item) =>
            item.path ? (
              <NavLink key={item.label} to={item.path}>
                {({ isActive }) => (
                  <Flex
                    align="center"
                    bg={isActive ? "colorPalette.subtle" : "transparent"}
                    borderRadius="md"
                    color={isActive ? "colorPalette.fg" : "fg.muted"}
                    colorPalette="blue"
                    gap={3}
                    fontWeight={isActive ? "semibold" : "medium"}
                    px={4}
                    py={3}
                  >
                    {item.icon && <item.icon size={18} />}
                    <Text flex="1" fontSize="15px">
                      {item.label}
                    </Text>
                  </Flex>
                )}
              </NavLink>
            ) : (
              <Flex
                key={item.label}
                align="center"
                borderRadius="md"
                color="fg.muted"
                gap={3}
                fontWeight="medium"
                px={4}
                py={3}
              >
                {item.icon && <item.icon size={18} />}
                <Text flex="1" fontSize="15px">
                  {item.label}
                </Text>
              </Flex>
            )
          )}
        </Stack>
      </Box>

      <Box mt={{ base: 6, md: 0 }}>
        <Button onClick={handleLogout} variant="ghost" w="100%" color="fg.muted">
          <IoLogOut size={18} />
          Log out
        </Button>
      </Box>
    </Flex>
  );
}
