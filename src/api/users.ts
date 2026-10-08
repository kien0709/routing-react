import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "./apiClient";

// korte gebruiker voor het toewijzen van taken
export interface UserOption {
  id: number;
  email: string;
  display_name: string;
  photo_url: string;
}

// admins krijgen ook de rol terug
export interface ManagedUser extends UserOption {
  role: "user" | "admin";
  created_at: string;
}

// wat we naar de backend sturen bij aanmaken of bewerken
export interface UserInput {
  email: string;
  display_name: string;
  role: "user" | "admin";
  password?: string;
}

// naam tonen of de email als er geen naam is
export function userName(user: Pick<UserOption, "display_name" | "email">) {
  return user.display_name || user.email;
}

// haalt alle gebruikers op
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await apiClient.get<ManagedUser[]>("/users/");
      return response.data;
    },
  });
}

// nieuwe gebruiker aanmaken en daarna de lijst verversen
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UserInput) => apiClient.post<ManagedUser>("/users/", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}

// gebruiker aanpassen en alles verversen waar de naam in staat
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...input }: Partial<UserInput> & { id: number }) =>
      apiClient.patch<ManagedUser>(`/users/${id}/`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["todolists"] });
      queryClient.invalidateQueries({ queryKey: ["todoitems"] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

// gebruiker verwijderen
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/users/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["todolists"] });
      queryClient.invalidateQueries({ queryKey: ["todoitems"] });
    },
  });
}
