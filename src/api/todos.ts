import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData, QueryClient, QueryKey } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import apiClient from "./apiClient";
import type { UserOption } from "./users";

// hoe een taak eruit ziet die de backend terugstuurt
export interface TodoItem {
  id: string;
  todo_list: string;
  title: string;
  completed: boolean;
  assigned_to: number | null;
  assigned_to_detail: UserOption | null;
  created_at: string;
  updated_at: string;
}

// hoe een lijst eruit ziet de taken zelf worden apart per pagina opgehaald
export interface TodoList {
  id: string;
  title: string;
  owner: UserOption;
  item_count: number;
  done_count: number;
  created_at: string;
  updated_at: string;
}

export interface TodoItemInput {
  title?: string;
  completed?: boolean;
  assigned_to?: number | null;
}

export interface TodoStats {
  lists: number;
  open_tasks: number;
  assigned_to_me: number;
}

export type TaskFilter = "all" | "open" | "done";

// een pagina zoals django rest framework hem terugstuurt
interface Page<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

type Pages<T> = InfiniteData<Page<T>, number>;

const listsKey = ["todolists"];
const itemsKey = ["todoitems"];
const statsKey = ["todostats"];

// tijdelijke id voor iets dat nog niet op de server staat optimistic update
export function isTemporary(id: string) {
  return id.startsWith("temp-");
}


// volgende pagina is het aantal geladen paginas plus 1 zolang de backend een next link geeft
// https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries
function getNextPageParam<T>(lastPage: Page<T>, allPages: Page<T>[]) {
  return lastPage.next ? allPages.length + 1 : undefined;
}

// haalt jouw lijsten op 10 per keer
export function useTodoLists() {
  return useInfiniteQuery({
    queryKey: listsKey,
    queryFn: async ({ pageParam }) => {
      const response = await apiClient.get<Page<TodoList>>("/todolists/", { params: { page: pageParam } });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam,
  });
}

// haalt de taken van 1 lijst op 20 per keer met het filter all open of done
export function useTodoItems(listId: string | undefined, filter: TaskFilter) {
  return useInfiniteQuery({
    queryKey: [...itemsKey, listId, filter],
    queryFn: async ({ pageParam }) => {
      const completed = filter === "all" ? undefined : filter === "done";
      const response = await apiClient.get<Page<TodoItem>>(`/todolists/${listId}/items/`, {
        params: { page: pageParam, completed },
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam,
    enabled: !!listId && !isTemporary(listId),
  });
}

// de tellers bovenaan de pagina
export function useTodoStats() {
  return useQuery({
    queryKey: statsKey,
    queryFn: async () => {
      const response = await apiClient.get<TodoStats>("/todostats/");
      return response.data;
    },
  });
}


// https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates

type Snapshot = [QueryKey, unknown][];

// stopt lopende requests die zouden onze aanpassing overschrijven en bewaart de huidige cache
async function takeSnapshot(queryClient: QueryClient): Promise<Snapshot> {
  await Promise.all([listsKey, itemsKey].map((queryKey) => queryClient.cancelQueries({ queryKey })));
  return [...queryClient.getQueriesData({ queryKey: listsKey }), ...queryClient.getQueriesData({ queryKey: itemsKey })];
}

// zet de bewaarde cache terug als de server een fout geeft
function restoreSnapshot(queryClient: QueryClient, snapshot: Snapshot | undefined) {
  snapshot?.forEach(([queryKey, data]) => queryClient.setQueryData(queryKey, data));
}

// na afloop gelukt of niet alles opnieuw ophalen zodat we zeker de echte data hebben
function refetchTodos(queryClient: QueryClient) {
  return Promise.all(
    [listsKey, itemsKey, statsKey].map((queryKey) => queryClient.invalidateQueries({ queryKey })),
  );
}

// past elk item op elke geladen pagina aan
function mapPages<T>(data: Pages<T> | undefined, update: (results: T[]) => T[]) {
  if (!data) return data;
  return { ...data, pages: data.pages.map((page) => ({ ...page, results: update(page.results) })) };
}

// zet een nieuw item bovenaan de eerste pagina
function prepend<T>(data: Pages<T> | undefined, item: T) {
  if (!data) return data;
  return {
    ...data,
    pages: data.pages.map((page, index) =>
      index === 0 ? { ...page, count: page.count + 1, results: [item, ...page.results] } : page,
    ),
  };
}

// past de tellers van een lijst aan dus het aantal taken en hoeveel er klaar zijn
function changeListCounts(queryClient: QueryClient, listId: string, items: number, done: number) {
  queryClient.setQueryData<Pages<TodoList>>(listsKey, (data) =>
    mapPages(data, (lists) =>
      lists.map((list) =>
        list.id === listId
          ? { ...list, item_count: list.item_count + items, done_count: list.done_count + done }
          : list,
      ),
    ),
  );
}

// zoekt een gebruiker in de users cache voor de naam bij een toegewezen taak
function findUser(queryClient: QueryClient, id: number | null | undefined) {
  if (id == null) return null;
  return queryClient.getQueryData<UserOption[]>(["users"])?.find((user) => user.id === id) ?? null;
}

// hoort deze taak in de lijst met dit filter
function matchesFilter(task: TodoItem, filter: unknown) {
  return filter === "all" || (filter === "done") === task.completed;
}



// nieuwe lijst staat meteen bovenaan met een tijdelijke id tot de server antwoordt
export function useCreateList() {
  const queryClient = useQueryClient();
  const { authenticatedUser } = useAuth();

  return useMutation({
    mutationFn: async (title: string) => (await apiClient.post<TodoList>("/todolists/", { title })).data,
    onMutate: async (title) => {
      const snapshot = await takeSnapshot(queryClient);
      const now = new Date().toISOString();
      const owner: UserOption = {
        id: authenticatedUser?.id ?? 0,
        email: authenticatedUser?.email ?? "",
        display_name: authenticatedUser?.name ?? "",
        photo_url: authenticatedUser?.photoUrl ?? "",
      };
      const list: TodoList = {
        id: `temp-${crypto.randomUUID()}`,
        title,
        owner,
        item_count: 0,
        done_count: 0,
        created_at: now,
        updated_at: now,
      };
      queryClient.setQueryData<Pages<TodoList>>(listsKey, (data) => prepend(data, list));
      return { snapshot };
    },
    onError: (_error, _title, context) => restoreSnapshot(queryClient, context?.snapshot),
    onSettled: () => refetchTodos(queryClient),
  });
}

// lijst hernoemen nieuwe naam staat er meteen
export function useUpdateList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) =>
      (await apiClient.patch<TodoList>(`/todolists/${id}/`, { title })).data,
    onMutate: async ({ id, title }) => {
      const snapshot = await takeSnapshot(queryClient);
      queryClient.setQueryData<Pages<TodoList>>(listsKey, (data) =>
        mapPages(data, (lists) => lists.map((list) => (list.id === id ? { ...list, title } : list))),
      );
      return { snapshot };
    },
    onError: (_error, _variables, context) => restoreSnapshot(queryClient, context?.snapshot),
    onSettled: () => refetchTodos(queryClient),
  });
}

