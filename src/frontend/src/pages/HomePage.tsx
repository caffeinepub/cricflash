import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import { ChevronRight, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import ArticleCard from "../components/ArticleCard";
import LiveTicker from "../components/LiveTicker";
import MatchCard from "../components/MatchCard";
import {
  ArticleCardSkeleton,
  HeroSkeleton,
  MatchCardSkeleton,
} from "../components/SkeletonCard";
import { useArticles } from "../hooks/useQueries";
import {
  type CricMatch,
  getLiveMatches,
  getUpcomingMatches,
} from "../services/cricapi";

const currentYear = new Date().getFullYear();

const CATEGORIES = ["News", "IPL", "International", "General"];
const POPULAR_SERIES = [
  { label: `Indian Premier League ${currentYear}`, path: "/ipl" as const },
  {
    label: `ICC Champions Trophy ${currentYear}`,
    path: "/international" as const,
  },
  { label: `The Ashes ${currentYear}`, path: "/international" as const },
  { label: "World Test Championship", path: "/international" as const },
];

function getMatchLabel(match: CricMatch): string {
  const name = match.name || "";
  const lower = name.toLowerCase();
  if (lower.includes("ipl")) return "IPL";
  if (lower.includes("psl")) return "PSL";
  if (match.matchType) return match.matchType.toUpperCase();
  return "Match";
}

export default function HomePage() {
  const [liveMatches, setLiveMatches] = useState<CricMatch[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<CricMatch[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const { data: articles = [], isLoading: loadingArticles } = useArticles();

  useEffect(() => {
    document.title = "CricFlash – Live Cricket Scores, News & Updates";
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadMatches = async () => {
      setLoadingMatches(true);
      try {
        const [live, upcoming] = await Promise.all([
          getLiveMatches(),
          getUpcomingMatches(),
        ]);
        if (!cancelled) {
          setLiveMatches(live.slice(0, 5));
          const filtered = upcoming
            .filter((m) => !m.matchStarted && !m.matchEnded)
            .sort((a, b) => {
              const da = a.dateTimeGMT || a.date || "";
              const db = b.dateTimeGMT || b.date || "";
              return da.localeCompare(db);
            })
            .slice(0, 10);
          setUpcomingMatches(filtered);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoadingMatches(false);
      }
    };
    loadMatches();
    const interval = setInterval(loadMatches, 90_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const heroArticle = articles[0];
  const gridArticles = articles.slice(1, 5);
  const moreArticles = articles.slice(5, 9);

  return (
    <div>
      <LiveTicker />
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column */}
          <div className="flex-1 min-w-0 space-y-8">
            <section>
              {loadingArticles ? (
                <HeroSkeleton />
              ) : heroArticle ? (
                <ArticleCard
                  article={heroArticle}
                  variant="hero"
                  category="Featured"
                />
              ) : (
                <div className="w-full h-[380px] rounded-2xl bg-card border border-border flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground text-lg">
                      No featured articles yet
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Check back soon for the latest cricket news
                    </p>
                  </div>
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">
                  Latest News
                </h2>
                <Link
                  to="/news"
                  className="text-sm text-cric-red hover:underline flex items-center gap-1"
                  data-ocid="home.link"
                >
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              {loadingArticles ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((n) => (
                    <ArticleCardSkeleton key={n} />
                  ))}
                </div>
              ) : gridArticles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {gridArticles.map((a, gi) => (
                    <ArticleCard
                      key={a.id}
                      article={a}
                      variant="grid"
                      category={CATEGORIES[gi % CATEGORIES.length]}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="bg-card border border-border rounded-xl p-8 text-center"
                  data-ocid="home.empty_state"
                >
                  <p className="text-muted-foreground">
                    No articles yet. Check back soon!
                  </p>
                </div>
              )}
            </section>

            {moreArticles.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-foreground mb-4">
                  More Cricket News
                </h2>
                <div className="space-y-4">
                  {moreArticles.map((a, mi) => (
                    <ArticleCard
                      key={a.id}
                      article={a}
                      variant="horizontal"
                      category={CATEGORIES[mi % CATEGORIES.length]}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-[340px] shrink-0 space-y-6">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-4 pt-4 pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground">Live Matches</h3>
                  <span className="flex items-center gap-1 text-xs text-cric-red font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-cric-red animate-pulse" />
                    LIVE
                  </span>
                </div>
              </div>
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="w-full rounded-none border-b border-border bg-transparent px-4 h-9">
                  <TabsTrigger
                    value="summary"
                    className="text-xs"
                    data-ocid="home.tab"
                  >
                    Match Summary
                  </TabsTrigger>
                  <TabsTrigger
                    value="scores"
                    className="text-xs"
                    data-ocid="home.tab"
                  >
                    Scores
                  </TabsTrigger>
                  <TabsTrigger
                    value="stats"
                    className="text-xs"
                    data-ocid="home.tab"
                  >
                    Stats
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="p-4 space-y-3">
                  {loadingMatches ? (
                    [1, 2].map((n) => <MatchCardSkeleton key={n} />)
                  ) : liveMatches.length > 0 ? (
                    liveMatches
                      .slice(0, 3)
                      .map((m) => <MatchCard key={m.id} match={m} />)
                  ) : (
                    <p
                      className="text-sm text-muted-foreground text-center py-4"
                      data-ocid="home.empty_state"
                    >
                      No live matches right now
                    </p>
                  )}
                </TabsContent>
                <TabsContent value="scores" className="p-4">
                  {liveMatches.slice(0, 3).map((m) => (
                    <div key={m.id} className="mb-3">
                      <p className="text-xs font-semibold text-foreground mb-1">
                        {m.name}
                      </p>
                      {m.score?.map((s, si) => (
                        <p
                          key={`${s.inning}-${si}`}
                          className="text-xs text-muted-foreground"
                        >
                          {s.inning}: {s.r}/{s.w} ({s.o} ov)
                        </p>
                      ))}
                    </div>
                  ))}
                  {liveMatches.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No live matches
                    </p>
                  )}
                </TabsContent>
                <TabsContent value="stats" className="p-4">
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Stats coming soon
                  </p>
                </TabsContent>
              </Tabs>
              <div className="px-4 pb-4">
                <Link
                  to="/live-score"
                  className="text-xs text-cric-red hover:underline"
                  data-ocid="home.link"
                >
                  View all live matches →
                </Link>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-foreground">Upcoming Matches</h3>
                <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              {loadingMatches ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((n) => (
                    <MatchCardSkeleton key={n} />
                  ))}
                </div>
              ) : upcomingMatches.length > 0 ? (
                <div className="space-y-1 max-h-[420px] overflow-y-auto pr-1">
                  {upcomingMatches.map((m) => (
                    <Link
                      to="/match/$matchId"
                      params={{ matchId: m.id }}
                      key={m.id}
                      className="flex items-start justify-between py-2.5 px-1 border-b border-border last:border-0 hover:opacity-80 transition-opacity gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {m.teams?.length === 2
                            ? `${m.teams[0]} vs ${m.teams[1]}`
                            : m.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {m.dateTimeGMT || m.date
                            ? new Date(m.dateTimeGMT || m.date).toLocaleString(
                                [],
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )
                            : "TBD"}
                        </p>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          Upcoming
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0 mt-0.5">
                        {getMatchLabel(m)}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p
                  className="text-sm text-muted-foreground text-center py-4"
                  data-ocid="home.empty_state"
                >
                  No upcoming matches found
                </p>
              )}
              <Link
                to="/live-score"
                className="text-xs text-cric-red hover:underline mt-3 block"
                data-ocid="home.link"
              >
                Show more →
              </Link>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-bold text-foreground mb-3">Popular Series</h3>
              <div className="space-y-2">
                {POPULAR_SERIES.map((s) => (
                  <Link
                    key={s.label}
                    to={s.path}
                    data-ocid="home.button"
                    className="block w-full text-left text-sm font-medium text-foreground bg-accent hover:bg-cric-red hover:text-white px-4 py-2.5 rounded-lg transition-colors"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
