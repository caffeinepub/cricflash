import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Article } from "../backend.d";

const STORAGE_KEY = "cricflash_articles";

function loadArticles(): Article[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    // createdAt is stored as ms number; cast to bigint for type compat
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (JSON.parse(raw) as any[]).map((a) => ({
      ...a,
      createdAt: BigInt(Math.round(Number(a.createdAt))) as bigint,
    }));
  } catch {
    return [];
  }
}

function saveArticles(articles: Article[]) {
  // Store createdAt as number for JSON-safe serialization
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serializable = (articles as any[]).map((a) => ({
    ...a,
    createdAt: Number(a.createdAt),
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function useArticles() {
  return useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () => loadArticles(),
    staleTime: 0,
  });
}

export function useArticle(id: string | undefined) {
  return useQuery<Article | null>({
    queryKey: ["article", id],
    queryFn: async () => {
      if (!id) return null;
      const articles = loadArticles();
      return articles.find((a) => a.id === id || a.slug === id) ?? null;
    },
    enabled: !!id,
    staleTime: 0,
  });
}

export function useIsAdmin() {
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => false,
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      content,
      category,
      imageUrl,
      slug,
      status,
      featured,
      excerpt,
      tags,
    }: {
      title: string;
      content: string;
      category: string;
      imageUrl: string;
      slug: string;
      status: string;
      featured?: boolean;
      excerpt?: string;
      tags?: string[];
    }) => {
      const articles = loadArticles();
      const nowMs = Date.now();
      const { Principal } = await import("@icp-sdk/core/principal");
      const newArticle: Article = {
        id: generateId(),
        title,
        content,
        category,
        imageUrl: imageUrl || "",
        slug,
        status,
        createdAt: BigInt(nowMs) * 1_000_000n,
        author: Principal.anonymous(),
        featured: featured ?? false,
        excerpt: excerpt ?? "",
        tags: tags ?? [],
        publishedAt: status === "published" ? nowMs : undefined,
      };
      articles.unshift(newArticle);
      saveArticles(articles);
      return newArticle.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useUpdateArticle() {
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
      featured,
      excerpt,
      tags,
    }: {
      id: string;
      title: string;
      content: string;
      category: string;
      imageUrl: string;
      slug: string;
      status: string;
      featured?: boolean;
      excerpt?: string;
      tags?: string[];
    }) => {
      const articles = loadArticles();
      const idx = articles.findIndex((a) => a.id === id);
      if (idx === -1) throw new Error("Article not found");
      const existing = articles[idx];
      const nowMs = Date.now();
      articles[idx] = {
        ...existing,
        title,
        content,
        category,
        imageUrl: imageUrl || "",
        slug,
        status,
        featured: featured ?? existing.featured ?? false,
        excerpt: excerpt ?? existing.excerpt ?? "",
        tags: tags ?? existing.tags ?? [],
        publishedAt:
          status === "published" && !existing.publishedAt
            ? nowMs
            : existing.publishedAt,
      };
      saveArticles(articles);
      return articles[idx];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const articles = loadArticles();
      saveArticles(articles.filter((a) => a.id !== id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}
