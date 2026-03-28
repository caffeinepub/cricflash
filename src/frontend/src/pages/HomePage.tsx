import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import type { Article } from "../backend.d";
import MatchCard from "../components/MatchCard";
import { MatchCardSkeleton } from "../components/SkeletonCard";
import { useMatches } from "../contexts/MatchContext";
import { useArticles } from "../hooks/useQueries";

function formatDate(createdAt: bigint): string {
  const ms = Number(createdAt) / 1_000_000;
  return new Date(ms).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function CategoryBadge({ category }: { category: string }) {
  const colorMap: Record<string, string> = {
    IPL: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
    PSL: "bg-green-500/15 text-green-600 dark:text-green-400",
    International: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    News: "bg-muted text-muted-foreground",
  };
  const cls = colorMap[category] ?? "bg-muted text-muted-foreground";
  return (
    <span
      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cls}`}
    >
      {category}
    </span>
  );
}

function MatchCarousel() {
  const { classified, loading } = useMatches();
  const { live, upcoming, completed } = classified;

  // Home: LIVE first, then nearest upcoming — limit to 5 total
  // upcoming is already sorted by date asc from the pipeline
  const homePool = [...live, ...upcoming];
  const allMatches =
    homePool.length >= 5
      ? homePool.slice(0, 5)
      : [...homePool, ...completed.slice(0, 5 - homePool.length)];

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-foreground">Matches</h2>
        <Link
          to="/live-score"
          className="text-xs text-cric-red hover:underline flex items-center gap-0.5"
          data-ocid="home.link"
        >
          View all <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {loading ? (
          [1, 2, 3].map((n) => (
            <div key={n} className="shrink-0 w-72">
              <MatchCardSkeleton />
            </div>
          ))
        ) : allMatches.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            No matches available
          </p>
        ) : (
          allMatches.map((m) => (
            <div key={m.id} className="shrink-0 w-72">
              <MatchCard match={m} />
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function FeaturedArticle({ article }: { article: Article }) {
  return (
    <section className="mb-6">
      <h2 className="text-base font-bold text-foreground mb-3">Featured</h2>
      <Link
        to="/article/$id"
        params={{ id: article.id }}
        className="block bg-card border border-border rounded-xl overflow-hidden hover:border-cric-red/50 transition-colors"
        data-ocid="home.card"
      >
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
        )}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {article.category && <CategoryBadge category={article.category} />}
            <span className="text-xs text-muted-foreground">
              {formatDate(article.createdAt)}
            </span>
          </div>
          <h3 className="font-bold text-lg text-foreground leading-snug line-clamp-2">
            {article.title}
          </h3>
        </div>
      </Link>
    </section>
  );
}

function ArticleRowCard({ article }: { article: Article }) {
  const excerptText =
    article.excerpt || stripHtml(article.content).slice(0, 100);

  return (
    <Link
      to="/article/$id"
      params={{ id: article.id }}
      className="flex gap-3 py-3 border-b border-border last:border-0 hover:opacity-80 transition-opacity"
      data-ocid="home.link"
    >
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-20 h-20 rounded-lg object-cover shrink-0"
          loading="lazy"
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground line-clamp-2 leading-snug">
          {article.title}
        </p>
        {excerptText && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {excerptText}
          </p>
        )}
      </div>
    </Link>
  );
}

function CompactArticleCard({ article }: { article: Article }) {
  return (
    <Link
      to="/article/$id"
      params={{ id: article.id }}
      className="flex gap-3 items-start py-2.5 border-b border-border last:border-0 hover:opacity-80 transition-opacity"
      data-ocid="home.link"
    >
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-16 h-16 rounded object-cover shrink-0"
          loading="lazy"
        />
      )}
      <div className="flex-1 min-w-0">
        {article.category && <CategoryBadge category={article.category} />}
        <p className="text-sm font-bold text-foreground line-clamp-2 leading-snug mt-1">
          {article.title}
        </p>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { data: allArticles = [], isLoading: loadingArticles } = useArticles();

  useEffect(() => {
    document.title = "CricFlash \u2013 Live Cricket Scores, News & Updates";
  }, []);

  const published = allArticles
    .filter((a) => a.status === "published")
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

  const featuredArticle = published.find((a) => a.featured) ?? null;

  const latestNews = published
    .filter((a) => !featuredArticle || a.id !== featuredArticle.id)
    .slice(0, 5);

  const shownIds = new Set([
    ...(featuredArticle ? [featuredArticle.id] : []),
    ...latestNews.map((a) => a.id),
  ]);

  const getCategory = (cat: string) =>
    published
      .filter(
        (a) =>
          !shownIds.has(a.id) &&
          a.category?.toLowerCase() === cat.toLowerCase(),
      )
      .slice(0, 5);

  const iplArticles = getCategory("IPL");
  const pslArticles = getCategory("PSL");
  const intlArticles = getCategory("International");

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      {/* Match Carousel — uses shared MatchContext, same MatchCard as Matches tab */}
      <MatchCarousel />

      {!loadingArticles && featuredArticle && (
        <FeaturedArticle article={featuredArticle} />
      )}

      {/* Latest News */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-foreground">Latest News</h2>
          <Link
            to="/news"
            className="text-xs text-cric-red hover:underline flex items-center gap-0.5"
            data-ocid="home.link"
          >
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="bg-card border border-border rounded-xl px-4">
          {loadingArticles ? (
            <div className="space-y-3 py-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="flex gap-3 py-3 border-b border-border last:border-0"
                >
                  <div className="w-20 h-20 rounded-lg bg-muted animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-3 bg-muted animate-pulse rounded w-full" />
                    <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : latestNews.length > 0 ? (
            latestNews.map((a) => <ArticleRowCard key={a.id} article={a} />)
          ) : (
            <p
              className="py-8 text-sm text-muted-foreground text-center"
              data-ocid="home.empty_state"
            >
              No articles yet. Check back soon!
            </p>
          )}
        </div>
      </section>

      {/* IPL Section */}
      {!loadingArticles && iplArticles.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-foreground">IPL</h2>
            <Link
              to="/ipl"
              className="text-xs text-cric-red hover:underline flex items-center gap-0.5"
              data-ocid="home.link"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="bg-card border border-border rounded-xl px-4">
            {iplArticles.map((a) => (
              <CompactArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      {/* PSL Section */}
      {!loadingArticles && pslArticles.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-foreground">PSL</h2>
            <Link
              to="/psl"
              className="text-xs text-cric-red hover:underline flex items-center gap-0.5"
              data-ocid="home.link"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="bg-card border border-border rounded-xl px-4">
            {pslArticles.map((a) => (
              <CompactArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      {/* International Section */}
      {!loadingArticles && intlArticles.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-foreground">
              International
            </h2>
            <Link
              to="/international"
              className="text-xs text-cric-red hover:underline flex items-center gap-0.5"
              data-ocid="home.link"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="bg-card border border-border rounded-xl px-4">
            {intlArticles.map((a) => (
              <CompactArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
