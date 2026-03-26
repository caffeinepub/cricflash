import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import ArticleCard from "../components/ArticleCard";
import { ArticleCardSkeleton } from "../components/SkeletonCard";
import { useArticles } from "../hooks/useQueries";

const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;

const TOURNAMENTS = [
  {
    name: `ICC Champions Trophy ${currentYear}`,
    emoji: "🏆",
    status: "Ongoing",
  },
  { name: "World Test Championship", emoji: "🌍", status: "Ongoing" },
  { name: `The Ashes ${currentYear}`, emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", status: "Upcoming" },
  { name: `ICC T20 World Cup ${nextYear}`, emoji: "⚡", status: "Upcoming" },
];

export default function InternationalPage() {
  const { data: articles = [], isLoading, isError, refetch } = useArticles();
  const intlArticles = articles.filter(
    (a) => a.category === "International" && a.status !== "draft",
  );

  useEffect(() => {
    document.title = "International Cricket – CricFlash";
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground">
          International Cricket
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          ICC tournaments, series, and international matches
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {TOURNAMENTS.map((t) => (
          <div
            key={t.name}
            className="bg-card border border-border rounded-xl p-4 text-center hover:border-cric-border transition-colors"
          >
            <span className="text-3xl block mb-2">{t.emoji}</span>
            <p className="text-xs font-semibold text-foreground line-clamp-2">
              {t.name}
            </p>
            <span
              className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                t.status === "Ongoing"
                  ? "bg-cric-red/10 text-cric-red"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {t.status}
            </span>
          </div>
        ))}
      </div>
      {isError && (
        <div
          className="flex items-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4 mb-6"
          data-ocid="intl.error_state"
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
      <h2 className="text-lg font-bold text-foreground mb-4">
        Latest International News
      </h2>
      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="intl.loading_state"
        >
          {[1, 2, 3].map((n) => (
            <ArticleCardSkeleton key={n} />
          ))}
        </div>
      ) : intlArticles.length === 0 ? (
        <div
          className="text-center py-16 bg-card border border-border rounded-xl"
          data-ocid="intl.empty_state"
        >
          <p className="text-4xl mb-4">🌍</p>
          <p className="text-muted-foreground text-lg">
            No international articles yet
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Content will appear here once published
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {intlArticles.map((a, i) => (
            <div key={a.id} data-ocid={`intl.item.${i + 1}`}>
              <ArticleCard
                article={a}
                variant="grid"
                category="International"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
