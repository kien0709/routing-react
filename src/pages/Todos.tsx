import {
  Box,
  Button,
  EmptyState,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
  Input,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import type { FormEvent } from "react";
import { FiCheckSquare, FiEdit2, FiList, FiPlus, FiTrash2 } from "react-icons/fi";
import { getErrorMessage } from "../api/errors";
import {
  isTemporary,
  useCreateItem,
  useCreateList,
  useDeleteItem,
  useDeleteList,
  useTodoItems,
  useTodoLists,
  useTodoStats,
  useUpdateItem,
  useUpdateList,
} from "../api/todos";
import type { TaskFilter, TodoItem, TodoItemInput, TodoList } from "../api/todos";
import { userName, useUsers } from "../api/users";
import ConfirmDialog from "../components/ConfirmDialog";
import ErrorState from "../components/ErrorState";
import HeaderActions from "../components/HeaderActions";
import InfiniteScrollTrigger from "../components/InfiniteScrollTrigger";
import Sidebar from "../components/Sidebar";
import AssigneeSelect from "../components/todos/AssigneeSelect";
import ListCard from "../components/todos/ListCard";
import ListDialog from "../components/todos/ListDialog";
import TaskDialog from "../components/todos/TaskDialog";
import TaskRow from "../components/todos/TaskRow";
import { toaster } from "../components/ui/toaster";
import UserAvatar from "../components/UserAvatar";
import { useAuth } from "../context/AuthContext";

type DeleteTarget = { kind: "list"; list: TodoList } | { kind: "task"; task: TodoItem } | null;

const filters: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "done", label: "Done" },
];

// bij een fout zet de mutation de oude data terug hier laten we de melding zien
function showError(error: unknown) {
  toaster.create({ type: "error", title: getErrorMessage(error) });
}

