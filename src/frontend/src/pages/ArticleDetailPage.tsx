import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, Calendar, User } from "lucide-react";
import { useEffect } from "react";
import { useArticle } from "../hooks/useQueries";

const CRICKET_IMAGES = [
  "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200",
  "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=1200",
  "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200",
  "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=1200",
];

function getFallbackImage(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return CRICKET_IMAGES[Math.abs(hash) % CRICKET_IMAGES.length];
}

function formatDate(createdAt: bigint): string {
  const ms = Number(createdAt) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ArticleDetailPage() {
  const { id } = useParams({ from: "/article/$id" });
  const { data: article, isLoading, isError, refetch } = useArticle(id);

  useEffect(() => {
    if (article) document.title = `${article.title} – CricFlash`;
  }, [article]);

  if (isLoading) {
    return (
      <div
        className="max-w-[800px] mx-auto px-4 py-8 space-y-6"
        data-ocid="article.loading_state"
      >
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-32" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-4 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-8">
        <div
          className="flex items-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4"
          data-ocid="article.error_state"
        >
          <AlertCircle className="w-4 h-4" />
          <p>Failed to load article</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            className="ml-auto"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Article not found.</p>
        <Link
          to="/news"
          className="text-cric-red hover:underline text-sm mt-2 inline-block"
        >
          Back to News
        </Link>
      </div>
    );
  }

  const imageUrl = article.imageUrl?.trim()
    ? article.imageUrl
    : getFallbackImage(article.id);

  const paragraphs = article.content.split("\n\n").filter(Boolean);

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <Link
        to="/news"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        data-ocid="article.link"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to News
      </Link>
      <img
        src={imageUrl}
        alt={article.title}
        loading="lazy"
        className="w-full h-64 md:h-80 object-cover rounded-2xl mb-6"
      />
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <span className="bg-cric-red text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
          {article.category || "Cricket"}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {formatDate(article.createdAt)}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <User className="w-3 h-3" />
          Admin
        </span>
      </div>
      <h1 className="text-2xl md:text-3xl font-extrabold text-foreground leading-snug mb-4">
        {article.title}
      </h1>
      {article.excerpt?.trim() && (
        <p className="text-base italic text-muted-foreground mb-6 border-l-2 border-cric-red/40 pl-4">
          {article.excerpt}
        </p>
      )}
      <div className="space-y-4">
        {paragraphs.map((para) => {
          const key = para.slice(0, 40);
          if (para.startsWith("## "))
            return (
              <h2
                key={key}
                className="text-xl font-bold text-foreground mt-8 mb-3"
              >
                {para.slice(3)}
              </h2>
            );
          if (para.startsWith("### "))
            return (
              <h3
                key={key}
                className="text-lg font-semibold text-foreground mt-6 mb-2"
              >
                {para.slice(4)}
              </h3>
            );
          return (
            <p
              key={key}
              className="text-base text-foreground/90 leading-relaxed"
            >
              {para}
            </p>
          );
        })}
      </div>
      {article.tags && article.tags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="bg-cric-red/10 text-cric-red text-xs font-semibold px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
