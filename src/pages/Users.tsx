import { Badge, Box, Button, Flex, Grid, Heading, HStack, IconButton, Skeleton, Table, Text } from "@chakra-ui/react";
import { useState } from "react";
import { FiEdit2, FiPlus, FiShield, FiTrash2, FiUsers } from "react-icons/fi";
import { getErrorMessage } from "../api/errors";
import { useCreateUser, useDeleteUser, userName, useUpdateUser, useUsers } from "../api/users";
import type { ManagedUser, UserInput } from "../api/users";
import ConfirmDialog from "../components/ConfirmDialog";
import ErrorState from "../components/ErrorState";
import HeaderActions from "../components/HeaderActions";
import Sidebar from "../components/Sidebar";
import { toaster } from "../components/ui/toaster";
import UserAvatar from "../components/UserAvatar";
import UserDialog from "../components/users/UserDialog";
import { useAuth } from "../context/AuthContext";

// gebruikers pagina alleen admin met een tabel en aanmaken bewerken of verwijderen
export default function Users() {
  const { authenticatedUser } = useAuth();
  const { data: users = [], error, isPending, refetch } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<ManagedUser | null>(null);

  const openCreate = () => {
    setEditingUser(null);
    setDialogOpen(true);
  };

  const openEdit = (user: ManagedUser) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  // gebruiker opslaan nieuw of bewerkt
  const handleSubmit = async (input: UserInput) => {
    try {
      if (editingUser) {
        await updateUser.mutateAsync({ id: editingUser.id, ...input });
        toaster.create({ type: "success", title: "User updated" });
      } else {
        await createUser.mutateAsync(input);
        toaster.create({ type: "success", title: "User created" });
      }
      setDialogOpen(false);
    } catch (err) {
      toaster.create({ type: "error", title: getErrorMessage(err) });
    }
  };

  // gebruiker verwijderen na bevestigen
  const handleDelete = async () => {
    if (!deletingUser) return;

    try {
      await deleteUser.mutateAsync(deletingUser.id);
      toaster.create({ type: "success", title: "User deleted" });
      setDeletingUser(null);
    } catch (err) {
      toaster.create({ type: "error", title: getErrorMessage(err) });
    }
  };

  const stats = [
    { label: "Total users", value: users.length, icon: FiUsers },
    { label: "Admins", value: users.filter((user) => user.role === "admin").length, icon: FiShield },
  ];

  return (
    <Flex bg="bg.muted" minH="100vh" direction={{ base: "column", md: "row" }}>
      <Sidebar />

      <Box flex="1" minW={0} p={{ base: 4, md: 8 }}>
        <Flex
          align={{ base: "stretch", lg: "flex-start" }}
          direction={{ base: "column", lg: "row" }}
          gap={6}
          justify="space-between"
          mb={6}
          w="100%"
        >
          <Box>
            <Heading size="xl" mb={2}>
              Users
            </Heading>
            <Text color="fg">Manage who can access the platform</Text>
          </Box>

          <HeaderActions />
        </Flex>

        <Grid gap={4} mb={6} templateColumns={{ base: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))", xl: "repeat(4, minmax(0, 1fr))" }}>
          {stats.map((stat) => (
            <Flex align="center" bg="bg.panel" borderRadius="16px" gap={4} key={stat.label} p={5}>
              <Flex
                align="center"
                bg="color-mix(in srgb, var(--color-primary) 15%, transparent)"
                borderRadius="12px"
                color="var(--color-primary)"
                h="44px"
                justify="center"
                w="44px"
              >
                <stat.icon size={20} />
              </Flex>
              <Box>
                <Text color="fg.muted" fontSize="sm">
                  {stat.label}
                </Text>
                {/* skeleton zolang de gebruikers laden */}
                {isPending ? (
                  <Skeleton height="28px" mt={1} width="48px" />
                ) : (
                  <Text color="fg" fontSize="2xl" fontWeight="bold">
                    {stat.value}
                  </Text>
                )}
              </Box>
            </Flex>
          ))}
        </Grid>

        <Box bg="bg.panel" borderRadius="20px" p={{ base: 4, md: 6 }}>
          <Flex align="center" justify="space-between" mb={4}>
            <Heading size="md">All users</Heading>
            <Button
              bg="var(--color-primary)"
              borderRadius="10px"
              color="white"
              onClick={openCreate}
              size="sm"
              _hover={{ bg: "var(--color-primary-hover)" }}
            >
              <FiPlus /> Add user
            </Button>
          </Flex>

          {error && <ErrorState error={error} onRetry={() => refetch()} />}

          {/* https://chakra-ui.com/docs/components/table */}
          <Table.ScrollArea>
            <Table.Root minW="560px" size="md">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>User</Table.ColumnHeader>
                  <Table.ColumnHeader>Role</Table.ColumnHeader>
                  <Table.ColumnHeader>Joined</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end">Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {isPending &&
                  [1, 2, 3].map((key) => (
                    <Table.Row key={key}>
                      <Table.Cell colSpan={4}>
                        <Skeleton height="36px" />
                      </Table.Cell>
                    </Table.Row>
                  ))}

                {users.map((user) => {
                  const isMe = user.id === authenticatedUser?.id;

                  return (
                    <Table.Row key={user.id}>
                      <Table.Cell>
                        <HStack gap={3}>
                          <UserAvatar name={userName(user)} src={user.photo_url} />
                          <Box minW={0}>
                            <Text fontWeight="medium" truncate>
                              {user.display_name || "No name"} {isMe && <Badge ml={1}>You</Badge>}
                            </Text>
                            <Text color="fg.muted" fontSize="sm" truncate>
                              {user.email}
                            </Text>
                          </Box>
                        </HStack>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge colorPalette={user.role === "admin" ? "purple" : "gray"} variant="subtle">
                          {user.role === "admin" ? "Admin" : "User"}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell color="fg.muted">{new Date(user.created_at).toLocaleDateString()}</Table.Cell>
                      <Table.Cell textAlign="end">
                        <HStack gap={1} justify="flex-end">
                          <IconButton aria-label="Edit user" onClick={() => openEdit(user)} size="sm" variant="ghost">
                            <FiEdit2 />
                          </IconButton>
                          <IconButton
                            aria-label="Delete user"
                            colorPalette="red"
                            disabled={isMe}
                            onClick={() => setDeletingUser(user)}
                            size="sm"
                            variant="ghost"
                          >
                            <FiTrash2 />
                          </IconButton>
                        </HStack>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        </Box>
      </Box>

      <UserDialog
        key={dialogOpen ? (editingUser?.id ?? "new") : "closed"}
        loading={createUser.isPending || updateUser.isPending}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        open={dialogOpen}
        user={editingUser}
      />

      <ConfirmDialog
        description={`${deletingUser ? userName(deletingUser) : ""} will lose access and all of their lists will be deleted.`}
        loading={deleteUser.isPending}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDelete}
        open={deletingUser !== null}
        title="Delete user?"
      />
    </Flex>
  );
}
