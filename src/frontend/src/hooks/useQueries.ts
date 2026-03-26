import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Article } from "../backend.d";
import { useActor } from "./useActor";

export function useArticles() {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getArticles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useArticle(id: string | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<Article | null>({
    queryKey: ["article", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getArticle(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      content,
      category,
      imageUrl,
      slug,
      status,
    }: {
      title: string;
      content: string;
      category: string;
      imageUrl: string;
      slug: string;
      status: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createArticle(
        title,
        content,
        category,
        imageUrl,
        slug,
        status,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useUpdateArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
      content,
      category,
      imageUrl,
      slug,
      status,
    }: {
      id: string;
      title: string;
      content: string;
      category: string;
      imageUrl: string;
      slug: string;
      status: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateArticle(
        id,
        title,
        content,
        category,
        imageUrl,
        slug,
        status,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useDeleteArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteArticle(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}
