import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import BottomNavigation from "./components/BottomNavigation";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { MatchProvider } from "./contexts/MatchContext";
import { SimpleAuthProvider } from "./hooks/useSimpleAuth";
import { useTheme } from "./hooks/useTheme";

const HomePage = lazy(() => import("./pages/HomePage"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const IPLPage = lazy(() => import("./pages/IPLPage"));
const PSLPage = lazy(() => import("./pages/PSLPage"));
const InternationalPage = lazy(() => import("./pages/InternationalPage"));
const LiveScorePage = lazy(() => import("./pages/LiveScorePage"));
const MatchDetailPage = lazy(() => import("./pages/MatchDetailPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const ArticleDetailPage = lazy(() => import("./pages/ArticleDetailPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const UpcomingMatchesPage = lazy(() => import("./pages/UpcomingMatchesPage"));
const SeriesPage = lazy(() => import("./pages/SeriesPage"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-2 border-cric-red border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function RootLayout() {
  const { theme, toggleTheme } = useTheme();
  return (
    <SimpleAuthProvider>
      <MatchProvider>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <Navbar theme={theme} onToggleTheme={toggleTheme} />
          <main className="flex-1 pb-16 md:pb-0">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </main>
          <Footer />
          <BottomNavigation />
          <Toaster />
        </div>
      </MatchProvider>
    </SimpleAuthProvider>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const newsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/news",
  component: NewsPage,
});
const iplRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ipl",
  component: IPLPage,
});
const pslRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/psl",
  component: PSLPage,
});
const intlRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/international",
  component: InternationalPage,
});
const liveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/live-score",
  component: LiveScorePage,
});
const matchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/match/$matchId",
  component: MatchDetailPage,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});
const articleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/article/$id",
  component: ArticleDetailPage,
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});
const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy-policy",
  component: PrivacyPolicyPage,
});
const upcomingMatchesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/upcoming-matches",
  component: UpcomingMatchesPage,
});
const seriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/series",
  component: SeriesPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  newsRoute,
  iplRoute,
  pslRoute,
  intlRoute,
  liveRoute,
  matchRoute,
  adminRoute,
  articleRoute,
  aboutRoute,
  contactRoute,
  privacyRoute,
  upcomingMatchesRoute,
  seriesRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
