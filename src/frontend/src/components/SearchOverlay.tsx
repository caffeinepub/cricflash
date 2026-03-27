import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useArticles } from "../hooks/useQueries";
import {
  type CricMatch,
  getLiveMatches,
  getUpcomingMatches,
} from "../services/cricapi";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<CricMatch[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: articles = [] } = useArticles();

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open || matches.length > 0) return;
    let cancelled = false;
    const load = async () => {
      try {
        const [live, upcoming] = await Promise.all([
          getLiveMatches(),
          getUpcomingMatches(),
        ]);
        if (!cancelled) {
          const all = [...live];
          const liveIds = new Set(live.map((m) => m.id));
          for (const m of upcoming) {
            if (!liveIds.has(m.id)) all.push(m);
          }
          setMatches(all);
        }
      } catch {
        // ignore
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [open, matches.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const trimmed = query.trim().toLowerCase();

  const articleResults = trimmed
    ? articles.filter(
        (a) =>
          a.status === "published" &&
          (a.title.toLowerCase().includes(trimmed) ||
            a.content.toLowerCase().includes(trimmed)),
      )
    : [];

  const matchResults = trimmed
    ? matches.filter(
        (m) =>
          m.name?.toLowerCase().includes(trimmed) ||
          m.teams?.some((t) => t.toLowerCase().includes(trimmed)),
      )
    : [];

  const hasResults = articleResults.length > 0 || matchResults.length > 0;

  const excerpt = (content: string) => {
    const plain = content
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return plain.length > 120 ? `${plain.slice(0, 120)}\u2026` : plain;
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: overlay backdrop dismiss
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      data-ocid="search.modal"
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation */}
      <div
        className="relative bg-card border-b border-border shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center gap-3">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, teams, matches\u2026"
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
            data-ocid="search.input"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-accent transition-colors"
            aria-label="Close search"
            data-ocid="search.close_button"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {trimmed && (
          <div className="max-w-[1200px] mx-auto px-4 pb-4 max-h-[60vh] overflow-y-auto">
            {!hasResults ? (
              <p
                className="py-6 text-sm text-muted-foreground text-center"
                data-ocid="search.empty_state"
              >
                No results found
              </p>
            ) : (
              <ul className="flex flex-col gap-1 mt-1">
                {articleResults.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-muted-foreground px-0 pt-2 pb-1 uppercase tracking-wider">
                      Articles
                    </p>
                    {articleResults.slice(0, 5).map((article, idx) => (
                      <li key={article.id} data-ocid={`search.item.${idx + 1}`}>
                        <Link
                          to="/article/$id"
                          params={{ id: article.id }}
                          onClick={onClose}
                          className="block rounded-lg p-3 hover:bg-accent transition-colors"
                        >
                          <p className="text-sm font-semibold text-foreground line-clamp-1">
                            {article.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {excerpt(article.content)}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </>
                )}
                {matchResults.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-muted-foreground px-0 pt-2 pb-1 uppercase tracking-wider">
                      Matches
                    </p>
                    {matchResults.slice(0, 3).map((m) => (
                      <li key={m.id}>
                        <Link
                          to="/match/$matchId"
                          params={{ matchId: m.id }}
                          onClick={onClose}
                          className="block rounded-lg p-3 hover:bg-accent transition-colors"
                        >
                          <p className="text-sm font-semibold text-foreground line-clamp-1">
                            {m.teams?.length === 2
                              ? `${m.teams[0]} vs ${m.teams[1]}`
                              : m.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {m.name}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </>
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
