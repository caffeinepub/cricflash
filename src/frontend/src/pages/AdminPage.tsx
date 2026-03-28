import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Loader2,
  LogIn,
  Play,
  Plus,
  RefreshCw,
  Send,
  Star,
  Tag,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Article } from "../backend.d";
import { useActor } from "../hooks/useActor";
import {
  useArticles,
  useCreateArticle,
  useDeleteArticle,
  useUpdateArticle,
} from "../hooks/useQueries";
import { useSimpleAuth } from "../hooks/useSimpleAuth";
import {
  type NormalizedMatch,
  getClassifiedMatches,
} from "../services/cricapi";
import {
  type TelegramSettings,
  buildTelegramMessage,
  loadTelegramSettings,
  saveTelegramSettings,
} from "../utils/telegram";

function formatDate(createdAt: bigint): string {
  const ms = Number(createdAt) / 1_000_000;
  return new Date(ms).toLocaleDateString();
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function matchSlug(team1: string, team2: string, suffix: string): string {
  const t1 = team1
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const t2 = team2
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return `${t1}-vs-${t2}-${suffix}-${new Date().getFullYear()}`;
}

function formatMatchDate(d: Date | null): string {
  if (!d) return "Date TBA";
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getArticleCategory(series: string): string {
  const s = series.toLowerCase();
  if (s.includes("ipl")) return "IPL";
  if (s.includes("psl")) return "PSL";
  if (s.includes("women") || s.includes("woman")) return "Women";
  return "International";
}

function getArticleImage(series: string): string {
  const s = series.toLowerCase();
  if (s.includes("ipl")) return "/assets/generated/ipl.dim_800x400.jpg";
  if (s.includes("psl")) return "/assets/generated/psl.dim_800x400.jpg";
  return "/assets/generated/cricket-default.dim_800x400.jpg";
}

type ArticleType = "dream11" | "prediction" | "pitchReport" | "playingXI";

const TEAM_PLAYERS: Record<
  string,
  {
    batters: string[];
    allRounders: string[];
    keepers: string[];
    bowlers: string[];
  }
> = {
  "Royal Challengers Bengaluru": {
    batters: ["Virat Kohli", "Faf du Plessis", "Rajat Patidar"],
    allRounders: ["Glenn Maxwell", "Cameron Green"],
    keepers: ["Dinesh Karthik"],
    bowlers: ["Mohammed Siraj", "Josh Hazlewood", "Wanindu Hasaranga"],
  },
  "Mumbai Indians": {
    batters: ["Rohit Sharma", "Suryakumar Yadav", "Tilak Varma"],
    allRounders: ["Hardik Pandya", "Tim David"],
    keepers: ["Ishan Kishan"],
    bowlers: ["Jasprit Bumrah", "Piyush Chawla"],
  },
  "Chennai Super Kings": {
    batters: ["Ruturaj Gaikwad", "Devon Conway", "Ajinkya Rahane"],
    allRounders: ["Ravindra Jadeja", "Moeen Ali"],
    keepers: ["MS Dhoni"],
    bowlers: ["Deepak Chahar", "Matheesha Pathirana", "Tushar Deshpande"],
  },
  "Kolkata Knight Riders": {
    batters: ["Shreyas Iyer", "Venkatesh Iyer", "Phil Salt"],
    allRounders: ["Andre Russell", "Sunil Narine"],
    keepers: ["Rahmanullah Gurbaz"],
    bowlers: ["Mitchell Starc", "Varun Chakravarthy"],
  },
  "Delhi Capitals": {
    batters: ["David Warner", "Jake Fraser-McGurk", "Rishabh Pant"],
    allRounders: ["Axar Patel", "Tristan Stubbs"],
    keepers: ["Rishabh Pant"],
    bowlers: ["Anrich Nortje", "Kuldeep Yadav", "Mukesh Kumar"],
  },
  "Rajasthan Royals": {
    batters: ["Jos Buttler", "Yashasvi Jaiswal", "Sanju Samson"],
    allRounders: ["Ravichandran Ashwin", "Shimron Hetmyer"],
    keepers: ["Sanju Samson"],
    bowlers: ["Trent Boult", "Yuzvendra Chahal", "Sandeep Sharma"],
  },
  "Sunrisers Hyderabad": {
    batters: ["Travis Head", "Abhishek Sharma", "Aiden Markram"],
    allRounders: ["Washington Sundar", "Marco Jansen"],
    keepers: ["Heinrich Klaasen"],
    bowlers: ["Pat Cummins", "T Natarajan", "Mayank Markande"],
  },
  "Punjab Kings": {
    batters: ["Shikhar Dhawan", "Jonny Bairstow", "Sam Curran"],
    allRounders: ["Liam Livingstone", "Harpreet Brar"],
    keepers: ["Jitesh Sharma"],
    bowlers: ["Kagiso Rabada", "Arshdeep Singh"],
  },
  "Lucknow Super Giants": {
    batters: ["KL Rahul", "Quinton de Kock", "Marcus Stoinis"],
    allRounders: ["Krunal Pandya", "Kyle Mayers"],
    keepers: ["KL Rahul"],
    bowlers: ["Ravi Bishnoi", "Mark Wood", "Mohsin Khan"],
  },
  "Gujarat Titans": {
    batters: ["Shubman Gill", "David Miller", "Wriddhiman Saha"],
    allRounders: ["Hardik Pandya", "Vijay Shankar"],
    keepers: ["Wriddhiman Saha"],
    bowlers: ["Mohammed Shami", "Rashid Khan", "Noor Ahmad"],
  },
};

function getTeamPlayers(team: string) {
  return (
    TEAM_PLAYERS[team] || {
      batters: [],
      allRounders: [],
      keepers: [],
      bowlers: [],
    }
  );
}

function buildPlayingXI(team: string): string[] {
  const p = getTeamPlayers(team);
  const xi: string[] = [];
  xi.push(...p.keepers.slice(0, 1));
  xi.push(...p.batters.slice(0, 3));
  xi.push(...p.allRounders.slice(0, 3));
  xi.push(...p.bowlers.slice(0, 3));
  while (xi.length < 11) xi.push(`${team} Player ${xi.length + 1}`);
  return xi.slice(0, 11);
}

function getPitchType(venue: string): string {
  const v = venue.toLowerCase();
  if (v.includes("wankhede") || v.includes("mumbai"))
    return "batting-friendly with pace off the surface. Expect high scores — both teams should target 170+.";
  if (v.includes("chepauk") || v.includes("chennai"))
    return "spin-friendly. The ball will grip and turn, making spinners a key weapon. Low-scoring game expected.";
  if (
    v.includes("chinnaswamy") ||
    v.includes("bengaluru") ||
    v.includes("bangalore")
  )
    return "a batting paradise. Small ground and flat surface mean every game here goes to the wire.";
  if (v.includes("eden") || v.includes("kolkata"))
    return "well-balanced. Pacers dominate in the first 6 overs, spinners come into play in the middle, and batters can score freely throughout.";
  if (v.includes("arun jaitley") || v.includes("delhi") || v.includes("kotla"))
    return "flat and good for batting, but dew in evening games adds advantage to the chasing team.";
  if (v.includes("narendra modi") || v.includes("ahmedabad"))
    return "large ground with a good surface. Pacers get some help early; batters settle in as the game progresses.";
  if (v.includes("lahore"))
    return "a batter's track. High-scoring game expected. Spinners could be effective in the second half.";
  if (v.includes("karachi"))
    return "pace-friendly initially, flattening out for batting as the game progresses. Expect competitive totals.";
  if (v.includes("rawalpindi"))
    return "known for big scores. The flat outfield and true surface make this a batting-friendly ground.";
  return "a well-maintained surface that provides competitive cricket. Pacers get help early, with batters scoring freely as the game progresses.";
}

function buildArticlePayload(
  match: NormalizedMatch,
  type: ArticleType,
): {
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  excerpt: string;
  status: string;
  featured: boolean;
  imageUrl: string;
  excerpt_short: string;
} {
  const { team1, team2, venue, matchDate, matchType, series } = match;
  const year = new Date().getFullYear();
  const formattedDate = formatMatchDate(matchDate);
  const category = getArticleCategory(series);
  const imageUrl = getArticleImage(series);
  const tags = [team1, team2, matchType.toUpperCase(), category].filter(
    Boolean,
  );

  const pitchDesc = getPitchType(venue);
  const t1xi = buildPlayingXI(team1);
  const t2xi = buildPlayingXI(team2);
  const t1p = getTeamPlayers(team1);
  const t2p = getTeamPlayers(team2);
  const captain = t1p.batters[0] || t1p.allRounders[0] || `${team1} Captain`;
  const vc = t2p.batters[0] || t2p.allRounders[0] || `${team2} Captain`;
  const safePicks = [
    t1p.allRounders[0] || t1p.batters[1] || `${team1} All-rounder`,
    t2p.allRounders[0] || t2p.batters[1] || `${team2} All-rounder`,
    t1p.bowlers[0] || `${team1} Bowler`,
  ].filter(Boolean);

  let title = "";
  let slug = "";
  let content = "";

  if (type === "dream11") {
    title = `${team1} vs ${team2} Dream11 Prediction ${year}: Best Team & Tips`;
    slug = matchSlug(team1, team2, "dream11-prediction");
    content = [
      `## ${team1} vs ${team2} Dream11 Prediction ${year}`,
      "",
      `${team1} take on ${team2} at ${venue} on ${formattedDate}. Here are our Dream11 tips for this ${matchType.toUpperCase()} fixture.`,
      "",
      "## Match Details",
      `- **Teams:** ${team1} vs ${team2}`,
      `- **Date:** ${formattedDate}`,
      `- **Venue:** ${venue}`,
      `- **Format:** ${matchType.toUpperCase()}`,
      `- **Series:** ${series}`,
      "",
      "## Pitch Report",
      `${venue} is ${pitchDesc}`,
      "",
      "## Head-to-Head",
      `${team1} and ${team2} have a competitive recent history. Their meetings have been closely fought, with both sides capable of winning on their day.`,
      "",
      `## ${team1} Probable XI`,
      ...t1xi.map((p, i) => `${i + 1}. ${p}`),
      "",
      `## ${team2} Probable XI`,
      ...t2xi.map((p, i) => `${i + 1}. ${p}`),
      "",
      "## Dream11 Tips",
      `- **Captain:** ${captain} — consistent performer and always in the runs`,
      `- **Vice-Captain:** ${vc} — high upside with bat and provides bonus points`,
      `- **Safe Picks:** ${safePicks.join(", ")}`,
      "- Pick bowlers who have taken wickets in the last 3 matches",
      "",
      "## Prediction",
      `${team1} look slightly stronger heading into this fixture. **${team1} to win.**`,
    ].join("\n");
  } else if (type === "prediction") {
    title = `${team1} vs ${team2} Match Prediction ${year}: Who Will Win?`;
    slug = matchSlug(team1, team2, "match-prediction");
    content = [
      `## ${team1} vs ${team2} Match Prediction ${year}`,
      "",
      `${team1} and ${team2} clash in a ${matchType.toUpperCase()} at ${venue} on ${formattedDate}.`,
      "",
      "## Match Details",
      `- **Teams:** ${team1} vs ${team2}`,
      `- **Date:** ${formattedDate}`,
      `- **Venue:** ${venue}`,
      `- **Format:** ${matchType.toUpperCase()}`,
      `- **Series:** ${series}`,
      "",
      "## Head-to-Head",
      "Both sides have been evenly matched in recent encounters. This rivalry always produces competitive cricket.",
      "",
      `## ${team1} — Form & Strengths`,
      `${team1} have been performing well in recent outings. Their top-order provides a strong foundation, and the pace attack has been consistent.`,
      "",
      `## ${team2} — Form & Strengths`,
      `${team2} are a well-drilled side with match-winners across all departments. They are capable of turning the game at any point.`,
      "",
      "## Pitch & Conditions",
      `${venue} offers ${pitchDesc}`,
      "",
      "## Key Battles",
      `- ${t1p.batters[0] || `${team1} batter`} vs ${t2p.bowlers[0] || `${team2} bowler`}`,
      `- ${t2p.batters[0] || `${team2} batter`} vs ${t1p.bowlers[0] || `${team1} bowler`}`,
      "",
      "## Our Prediction",
      `Close call. On current form, **${team1} edge this one**, but don\'t rule out ${team2}.`,
    ].join("\n");
  } else if (type === "pitchReport") {
    const venueSlug = venue
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    title = `${venue} Pitch Report: ${team1} vs ${team2} ${year}`;
    slug = `${venueSlug}-pitch-report-${matchSlug(team1, team2, "").replace(/-$/, "")}-${year}`;
    const isBattingFriendly =
      pitchDesc.toLowerCase().includes("batting") ||
      pitchDesc.toLowerCase().includes("flat") ||
      pitchDesc.toLowerCase().includes("paradise");
    const hasDew = pitchDesc.toLowerCase().includes("dew");
    const isSpinFriendly = pitchDesc.toLowerCase().includes("spin");
    content = [
      `## ${venue} Pitch Report — ${team1} vs ${team2}`,
      "",
      `${matchType.toUpperCase()} match at ${venue} on ${formattedDate}.`,
      "",
      "## Pitch Analysis",
      `${venue} is ${pitchDesc}`,
      "",
      "## Surface Breakdown",
      "- **Early Overs:** Pacers will find assistance. The new ball should move in the first 6 overs.",
      "- **Middle Overs:** Pitch eases. Spinners come into play. Set batters can score freely.",
      "- **Death Overs:** Flat surface, high scoring. Slower balls and variations are key.",
      "",
      "## Batting vs Bowling",
      isBattingFriendly
        ? "Batting-friendly venue. Teams should aim for 160+ if batting first. Par score: 165-180."
        : "Decent contest between bat and ball. A score of 150-160 should be competitive.",
      "",
      "## Toss Impact",
      hasDew
        ? "Evening matches here are heavily impacted by dew. Chasing teams have a strong advantage once dew sets in."
        : "The toss is important but not decisive. Both sides have won batting and chasing at this venue.",
      "",
      "## Fantasy Tip",
      isSpinFriendly
        ? "Pick 2-3 spinners in your Dream11 team. The pitch will assist them significantly."
        : "Back your pacers for the powerplay and switch to batters for the final fantasy push.",
    ].join("\n");
  } else {
    title = `${team1} vs ${team2} Playing XI ${year}: Predicted Lineups`;
    slug = matchSlug(team1, team2, "playing-xi");
    content = [
      `## ${team1} vs ${team2} Predicted Playing XI ${year}`,
      "",
      `Predicted XIs for the ${matchType.toUpperCase()} match at ${venue} on ${formattedDate}.`,
      "",
      "## Match Details",
      `- **Teams:** ${team1} vs ${team2}`,
      `- **Date:** ${formattedDate}`,
      `- **Venue:** ${venue}`,
      `- **Format:** ${matchType.toUpperCase()}`,
      "",
      `## ${team1} — Predicted XI`,
      ...t1xi.map((p, i) => `${i + 1}. ${p}`),
      "",
      `*Captain: ${t1p.batters[0] || t1xi[0]}*`,
      "",
      `## ${team2} — Predicted XI`,
      ...t2xi.map((p, i) => `${i + 1}. ${p}`),
      "",
      `*Captain: ${t2p.batters[0] || t2xi[0]}*`,
      "",
      "## Key Inclusions",
      `- **${team1}:** ${t1p.allRounders[0] || t1xi[4] || "All-rounder"} is crucial — provides balance with both bat and ball`,
      `- **${team2}:** ${t2p.allRounders[0] || t2xi[4] || "All-rounder"} gives them the X-factor in the middle overs`,
      "",
      "## Fantasy Impact",
      "Prioritize the top-3 batters from each side along with the all-rounders. Monitor team news before the toss for last-minute changes.",
    ].join("\n");
  }

  const excerpt = content
    .replace(/##[^\n]*/g, "")
    .split("\n")
    .filter((l) => l.trim().length > 20)
    .slice(0, 2)
    .join(" ")
    .slice(0, 200);

  return {
    title,
    slug,
    content,
    category,
    tags,
    excerpt,
    excerpt_short: excerpt,
    status: "draft",
    featured: false,
    imageUrl,
  };
}

function LoginForm() {
  const { login } = useSimpleAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const ok = login(email, password);
    setLoading(false);
    if (!ok) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4 py-16">
      <div className="bg-card border border-border rounded-2xl p-8">
        <div className="text-center mb-6">
          <LogIn className="w-10 h-10 text-cric-red mx-auto mb-3" />
          <h1 className="text-xl font-bold text-foreground">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to access the CricFlash admin panel
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoComplete="email"
              data-ocid="admin.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="admin-password">Password</Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="pr-10"
                data-ocid="admin.input"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPass ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-cric-red hover:bg-red-700 text-white border-0"
            data-ocid="admin.button"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

const CATEGORIES = ["IPL", "PSL", "International", "General", "News"] as const;

function ArticlePreview({
  title,
  category,
  imageUrl,
  content,
  excerpt,
}: {
  title: string;
  category: string;
  imageUrl: string;
  content: string;
  excerpt: string;
}) {
  const previewText =
    excerpt.trim() ||
    content.slice(0, 400) + (content.length > 400 ? "..." : "");
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge
          variant="secondary"
          className="bg-cric-red/10 text-cric-red border-0"
        >
          {category}
        </Badge>
      </div>
      <h2 className="text-lg font-bold text-foreground leading-snug">
        {title || (
          <span className="text-muted-foreground italic">No title yet</span>
        )}
      </h2>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-40 object-cover rounded-xl"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
        {previewText || <span className="italic">No content yet</span>}
      </p>
    </div>
  );
}

export default function AdminPage() {
  const { isAdmin } = useSimpleAuth();
  const { actor, isFetching: actorFetching } = useActor();

  const waitForActor = useCallback(async (): Promise<
    import("../backend.d").backendInterface
  > => {
    if (actor) return actor;
    for (let i = 0; i < 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (actor) return actor;
    }
    throw new Error("Backend not available. Please refresh the page.");
  }, [actor]);

  const {
    data: articles = [],
    isLoading: loadingArticles,
    isError: articlesError,
    error: articlesErrorObj,
    refetch: refetchArticles,
  } = useArticles();
  const createArticleMutation = useCreateArticle();
  const updateArticleMutation = useUpdateArticle();
  const deleteArticleMutation = useDeleteArticle();

  // ── Automation state ──────────────────────────────────────────────────────
  const [fetchedMatches, setFetchedMatches] = useState<NormalizedMatch[]>(
    () => {
      try {
        const raw = localStorage.getItem("cricflash_admin_matches");
        if (!raw) return [];
        // rehydrate matchDate
        return (JSON.parse(raw) as NormalizedMatch[]).map((m) => ({
          ...m,
          matchDate: m.matchDate
            ? new Date(m.matchDate as unknown as string)
            : null,
        }));
      } catch {
        return [];
      }
    },
  );
  const [isFetchingMatches, setIsFetchingMatches] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [automationLog, setAutomationLog] = useState<string[]>([]);
  const [matchListOpen, setMatchListOpen] = useState(false);

  // ── Scheduler state ───────────────────────────────────────────────────────
  const [schedulerEnabled, setSchedulerEnabled] = useState<boolean>(() => {
    return localStorage.getItem("cricflash_scheduler_enabled") === "true";
  });
  const [lastRunTime, setLastRunTime] = useState<string>(
    () => localStorage.getItem("cricflash_last_run") || "",
  );
  const [lastRunArticlesCount, setLastRunArticlesCount] = useState<number>(() =>
    Number(localStorage.getItem("cricflash_last_run_count") || "0"),
  );
  const [lastRunStatus, setLastRunStatus] = useState<"success" | "failed" | "">(
    () =>
      (localStorage.getItem("cricflash_last_run_status") as
        | "success"
        | "failed"
        | "") || "",
  );
  const [isRunningAutomation, setIsRunningAutomation] = useState(false);
  const schedulerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTriggeredDateRef = useRef<string>("");

  // ── Telegram state ───────────────────────────────────────────────────────
  const [tgSettings, setTgSettings] = useState<TelegramSettings>(() =>
    loadTelegramSettings(),
  );
  const [isTesting, setIsTesting] = useState(false);

  const handleSaveTelegram = () => {
    saveTelegramSettings(tgSettings);
    toast.success("Telegram settings saved!");
  };

  const sendViaTelegram = async (article: {
    title: string;
    excerpt?: string;
    category?: string;
    slug?: string;
  }): Promise<void> => {
    const settings = loadTelegramSettings();
    if (!settings.botToken || !settings.chatId) return;
    const message = buildTelegramMessage(article);
    console.log("Sending:", message);
    const currentActor = await waitForActor();
    const result = await currentActor.sendTelegramMessage(
      settings.botToken,
      settings.chatId,
      message,
    );
    console.log("Telegram response:", result);
    if (result !== "ok" && !result.startsWith("ok")) {
      throw new Error(result);
    }
  };

  const handleTestTelegram = async () => {
    setIsTesting(true);
    try {
      const settings = loadTelegramSettings();
      if (!settings.botToken || !settings.chatId) {
        throw new Error("Bot Token and Chat ID are required.");
      }
      const message = "CricFlash Connected ✅";
      console.log("Sending:", message);
      const currentActor = await waitForActor();
      const result = await currentActor.sendTelegramMessage(
        settings.botToken,
        settings.chatId,
        message,
      );
      console.log("Telegram response:", result);
      if (result === "ok" || result.startsWith("ok")) {
        toast.success("Test message sent! Check your Telegram channel.");
      } else {
        throw new Error(result);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`Test failed: ${msg}`);
      console.error("[Telegram Test]", err);
    } finally {
      setIsTesting(false);
    }
  };

  const addLog = (msg: string) =>
    setAutomationLog((prev) => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 49),
    ]);

  const handleFetchMatches = async () => {
    setIsFetchingMatches(true);
    try {
      const classified = await getClassifiedMatches();
      // Store raw for debugging
      localStorage.setItem("cricflash_admin_raw", JSON.stringify(classified));
      // Flatten + deduplicate
      const all = [
        ...classified.live,
        ...classified.upcoming,
        ...classified.completed,
      ];
      const seen = new Map<string, NormalizedMatch>();
      for (const m of all) seen.set(m.id, m);
      const deduped = Array.from(seen.values());
      setFetchedMatches(deduped);
      localStorage.setItem("cricflash_admin_matches", JSON.stringify(deduped));
      const sampleMatch = deduped[0] ?? null;
      const logMsg = `Fetched: total=${deduped.length} (live=${classified.live.length}, upcoming=${classified.upcoming.length}, results=${classified.completed.length})`;
      addLog(logMsg);
      console.log("[Admin Automation]", {
        totalFetched: deduped.length,
        afterFilter: deduped.length,
        sampleMatch,
      });
      toast.success(`Fetched ${deduped.length} matches successfully!`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog(`Fetch failed: ${msg}`);
      toast.error(`Failed to fetch matches: ${msg}`);
    } finally {
      setIsFetchingMatches(false);
    }
  };

  const handleGenerateArticles = async () => {
    if (fetchedMatches.length === 0) {
      toast.error("No matches fetched. Click Fetch Matches first.");
      return;
    }
    setIsGenerating(true);
    const types: ArticleType[] = [
      "dream11",
      "prediction",
      "pitchReport",
      "playingXI",
    ];
    let generated = 0;
    let skipped = 0;
    try {
      for (const match of fetchedMatches) {
        for (const type of types) {
          const payload = buildArticlePayload(match, type);
          // Duplicate check by slug
          const exists = articles.some((a) => a.slug === payload.slug);
          if (exists) {
            skipped++;
            continue;
          }
          await createArticleMutation.mutateAsync({
            title: payload.title,
            content: payload.content,
            category: payload.category,
            imageUrl: payload.imageUrl,
            slug: payload.slug,
            status: payload.status,
            featured: payload.featured,
            excerpt: payload.excerpt,
            tags: payload.tags,
          });
          generated++;
        }
      }
      addLog(`Generated ${generated} articles, skipped ${skipped} duplicates.`);
      toast.success(
        `Generated ${generated} articles! (${skipped} duplicates skipped)`,
      );
      await refetchArticles();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog(`Generation error: ${msg}`);
      toast.error(`Article generation failed: ${msg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishAll = async () => {
    const drafts = articles.filter((a) => a.status === "draft");
    if (drafts.length === 0) {
      toast.info("No draft articles to publish.");
      return;
    }
    setIsPublishing(true);
    let published = 0;
    try {
      for (const article of drafts) {
        await updateArticleMutation.mutateAsync({
          id: article.id,
          title: article.title,
          content: article.content,
          category: article.category || "General",
          imageUrl: article.imageUrl || "",
          slug: article.slug || generateSlug(article.title),
          status: "published",
          featured: article.featured ?? false,
          excerpt: article.excerpt ?? "",
          tags: article.tags ?? [],
        });
        published++;
        // Send to Telegram via backend (non-blocking)
        sendViaTelegram({
          title: article.title,
          excerpt: article.excerpt ?? "",
          category: article.category,
          slug: article.slug || "",
        }).catch((err) => {
          console.warn("[Telegram] Failed to send article:", err);
        });
        await new Promise((r) => setTimeout(r, 1500));
      }
      addLog(`Published ${published} articles.`);
      toast.success(`Published ${published} articles!`);
      await refetchArticles();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog(`Publish error: ${msg}`);
      toast.error(`Failed to publish: ${msg}`);
    } finally {
      setIsPublishing(false);
    }
  };

  // ── Article form state ────────────────────────────────────────────────────
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState("General");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formPublished, setFormPublished] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formTags, setFormTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Admin Panel – CricFlash";
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  const runDailyAutomation = useCallback(async () => {
    if (isRunningAutomation) return;
    setIsRunningAutomation(true);
    let totalCreated = 0;
    const errors: string[] = [];
    addLog("🚀 Daily automation started");

    try {
      // Step 1: Fetch matches
      addLog("Fetching matches from CricAPI...");
      let matches: NormalizedMatch[] = [];
      try {
        const classified = await getClassifiedMatches();
        const all = [
          ...classified.live,
          ...classified.upcoming,
          ...classified.completed,
        ];
        const seen = new Map<string, NormalizedMatch>();
        for (const m of all) seen.set(m.id, m);
        matches = Array.from(seen.values());
        setFetchedMatches(matches);
        localStorage.setItem(
          "cricflash_admin_matches",
          JSON.stringify(matches),
        );
        addLog(`Fetched ${matches.length} matches`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`Fetch failed: ${msg}`);
        addLog(`⚠️ Fetch failed: ${msg}`);
      }

      // Step 2: Generate articles
      if (matches.length > 0) {
        addLog("Generating articles...");
        const types: ArticleType[] = [
          "dream11",
          "prediction",
          "pitchReport",
          "playingXI",
        ];
        const existingKeys = new Set(articles.map((a) => a.slug));
        for (const match of matches) {
          for (const type of types) {
            const payload = buildArticlePayload(match, type);
            if (existingKeys.has(payload.slug)) continue;
            try {
              await createArticleMutation.mutateAsync({
                title: payload.title,
                content: payload.content,
                category: payload.category,
                imageUrl: payload.imageUrl,
                slug: payload.slug,
                status: "draft",
                featured: false,
                excerpt: payload.excerpt,
                tags: payload.tags,
              });
              existingKeys.add(payload.slug);
              totalCreated++;
            } catch (err) {
              const msg = err instanceof Error ? err.message : String(err);
              errors.push(
                `Generate failed for ${match.team1} vs ${match.team2} (${type}): ${msg}`,
              );
            }
          }
        }
        addLog(`Generated ${totalCreated} new articles`);
      }

      // Refresh articles list
      const refreshed = await refetchArticles();
      const currentArticles = refreshed.data ?? [];

      // Step 3: Publish all drafts
      addLog("Publishing all draft articles...");
      const drafts = currentArticles.filter((a) => a.status === "draft");
      let publishedCount = 0;
      for (const article of drafts) {
        try {
          await updateArticleMutation.mutateAsync({
            id: article.id,
            title: article.title,
            content: article.content,
            category: article.category || "General",
            imageUrl: article.imageUrl || "",
            slug: article.slug || generateSlug(article.title),
            status: "published",
            featured: article.featured ?? false,
            excerpt: article.excerpt ?? "",
            tags: article.tags ?? [],
          });
          publishedCount++;
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          errors.push(`Publish failed for "${article.title}": ${msg}`);
        }
      }
      addLog(`Published ${publishedCount} articles`);

      // Step 4: Send to Telegram with delay
      if (publishedCount > 0) {
        addLog("Sending to Telegram...");
        const fresh = await refetchArticles();
        const justPublished = (fresh.data ?? [])
          .filter((a) => a.status === "published")
          .slice(0, publishedCount);
        let tgSent = 0;
        for (const article of justPublished) {
          try {
            await sendViaTelegram({
              title: article.title,
              excerpt: article.excerpt ?? "",
              category: article.category,
              slug: article.slug,
            });
            tgSent++;
            if (tgSent < justPublished.length) {
              await new Promise((r) => setTimeout(r, 1500));
            }
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            errors.push(`Telegram failed for "${article.title}": ${msg}`);
          }
        }
        addLog(`Sent ${tgSent} messages to Telegram`);
      }
    } finally {
      const now = new Date().toLocaleString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const status = errors.length === 0 ? "success" : "failed";
      setLastRunTime(now);
      setLastRunArticlesCount(totalCreated);
      setLastRunStatus(status);
      localStorage.setItem("cricflash_last_run", now);
      localStorage.setItem("cricflash_last_run_count", String(totalCreated));
      localStorage.setItem("cricflash_last_run_status", status);
      if (errors.length > 0) {
        addLog(`⚠️ Completed with ${errors.length} error(s)`);
      } else {
        addLog("✅ Daily automation completed successfully");
      }
      setIsRunningAutomation(false);
    }
  }, [isRunningAutomation, articles, actor]);

  const runDailyAutomationRef = useRef(runDailyAutomation);
  useEffect(() => {
    runDailyAutomationRef.current = runDailyAutomation;
  });

  // Scheduler: check every minute if it's 07:00
  useEffect(() => {
    const check = () => {
      if (!schedulerEnabled) return;
      const now = new Date();
      const hhmm = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
      const today = now.toDateString();
      if (hhmm === "07:00" && lastTriggeredDateRef.current !== today) {
        lastTriggeredDateRef.current = today;
        runDailyAutomationRef.current();
      }
    };
    schedulerRef.current = setInterval(check, 60_000);
    return () => {
      if (schedulerRef.current) clearInterval(schedulerRef.current);
    };
  }, [schedulerEnabled]);

  const handleSchedulerToggle = (enabled: boolean) => {
    setSchedulerEnabled(enabled);
    localStorage.setItem("cricflash_scheduler_enabled", String(enabled));
    toast.success(
      enabled
        ? "Auto Scheduler enabled (runs at 07:00 daily)"
        : "Auto Scheduler disabled",
    );
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    setFormSlug(generateSlug(val));
  };

  const addTag = (raw: string) => {
    const tag = raw.trim().replace(/,/g, "");
    if (tag && !formTags.includes(tag)) {
      setFormTags((prev) => [...prev, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setFormTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
    if (e.key === "Backspace" && !tagInput && formTags.length > 0) {
      setFormTags((prev) => prev.slice(0, -1));
    }
  };

  const resetForm = () => {
    setFormTitle("");
    setFormContent("");
    setFormCategory("General");
    setFormImageUrl("");
    setFormSlug("");
    setFormPublished(true);
    setFormFeatured(false);
    setFormExcerpt("");
    setFormTags([]);
    setTagInput("");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formContent.trim()) {
      toast.error("Content is required");
      return;
    }
    const payload = {
      title: formTitle.trim(),
      content: formContent.trim(),
      category: formCategory,
      imageUrl: formImageUrl.trim(),
      slug: formSlug.trim() || generateSlug(formTitle.trim()),
      status: formPublished ? "published" : "draft",
      featured: formFeatured,
      excerpt: formExcerpt.trim(),
      tags: formTags,
    };
    try {
      if (editingId) {
        await updateArticleMutation.mutateAsync({ id: editingId, ...payload });
        toast.success("Article updated!");
      } else {
        await createArticleMutation.mutateAsync(payload);
        toast.success(
          formPublished ? "Article published!" : "Article saved as draft!",
        );
        // Send to Telegram via backend when publishing
        if (formPublished) {
          sendViaTelegram({
            title: payload.title,
            excerpt: payload.excerpt,
            category: payload.category,
            slug: payload.slug,
          }).catch((err) => {
            console.warn("[Telegram] Failed to send article:", err);
            toast.warning("Article published but Telegram send failed.");
          });
        }
      }
      resetForm();
      await refetchArticles();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Failed to save article");
    }
  };

  const startEdit = (article: Article) => {
    setEditingId(article.id);
    setFormTitle(article.title);
    setFormContent(article.content);
    setFormCategory(article.category || "General");
    setFormImageUrl(article.imageUrl || "");
    setFormSlug(article.slug || generateSlug(article.title));
    setFormPublished(article.status !== "draft");
    setFormFeatured(article.featured ?? false);
    setFormExcerpt(article.excerpt ?? "");
    setFormTags(article.tags ?? []);
    setTagInput("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteArticleMutation.mutateAsync(id);
      toast.success("Article deleted");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Failed to delete article");
    }
  };

  const isSaving =
    createArticleMutation.isPending || updateArticleMutation.isPending;
  const anyAutomationRunning =
    isFetchingMatches || isGenerating || isPublishing || isRunningAutomation;
  const publishedCount = articles.filter(
    (a) => a.status === "published",
  ).length;

  if (!isAdmin) {
    return <LoginForm />;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-3 py-6 overflow-x-hidden">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground">Admin Panel</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage CricFlash articles and content
        </p>
      </div>

      {/* ── Automation Dashboard ─────────────────────────────────────────── */}
      <div
        className="bg-card border border-border rounded-2xl p-6 mb-8"
        data-ocid="admin.panel"
      >
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5 text-cric-red" />
          <h2 className="text-lg font-bold text-foreground">
            Content Automation
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Fetch live matches from CricAPI, auto-generate articles, and publish
          in one click.
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-background border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-extrabold text-foreground">
              {fetchedMatches.length}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5 flex items-center justify-center gap-1">
              <RefreshCw className="w-3 h-3" />
              Matches Fetched
            </div>
          </div>
          <div className="bg-background border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-extrabold text-foreground">
              {articles.length}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5 flex items-center justify-center gap-1">
              <FileText className="w-3 h-3" />
              Articles Generated
            </div>
          </div>
          <div className="bg-background border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-extrabold text-cric-red">
              {publishedCount}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5 flex items-center justify-center gap-1">
              <Globe className="w-3 h-3" />
              Published
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-4">
          <Button
            onClick={handleFetchMatches}
            disabled={anyAutomationRunning}
            className="bg-cric-red hover:bg-red-700 text-white border-0 flex-1 sm:flex-none"
            data-ocid="admin.primary_button"
          >
            {isFetchingMatches ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Fetch Matches
              </>
            )}
          </Button>

          <Button
            onClick={handleGenerateArticles}
            disabled={anyAutomationRunning || fetchedMatches.length === 0}
            variant="outline"
            className="flex-1 sm:flex-none"
            data-ocid="admin.secondary_button"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate Articles
              </>
            )}
          </Button>

          <Button
            onClick={handlePublishAll}
            disabled={
              anyAutomationRunning ||
              articles.filter((a) => a.status === "draft").length === 0
            }
            variant="outline"
            className="flex-1 sm:flex-none"
            data-ocid="admin.secondary_button"
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 mr-2" />
                Publish All
              </>
            )}
          </Button>
        </div>

        {/* Fetched matches collapsible */}
        {fetchedMatches.length > 0 && (
          <div className="border border-border rounded-xl overflow-hidden">
            <button
              type="button"
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/40 transition-colors"
              onClick={() => setMatchListOpen((v) => !v)}
              data-ocid="admin.toggle"
            >
              <span>Fetched Matches ({fetchedMatches.length})</span>
              {matchListOpen ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            {matchListOpen && (
              <div className="border-t border-border bg-background max-h-48 overflow-y-auto">
                {fetchedMatches.map((m, i) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between px-4 py-2 border-b border-border/50 last:border-b-0 text-sm"
                    data-ocid={`admin.item.${i + 1}`}
                  >
                    <span className="text-foreground font-medium truncate">
                      {m.team1} vs {m.team2}
                    </span>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs border-0 ${
                          m.status === "live"
                            ? "bg-red-500/15 text-red-500"
                            : m.status === "upcoming"
                              ? "bg-green-500/15 text-green-600"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {m.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {m.seriesCategory}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Automation log */}
        {automationLog.length > 0 && (
          <div className="mt-4 bg-muted/40 rounded-xl p-3">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              Automation Log
            </p>
            <div className="space-y-0.5 max-h-24 overflow-y-auto">
              {automationLog.map((log) => (
                <p
                  key={log}
                  className="text-xs text-muted-foreground font-mono"
                >
                  {log}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Auto Scheduler ─────────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-5 h-5 text-cric-red" />
          <h2 className="text-lg font-bold text-foreground">Auto Scheduler</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Automatically runs daily at 07:00 AM: fetch matches → generate
          articles → publish → send to Telegram.
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-5">
          <div className="flex items-center gap-3">
            <Switch
              id="scheduler-toggle"
              checked={schedulerEnabled}
              onCheckedChange={handleSchedulerToggle}
              data-ocid="scheduler.toggle"
            />
            <Label
              htmlFor="scheduler-toggle"
              className="cursor-pointer font-medium"
            >
              {schedulerEnabled ? "Scheduler ON" : "Scheduler OFF"}
            </Label>
          </div>
          <Button
            onClick={runDailyAutomation}
            disabled={isRunningAutomation || anyAutomationRunning}
            variant="outline"
            className="flex items-center gap-2"
            data-ocid="scheduler.primary_button"
          >
            {isRunningAutomation ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Run Now
              </>
            )}
          </Button>
        </div>

        {lastRunTime && (
          <div className="bg-muted/40 rounded-xl p-4 space-y-2">
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Last Run</p>
                <p className="font-medium text-foreground">
                  Today {lastRunTime}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Articles Created
                </p>
                <p className="font-medium text-foreground">
                  {lastRunArticlesCount}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p
                  className={`font-medium ${lastRunStatus === "success" ? "text-green-600" : "text-red-500"}`}
                >
                  {lastRunStatus === "success" ? "✅ Success" : "❌ Failed"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Telegram Settings ─────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Send className="w-5 h-5 text-cric-red" />
          <h2 className="text-lg font-bold text-foreground">
            Telegram Settings
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Connect your Telegram channel. Articles will be auto-posted when
          published.
        </p>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="tg-token">Bot Token</Label>
            <Input
              id="tg-token"
              type="password"
              placeholder="e.g. 8093259121:AAFFUKz..."
              value={tgSettings.botToken}
              onChange={(e) =>
                setTgSettings((s) => ({ ...s, botToken: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tg-chatid">Chat ID</Label>
            <Input
              id="tg-chatid"
              placeholder="e.g. -1003740145973 or @channelname"
              value={tgSettings.chatId}
              onChange={(e) =>
                setTgSettings((s) => ({ ...s, chatId: e.target.value }))
              }
            />
            <p className="text-xs text-muted-foreground">
              For public channels, use @username. For private, use the numeric
              ID (prefix with -100 for supergroups).
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tg-link">Channel Link</Label>
            <Input
              id="tg-link"
              placeholder="https://t.me/YourChannel"
              value={tgSettings.channelLink}
              onChange={(e) =>
                setTgSettings((s) => ({ ...s, channelLink: e.target.value }))
              }
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              onClick={handleSaveTelegram}
              className="bg-cric-red hover:bg-red-700 text-white border-0"
            >
              Save Settings
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleTestTelegram}
              disabled={isTesting || actorFetching}
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
            {tgSettings.channelLink && (
              <a
                href={tgSettings.channelLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-cric-red hover:underline ml-auto self-center"
              >
                <Globe className="w-4 h-4" />
                View Channel
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── Existing form + article list ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Article Form */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">
            {editingId ? "Edit Article" : "Add New Article"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            data-ocid="admin.panel"
          >
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="article-title">Title *</Label>
              <Input
                id="article-title"
                value={formTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter article title..."
                data-ocid="admin.input"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label htmlFor="article-category">Category *</Label>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger id="article-category" data-ocid="admin.select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="article-excerpt">Excerpt</Label>
                <span className="text-xs text-muted-foreground">
                  {formExcerpt.length}/300
                </span>
              </div>
              <Textarea
                id="article-excerpt"
                value={formExcerpt}
                onChange={(e) => setFormExcerpt(e.target.value)}
                rows={3}
                maxLength={300}
                placeholder="Short summary shown in article cards (2-3 lines)..."
                data-ocid="admin.textarea"
              />
            </div>

            {/* Featured Toggle */}
            <div className="bg-muted/40 rounded-xl p-3 space-y-1">
              <div className="flex items-center gap-3">
                <Switch
                  id="article-featured"
                  checked={formFeatured}
                  onCheckedChange={setFormFeatured}
                  data-ocid="admin.switch"
                />
                <Label
                  htmlFor="article-featured"
                  className="cursor-pointer flex items-center gap-1.5"
                >
                  <Star className="w-3.5 h-3.5 text-yellow-500" />
                  Mark as Featured
                </Label>
              </div>
              <p className="text-xs text-muted-foreground pl-12">
                Featured articles appear at the top of the homepage
              </p>
            </div>

            {/* Tags Input */}
            <div className="space-y-1.5">
              <Label
                htmlFor="article-tags"
                className="flex items-center gap-1.5"
              >
                <Tag className="w-3.5 h-3.5" />
                Tags
              </Label>
              <div
                className="min-h-[40px] flex flex-wrap gap-1.5 items-center border border-input rounded-md px-3 py-1.5 cursor-text bg-background"
                onClick={() => tagInputRef.current?.focus()}
                onKeyDown={() => tagInputRef.current?.focus()}
                role="presentation"
              >
                {formTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs font-medium bg-cric-red/10 text-cric-red px-2 py-0.5 rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTag(tag);
                      }}
                      className="hover:text-cric-red/70 transition-colors"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  ref={tagInputRef}
                  id="article-tags"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={() => {
                    if (tagInput.trim()) addTag(tagInput);
                  }}
                  placeholder={
                    formTags.length === 0
                      ? "Type tag and press Enter or comma..."
                      : ""
                  }
                  className="flex-1 min-w-[120px] outline-none text-sm bg-transparent text-foreground placeholder:text-muted-foreground"
                  data-ocid="admin.input"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Press Enter or comma to add a tag (e.g. IPL, PSL, Virat Kohli)
              </p>
            </div>

            {/* Featured Image URL */}
            <div className="space-y-1.5">
              <Label htmlFor="article-image">
                Featured Image URL (optional)
              </Label>
              <Input
                id="article-image"
                value={formImageUrl}
                onChange={(e) => setFormImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                type="text"
                data-ocid="admin.input"
              />
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <Label htmlFor="article-content">Content *</Label>
              <Textarea
                id="article-content"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Write your article content here..."
                rows={10}
                data-ocid="admin.textarea"
              />
              <p className="text-xs text-muted-foreground">
                Use ## for H2 headings, ### for H3 subheadings
              </p>
            </div>

            {/* Auto-generated Slug */}
            <div className="space-y-1.5">
              <Label htmlFor="article-slug">SEO Slug (auto-generated)</Label>
              <Input
                id="article-slug"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="article-url-slug"
                className="font-mono text-xs"
                data-ocid="admin.input"
              />
            </div>

            {/* Publish toggle */}
            <div className="flex items-center gap-3 py-1">
              <Switch
                id="article-published"
                checked={formPublished}
                onCheckedChange={setFormPublished}
                data-ocid="admin.switch"
              />
              <Label htmlFor="article-published" className="cursor-pointer">
                {formPublished ? (
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    Publish
                  </span>
                ) : (
                  <span className="text-muted-foreground">Save as Draft</span>
                )}
              </Label>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-cric-red hover:bg-red-700 text-white border-0"
                data-ocid="admin.submit_button"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingId ? (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Update Article
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {formPublished ? "Publish Article" : "Save Draft"}
                  </>
                )}
              </Button>

              {/* Preview */}
              <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    data-ocid="admin.open_modal_button"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg" data-ocid="admin.dialog">
                  <DialogHeader>
                    <DialogTitle>Article Preview</DialogTitle>
                  </DialogHeader>
                  <ArticlePreview
                    title={formTitle}
                    category={formCategory}
                    imageUrl={formImageUrl}
                    content={formContent}
                    excerpt={formExcerpt}
                  />
                </DialogContent>
              </Dialog>

              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  data-ocid="admin.cancel_button"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Article List */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              Articles ({articles.length})
              {loadingArticles ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
              ) : !articlesError && articles.length >= 0 ? (
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              ) : null}
            </h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => refetchArticles()}
              disabled={loadingArticles}
            >
              {loadingArticles ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                "Refresh"
              )}
            </Button>
          </div>
          {loadingArticles ? (
            <div className="space-y-3" data-ocid="admin.loading_state">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-16 bg-muted rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : articlesError ? (
            <div className="text-center py-8" data-ocid="admin.error_state">
              <div className="flex items-center justify-center gap-2 text-destructive mb-2">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm font-medium">Failed to load articles</p>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {articlesErrorObj instanceof Error
                  ? articlesErrorObj.message
                  : "Connection error. Please try again."}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => refetchArticles()}
              >
                Retry
              </Button>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-8" data-ocid="admin.empty_state">
              <p className="text-muted-foreground">No articles yet.</p>
              <p className="text-xs text-muted-foreground mt-1">
                Use the form to add your first article.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {articles.map((a, i) => (
                <div
                  key={a.id}
                  className="flex items-start justify-between gap-3 p-3 bg-background rounded-xl border border-border"
                  data-ocid={`admin.item.${i + 1}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-sm font-semibold text-foreground line-clamp-1">
                        {a.title}
                      </p>
                      {a.featured && (
                        <span className="inline-flex items-center gap-0.5 text-xs font-bold text-yellow-600 dark:text-yellow-400">
                          <Star className="w-3 h-3 fill-current" />
                          FEATURED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(a.createdAt)}
                      </span>
                      {a.category && (
                        <span className="text-xs bg-cric-red/10 text-cric-red font-semibold px-1.5 py-0.5 rounded">
                          {a.category}
                        </span>
                      )}
                      <span
                        className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                          a.status === "draft"
                            ? "bg-yellow-400/20 text-yellow-600 dark:text-yellow-400"
                            : "bg-green-500/15 text-green-600 dark:text-green-400"
                        }`}
                      >
                        {a.status === "draft" ? "DRAFT" : "LIVE"}
                      </span>
                    </div>
                    {a.tags && a.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {a.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-cric-red/8 text-cric-red px-1.5 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEdit(a)}
                      className="h-7 w-7 p-0"
                      data-ocid="admin.edit_button"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          data-ocid="admin.delete_button"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent data-ocid="admin.dialog">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Article</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{a.title}"? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel data-ocid="admin.cancel_button">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(a.id)}
                            className="bg-destructive text-destructive-foreground"
                            data-ocid="admin.confirm_button"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