// todo pagina links de lijsten rechts de taken van de gekozen lijst
export default function Todos() {
  const { authenticatedUser } = useAuth();
  const isAdmin = authenticatedUser?.isAdmin ?? false;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [newTask, setNewTask] = useState("");
  const [newAssignee, setNewAssignee] = useState<number | null>(null);
  const [listDialog, setListDialog] = useState<"create" | "rename" | null>(null);
  const [editingTask, setEditingTask] = useState<TodoItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  // alle geladen paginas achter elkaar als 1 lijst
  const listsQuery = useTodoLists();
  const lists = listsQuery.data?.pages.flatMap((page) => page.results) ?? [];
  const statsQuery = useTodoStats();
  const stats = statsQuery.data;
  const { data: users = [] } = useUsers();

  // de gekozen lijst of de eerste als er nog niks gekozen is
  const selected = lists.find((list) => list.id === selectedId) ?? lists[0];
  const itemsQuery = useTodoItems(selected?.id, filter);
  const tasks = itemsQuery.data?.pages.flatMap((page) => page.results) ?? [];

  const createList = useCreateList();
  const updateList = useUpdateList();
  const deleteList = useDeleteList();
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();

  const canManage = (list: TodoList) => isAdmin || list.owner.id === authenticatedUser?.id;
  const canEditTask = (task: TodoItem) =>
    !isTemporary(task.id) &&
    ((selected !== undefined && canManage(selected)) || task.assigned_to === authenticatedUser?.id);

  // alle handlers hieronder sluiten de popup meteen de mutation past de ui al aan
  // voordat de server antwoordt optimistic update

  // lijst opslaan nieuw of hernoemd
  const handleListSubmit = (title: string) => {
    if (listDialog === "rename" && selected) {
      updateList.mutate({ id: selected.id, title }, { onError: showError });
    } else {
      createList.mutate(title, {
        onSuccess: (list) => setSelectedId(list.id),
        onError: showError,
      });
    }
    setListDialog(null);
  };

  // nieuwe taak toevoegen aan de gekozen lijst
  const handleAddTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selected || !newTask.trim()) return;

    createItem.mutate({ listId: selected.id, title: newTask.trim(), assigned_to: newAssignee }, { onError: showError });
    setNewTask("");
    setNewAssignee(null);
  };

  // taak aanpassen ook gebruikt voor het afvinken
  const handleUpdateTask = (task: TodoItem, input: TodoItemInput) => {
    updateItem.mutate({ task, input }, { onError: showError });
    setEditingTask(null);
  };

  // lijst of taak verwijderen na bevestigen
  const handleDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.kind === "list") {
      deleteList.mutate(deleteTarget.list.id, { onError: showError });
      setSelectedId(null);
    } else {
      deleteItem.mutate(deleteTarget.task, { onError: showError });
    }
    setDeleteTarget(null);
  };

  const statCards = [
    { label: isAdmin ? "All lists" : "Lists", value: stats?.lists, icon: FiList },
    { label: "Open tasks", value: stats?.open_tasks, icon: FiCheckSquare },
    { label: "Assigned to me", value: stats?.assigned_to_me, icon: FiCheckSquare },
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
              Todos
            </Heading>
            <Text color="fg">
              {isAdmin ? "Every list on the platform" : "Your lists and the tasks assigned to you"}
            </Text>
          </Box>

          <HeaderActions />
        </Flex>

        <Grid gap={4} mb={6} templateColumns={{ base: "minmax(0, 1fr)", sm: "repeat(3, minmax(0, 1fr))" }}>
          {statCards.map((stat) => (
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
                {/* skeleton zolang de tellers laden */}
                {statsQuery.isPending ? (
                  <Skeleton height="28px" mt={1} width="48px" />
                ) : (
                  <Text color="fg" fontSize="2xl" fontWeight="bold">
                    {stat.value ?? "-"}
                  </Text>
                )}
              </Box>
            </Flex>
          ))}
        </Grid>

        {/* lijsten konden niet laden bijvoorbeeld 403 of server uit dan een foutkaart met try again */}
        {listsQuery.error ? (
          <ErrorState error={listsQuery.error} onRetry={() => listsQuery.refetch()} />
        ) : (
        <Grid gap={6} templateColumns={{ base: "minmax(0, 1fr)", lg: "300px minmax(0, 1fr)" }}>
          {/* lijsten */}
          <Box>
            <Flex align="center" justify="space-between" mb={4}>
              <Heading size="md">{isAdmin ? "All lists" : "My lists"}</Heading>
              <Button
                bg="var(--color-primary)"
                borderRadius="10px"
                color="white"
                onClick={() => setListDialog("create")}
                size="sm"
                _hover={{ bg: "var(--color-primary-hover)" }}
              >
                <FiPlus /> New list
              </Button>
            </Flex>

            <Stack gap={3}>
              {listsQuery.isPending &&
                [1, 2, 3].map((key) => <Skeleton borderRadius="16px" height="88px" key={key} />)}

              {!listsQuery.isPending && lists.length === 0 && (
                <Text color="fg.muted" fontSize="sm">
                  No lists yet. Create your first one.
                </Text>
              )}

              {lists.map((list) => (
                <ListCard
                  key={list.id}
                  list={list}
                  onSelect={() => setSelectedId(list.id)}
                  selected={list.id === selected?.id}
                  showOwner={list.owner.id !== authenticatedUser?.id}
                />
              ))}

              {/* volgende 10 lijsten laden als je onderaan bent */}
              <InfiniteScrollTrigger
                fetchNextPage={listsQuery.fetchNextPage}
                hasNextPage={listsQuery.hasNextPage}
                isFetchingNextPage={listsQuery.isFetchingNextPage}
              />
            </Stack>
          </Box>

          {/* taken van de gekozen lijst */}
          <Box bg="bg.panel" borderRadius="20px" minH="400px" p={{ base: 4, md: 6 }}>
            {!selected ? (
              <EmptyState.Root>
                <EmptyState.Content>
                  <EmptyState.Indicator>
                    <FiList />
                  </EmptyState.Indicator>
                  <EmptyState.Title>No list selected</EmptyState.Title>
                  <EmptyState.Description>Create a list to start adding tasks.</EmptyState.Description>
                </EmptyState.Content>
              </EmptyState.Root>
            ) : (
              <>
                <Flex align="flex-start" gap={3} justify="space-between" mb={5}>
                  <Box minW={0}>
                    <Heading size="lg" truncate>
                      {selected.title}
                    </Heading>
                    <HStack gap={2} mt={1}>
                      <UserAvatar name={userName(selected.owner)} size="2xs" src={selected.owner.photo_url} />
                      <Text color="fg.muted" fontSize="sm" truncate>
                        {selected.owner.id === authenticatedUser?.id ? "You" : userName(selected.owner)}
                      </Text>
                    </HStack>
                  </Box>

                  {canManage(selected) && !isTemporary(selected.id) && (
                    <HStack gap={1}>
                      <IconButton aria-label="Rename list" onClick={() => setListDialog("rename")} variant="ghost">
                        <FiEdit2 />
                      </IconButton>
                      <IconButton
                        aria-label="Delete list"
                        colorPalette="red"
                        onClick={() => setDeleteTarget({ kind: "list", list: selected })}
                        variant="ghost"
                      >
                        <FiTrash2 />
                      </IconButton>
                    </HStack>
                  )}
                </Flex>

                {canManage(selected) && (
                  <form onSubmit={handleAddTask}>
                    <Flex direction={{ base: "column", md: "row" }} gap={3} mb={5}>
                      <Input
                        borderRadius="10px"
                        flex="1"
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Add a new task..."
                        value={newTask}
                      />
                      <Box w={{ base: "100%", md: "200px" }}>
                        <AssigneeSelect onChange={setNewAssignee} users={users} value={newAssignee} />
                      </Box>
                      <Button
                        bg="var(--color-primary)"
                        borderRadius="10px"
                        color="white"
                        // een lijst die nog niet op de server staat kan nog geen taken krijgen
                        disabled={!newTask.trim() || isTemporary(selected.id)}
                        type="submit"
                        _hover={{ bg: "var(--color-primary-hover)" }}
                      >
                        <FiPlus /> Add
                      </Button>
                    </Flex>
                  </form>
                )}

                <HStack gap={2} mb={4}>
                  {filters.map((option) => (
                    <Button
                      bg={filter === option.value ? "var(--color-primary)" : "transparent"}
                      borderRadius="full"
                      color={filter === option.value ? "white" : "fg.muted"}
                      key={option.value}
                      onClick={() => setFilter(option.value)}
                      size="xs"
                      variant={filter === option.value ? "solid" : "outline"}
                    >
                      {option.label}
                    </Button>
                  ))}
                </HStack>

                <Stack gap={2}>
                  {itemsQuery.isLoading &&
                    [1, 2, 3].map((key) => <Skeleton borderRadius="14px" height="54px" key={key} />)}

                  {itemsQuery.error && (
                    <ErrorState error={itemsQuery.error} onRetry={() => itemsQuery.refetch()} />
                  )}

                  {itemsQuery.isSuccess && tasks.length === 0 && (
                    <Text color="fg.muted" py={8} textAlign="center">
                      {filter === "all" ? "No tasks in this list yet." : "No tasks match this filter."}
                    </Text>
                  )}

                  {tasks.map((task) => (
                    <TaskRow
                      canDelete={canManage(selected) && !isTemporary(task.id)}
                      canEdit={canEditTask(task)}
                      key={task.id}
                      onDelete={() => setDeleteTarget({ kind: "task", task })}
                      onEdit={() => setEditingTask(task)}
                      onToggle={(completed) => handleUpdateTask(task, { completed })}
                      task={task}
                    />
                  ))}

                  {/* volgende 20 taken laden als je onderaan bent */}
                  <InfiniteScrollTrigger
                    fetchNextPage={itemsQuery.fetchNextPage}
                    hasNextPage={itemsQuery.hasNextPage}
                    isFetchingNextPage={itemsQuery.isFetchingNextPage}
                  />
                </Stack>
              </>
            )}
          </Box>
        </Grid>
        )}
      </Box>

      <ListDialog
        key={listDialog ?? "closed"}
        initialTitle={listDialog === "rename" ? selected?.title : ""}
        onClose={() => setListDialog(null)}
        onSubmit={handleListSubmit}
        open={listDialog !== null}
      />

      <TaskDialog
        key={editingTask?.id ?? "closed"}
        onClose={() => setEditingTask(null)}
        onSubmit={(input) => editingTask && handleUpdateTask(editingTask, input)}
        task={editingTask}
        users={users}
      />

      <ConfirmDialog
        description={
          deleteTarget?.kind === "list"
            ? `"${deleteTarget.list.title}" and all of its tasks will be deleted.`
            : `"${deleteTarget?.task.title ?? ""}" will be deleted.`
        }
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        open={deleteTarget !== null}
        title={deleteTarget?.kind === "list" ? "Delete list?" : "Delete task?"}
      />
    </Flex>
  );
}
