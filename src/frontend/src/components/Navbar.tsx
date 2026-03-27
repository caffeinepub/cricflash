import { Button } from "@/components/ui/button";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, Moon, Search, Sun, Zap } from "lucide-react";
import { useState } from "react";
import { useSimpleAuth } from "../hooks/useSimpleAuth";
import DrawerMenu from "./DrawerMenu";
import SearchOverlay from "./SearchOverlay";

interface NavbarProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

const NAV_LINKS = [
  { label: "HOME", path: "/" },
  { label: "NEWS", path: "/news" },
  { label: "IPL", path: "/ipl" },
  { label: "PSL", path: "/psl" },
  { label: "INTERNATIONAL", path: "/international" },
  { label: "SERIES", path: "/series" },
  { label: "LIVE SCORE", path: "/live-score" },
];

const INNER_PATHS = [
  "/ipl",
  "/psl",
  "/international",
  "/live-score",
  "/news",
  "/series",
  "/admin",
  "/upcoming-matches",
];
const isInnerPage = (path: string) =>
  INNER_PATHS.some((p) => path === p) ||
  path.startsWith("/match/") ||
  path.startsWith("/article/");

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const { isAdmin, logout } = useSimpleAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  const showBack = isInnerPage(pathname);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-card">
        <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {showBack && (
              <button
                type="button"
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-accent transition-colors mr-1"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
            <Link
              to="/"
              className="flex items-center gap-2 shrink-0"
              data-ocid="nav.link"
            >
              <div className="w-8 h-8 rounded-full bg-cric-red flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" fill="white" />
              </div>
              <span className="text-lg font-extrabold tracking-tight">
                <span className="text-foreground">CRIC</span>
                <span className="text-cric-red">FLASH</span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-ocid="nav.link"
                className={`text-xs font-semibold tracking-widest transition-colors ${
                  pathname === link.path
                    ? "text-cric-red"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                data-ocid="nav.link"
                className={`text-xs font-semibold tracking-widest transition-colors ${
                  pathname === "/admin"
                    ? "text-cric-red"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ADMIN
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle theme"
              data-ocid="nav.toggle"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Moon className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Search"
              data-ocid="nav.button"
            >
              <Search className="w-4 h-4 text-muted-foreground" />
            </button>
            {isAdmin && (
              <Button
                size="sm"
                variant="outline"
                onClick={logout}
                className="hidden md:inline-flex text-xs"
                data-ocid="nav.button"
              >
                Sign Out
              </Button>
            )}
            <DrawerMenu />
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
