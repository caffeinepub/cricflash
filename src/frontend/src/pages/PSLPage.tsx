import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import ArticleCard from "../components/ArticleCard";
import { ArticleCardSkeleton } from "../components/SkeletonCard";
import { useArticles } from "../hooks/useQueries";

const currentYear = new Date().getFullYear();

export default function PSLPage() {
  const { data: articles = [], isLoading, isError, refetch } = useArticles();
  const pslArticles = articles.filter(
    (a) => a.category === "PSL" && a.status !== "draft",
  );

  useEffect(() => {
    document.title = `PSL ${currentYear} – CricFlash`;
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
            PSL {currentYear}
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-foreground">
          Pakistan Super League
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Latest PSL news, scores, and analysis
        </p>
      </div>
      <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-r from-green-700 to-teal-600">
        <div className="px-8 py-10">
          <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-2">
            Pakistan Super League
          </p>
          <h2 className="text-3xl font-extrabold text-white">
            PSL {currentYear} Season
          </h2>
          <p className="text-white/80 mt-2 text-sm">
            Pakistan's premier T20 league. Top teams, world-class players.
          </p>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-6xl opacity-20">
          🏏
        </div>
      </div>
      {isError && (
        <div
          className="flex items-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4 mb-6"
          data-ocid="psl.error_state"
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
          data-ocid="psl.loading_state"
        >
          {[1, 2, 3].map((n) => (
            <ArticleCardSkeleton key={n} />
          ))}
        </div>
      ) : pslArticles.length === 0 ? (
        <div
          className="text-center py-16 bg-card border border-border rounded-xl"
          data-ocid="psl.empty_state"
        >
          <p className="text-4xl mb-4">🏏</p>
          <p className="text-muted-foreground text-lg">No PSL articles yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            PSL content will appear here once published
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pslArticles.map((a, i) => (
            <div key={a.id} data-ocid={`psl.item.${i + 1}`}>
              <ArticleCard article={a} variant="grid" category={a.category} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
