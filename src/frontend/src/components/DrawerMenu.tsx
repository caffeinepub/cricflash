import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart2,
  ChevronDown,
  Globe,
  Info,
  List,
  Menu,
  MoreHorizontal,
  Newspaper,
  Shield,
  Trophy,
  Zap,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { icon: Zap, label: "Live Scores", path: "/live-score" },
  { icon: Trophy, label: "IPL", path: "/ipl" },
  { icon: Globe, label: "International", path: "/international" },
  { icon: BarChart2, label: "PSL", path: "/psl" },
  { icon: List, label: "Series", path: "/series" },
  { icon: Newspaper, label: "News", path: "/news" },
];

const SECONDARY_ITEMS = [
  { icon: Info, label: "About", path: "/about" },
  { icon: Shield, label: "Privacy Policy", path: "/privacy-policy" },
];

export default function DrawerMenu() {
  const [open, setOpen] = useState(false);
  const [othersOpen, setOthersOpen] = useState(false);
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          aria-label="Open menu"
          data-ocid="nav.open_modal_button"
        >
          <Menu className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center px-4 py-4 border-b border-border">
            <Link
              to="/"
              className="flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <div className="w-7 h-7 rounded-full bg-cric-red flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" fill="white" />
              </div>
              <span className="text-base font-extrabold tracking-tight">
                <span className="text-foreground">CRIC</span>
                <span className="text-cric-red">FLASH</span>
              </span>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-0.5 px-2">
              {NAV_ITEMS.map(({ icon: Icon, label, path }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === path
                      ? "text-cric-red bg-cric-red/10"
                      : "text-foreground hover:bg-accent"
                  }`}
                  data-ocid="nav.link"
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </Link>
              ))}
            </div>

            <div className="my-3 mx-4 border-t border-border" />

            {/* Others collapsible */}
            <div className="mt-2 px-2">
              <button
                type="button"
                onClick={() => setOthersOpen((v) => !v)}
                className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
                data-ocid="nav.toggle"
              >
                <span className="flex items-center gap-3">
                  <MoreHorizontal className="w-4 h-4" />
                  Others
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    othersOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {othersOpen && (
                <div className="ml-4 mt-1 space-y-0.5">
                  {SECONDARY_ITEMS.map(({ icon: Icon, label, path }) => (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        pathname === path
                          ? "text-cric-red bg-cric-red/10"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                      data-ocid="nav.link"
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
