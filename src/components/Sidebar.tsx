import { Box, Button, CloseButton, Drawer, Flex, Heading, IconButton, Portal, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
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
import { FiCheckSquare, FiMenu } from "react-icons/fi";


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

// op de telefoon een balk bovenaan met een menuknop die de navigatie als drawer opent
// vanaf md de vaste sidebar links
// https://chakra-ui.com/docs/components/drawer
export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Flex
        align="center"
        bg="bg.panel"
        borderBottomWidth="1px"
        borderColor="border"
        display={{ base: "flex", md: "none" }}
        gap={2}
        pb={3}
        position="sticky"
        pt="calc(env(safe-area-inset-top) + 12px)"
        px={4}
        top={0}
        zIndex="sticky"
      >
        <IconButton aria-label="Open menu" onClick={() => setMenuOpen(true)} size="sm" variant="ghost">
          <FiMenu />
        </IconButton>
        <Heading color="fg" flex="1" size="md">
          React Admin
        </Heading>
        <ColorModeButton />
      </Flex>

      <Drawer.Root open={menuOpen} onOpenChange={(e) => setMenuOpen(e.open)} placement="start" size="xs">
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content pt="env(safe-area-inset-top)" pb="env(safe-area-inset-bottom)">
              <SidebarContent onNavigate={() => setMenuOpen(false)} />
              <Drawer.CloseTrigger asChild top="calc(env(safe-area-inset-top) + 16px)">
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>

      <Box
        as="aside"
        alignSelf="stretch"
        bg="bg.panel"
        borderRightWidth="1px"
        borderColor="border"
        display={{ base: "none", md: "block" }}
        flexShrink={0}
        minH="100vh"
        w="210px"
      >
        <SidebarContent showColorMode />
      </Box>
    </>
  );
}

function SidebarContent({ onNavigate, showColorMode }: { onNavigate?: () => void; showColorMode?: boolean }) {
  const { authenticatedUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    onNavigate?.();
    await logout();
    navigate("/login");
  };

  return (
    <Flex direction="column" h="100%" justify="space-between" minH={{ md: "100vh" }} p={5}>
      <Box>
        <Flex align="center" justify="space-between" mb={8}>
          <Heading color="fg" size="md">
            React Admin
          </Heading>
          {showColorMode && <ColorModeButton />}
        </Flex>

        <Stack gap={2}>
          {navItems
            .filter((item) => !item.adminOnly || authenticatedUser?.isAdmin)
            .map((item) =>
            item.path ? (
              <NavLink key={item.label} onClick={onNavigate} to={item.path}>
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

      <Box mt={6}>
        <Button onClick={handleLogout} variant="ghost" w="100%" color="fg.muted">
          <IoLogOut size={18} />
          Log out
        </Button>
      </Box>
    </Flex>
  );
}
