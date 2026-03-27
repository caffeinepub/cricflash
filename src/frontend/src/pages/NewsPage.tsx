import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import ArticleCard from "../components/ArticleCard";
import { ArticleCardSkeleton } from "../components/SkeletonCard";
import { useArticles } from "../hooks/useQueries";

export default function NewsPage() {
  const { data: allArticles = [], isLoading, isError, refetch } = useArticles();
  const articles = allArticles
    .filter((a) => a.status === "published")
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

  useEffect(() => {
    document.title = "Cricket News – CricFlash";
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground">
          Cricket News
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Latest cricket news from around the world
        </p>
      </div>
      {isError && (
        <div
          className="flex items-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4 mb-6"
          data-ocid="news.error_state"
        >
          <AlertCircle className="w-4 h-4" />
          <p className="text-sm">Failed to load articles</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            className="ml-auto"
          >
            Retry
          </Button>
        </div>
      )}
      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="news.loading_state"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <ArticleCardSkeleton key={n} />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div
          className="text-center py-16 bg-card border border-border rounded-xl"
          data-ocid="news.empty_state"
        >
          <p className="text-muted-foreground text-lg">No articles yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Check back soon for the latest cricket news
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a, i) => (
            <div key={a.id} data-ocid={`news.item.${i + 1}`}>
              <ArticleCard
                article={a}
                variant="grid"
                category={a.category || "News"}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