// lijst verwijderen verdwijnt meteen
export function useDeleteList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/todolists/${id}/`),
    onMutate: async (id) => {
      const snapshot = await takeSnapshot(queryClient);
      queryClient.setQueryData<Pages<TodoList>>(listsKey, (data) =>
        mapPages(data, (lists) => lists.filter((list) => list.id !== id)),
      );
      return { snapshot };
    },
    onError: (_error, _id, context) => restoreSnapshot(queryClient, context?.snapshot),
    onSettled: () => refetchTodos(queryClient),
  });
}


// nieuwe taak staat meteen bovenaan de lijst bij all en open en de teller gaat omhoog
export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listId, ...input }: TodoItemInput & { listId: string }) =>
      (await apiClient.post<TodoItem>(`/todolists/${listId}/items/`, input)).data,
    onMutate: async ({ listId, ...input }) => {
      const snapshot = await takeSnapshot(queryClient);
      const now = new Date().toISOString();
      const task: TodoItem = {
        id: `temp-${crypto.randomUUID()}`,
        todo_list: listId,
        title: input.title ?? "",
        completed: false,
        assigned_to: input.assigned_to ?? null,
        assigned_to_detail: findUser(queryClient, input.assigned_to),
        created_at: now,
        updated_at: now,
      };

      // de querykey is todoitems dan listid en dan filter
      queryClient.getQueriesData<Pages<TodoItem>>({ queryKey: [...itemsKey, listId] }).forEach(([queryKey]) => {
        if (matchesFilter(task, queryKey[2])) {
          queryClient.setQueryData<Pages<TodoItem>>(queryKey, (data) => prepend(data, task));
        }
      });
      changeListCounts(queryClient, listId, 1, 0);
      return { snapshot };
    },
    onError: (_error, _variables, context) => restoreSnapshot(queryClient, context?.snapshot),
    onSettled: () => refetchTodos(queryClient),
  });
}

// taak aanpassen of afvinken de wijziging staat er meteen
export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ task, input }: { task: TodoItem; input: TodoItemInput }) =>
      (await apiClient.patch<TodoItem>(`/todoitems/${task.id}/`, input)).data,
    onMutate: async ({ task, input }) => {
      const snapshot = await takeSnapshot(queryClient);
      const updated: TodoItem = {
        ...task,
        ...input,
        assigned_to_detail:
          input.assigned_to !== undefined ? findUser(queryClient, input.assigned_to) : task.assigned_to_detail,
      };

      queryClient.getQueriesData<Pages<TodoItem>>({ queryKey: [...itemsKey, task.todo_list] }).forEach(([queryKey]) => {
        queryClient.setQueryData<Pages<TodoItem>>(queryKey, (data) =>
          mapPages(data, (tasks) =>
            tasks
              .map((item) => (item.id === task.id ? updated : item))
              // afgevinkt in het filter open dan meteen weg uit dat filter
              .filter((item) => item.id !== task.id || matchesFilter(updated, queryKey[2])),
          ),
        );
      });

      if (updated.completed !== task.completed) {
        changeListCounts(queryClient, task.todo_list, 0, updated.completed ? 1 : -1);
      }
      return { snapshot };
    },
    onError: (_error, _variables, context) => restoreSnapshot(queryClient, context?.snapshot),
    onSettled: () => refetchTodos(queryClient),
  });
}

// taak verwijderen verdwijnt meteen en de teller gaat omlaag
export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: TodoItem) => apiClient.delete(`/todoitems/${task.id}/`),
    onMutate: async (task) => {
      const snapshot = await takeSnapshot(queryClient);
      queryClient.setQueriesData<Pages<TodoItem>>({ queryKey: [...itemsKey, task.todo_list] }, (data) =>
        mapPages(data, (tasks) => tasks.filter((item) => item.id !== task.id)),
      );
      changeListCounts(queryClient, task.todo_list, -1, task.completed ? -1 : 0);
      return { snapshot };
    },
    onError: (_error, _task, context) => restoreSnapshot(queryClient, context?.snapshot),
    onSettled: () => refetchTodos(queryClient),
  });
}
