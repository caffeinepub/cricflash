import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useArticles } from "../hooks/useQueries";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: articles = [] } = useArticles();

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const trimmed = query.trim().toLowerCase();
  const results = trimmed
    ? articles.filter(
        (a) =>
          a.status === "published" &&
          (a.title.toLowerCase().includes(trimmed) ||
            a.content.toLowerCase().includes(trimmed)),
      )
    : [];

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
            placeholder="Search articles\u2026"
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
            {results.length === 0 ? (
              <p
                className="py-6 text-sm text-muted-foreground text-center"
                data-ocid="search.empty_state"
              >
                No results found
              </p>
            ) : (
              <ul className="flex flex-col gap-2 mt-1">
                {results.map((article, idx) => (
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
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
