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
  Edit,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Loader2,
  LogIn,
  Plus,
  RefreshCw,
  Star,
  Tag,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Article } from "../backend.d";
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
  return "International";
}

type ArticleType = "dream11" | "prediction" | "pitchReport" | "playingXI";

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
  const tags = [team1, team2, matchType.toUpperCase(), category].filter(
    Boolean,
  );

  let title = "";
  let slug = "";
  let content = "";

  if (type === "dream11") {
    title = `${team1} vs ${team2} Dream11 Prediction ${year}: Best Team & Tips`;
    slug = matchSlug(team1, team2, "dream11-prediction");
    content = `## ${team1} vs ${team2} Dream11 Prediction ${year}

The much-awaited clash between ${team1} and ${team2} is set to take place at ${venue} on ${formattedDate}. Here is our Dream11 prediction and best team tips for this ${matchType} match.

## Match Details
- **Match:** ${team1} vs ${team2}
- **Date:** ${formattedDate}
- **Venue:** ${venue}
- **Match Type:** ${matchType}
- **Series:** ${series}

## Pitch Report
The ${venue} pitch typically offers assistance to both batters and bowlers. Expect a competitive surface with some early movement for pacers. As the match progresses, the pitch may ease out and favor the batters.

## Probable Playing XI

**${team1}:**
Players are yet to be confirmed. Check the official team announcement closer to match time.

**${team2}:**
Players are yet to be confirmed. Check the official team announcement closer to match time.

## Dream11 Prediction Tips

1. Pick 3-4 top-order batters from both teams
2. Include 1-2 all-rounders for extra flexibility
3. Pick your team captain from in-form batters
4. Include at least 2 specialist bowlers
5. Monitor team news and toss results before finalizing your team

## Best Dream11 Team

**Captain:** Best batter in current form  
**Vice-Captain:** Top all-rounder

**Batters (4):** Top 4 available batters  
**All-rounders (2):** Best 2 all-rounders  
**Wicket-keeper (1):** Team wicket-keeper  
**Bowlers (4):** Top wicket-taking bowlers

## Conclusion
This promises to be an exciting contest between ${team1} and ${team2}. Choose your Dream11 team wisely and good luck!`;
  } else if (type === "prediction") {
    title = `${team1} vs ${team2} Match Prediction ${year}: Who Will Win Today?`;
    slug = matchSlug(team1, team2, "match-prediction");
    content = `## ${team1} vs ${team2} Match Prediction ${year}

## Match Overview
${team1} and ${team2} are set for an exciting ${matchType} clash. Here is our expert match prediction for this fixture.

## Match Details
- **Match:** ${team1} vs ${team2}
- **Date:** ${formattedDate}
- **Venue:** ${venue}
- **Match Type:** ${matchType}
- **Series:** ${series}

## Head to Head
Both ${team1} and ${team2} have had competitive encounters in recent years. The head-to-head record is closely contested, making this match difficult to call.

## Team Form
**${team1}:** Coming into this match with recent competitive performances. The team will look to build on their previous outings.

**${team2}:** A formidable side that has been consistent in their recent campaigns. They will be keen to put in a strong performance.

## Key Players
Watch out for top performers from both sides who can turn the game with a single performance. Key batters, bowlers, and all-rounders will play a crucial role.

## Pitch and Conditions
The ${venue} pitch is expected to be sporting. Weather conditions should be suitable for a full match to be played.

## Our Prediction
This is expected to be a closely fought match. Both teams have quality players who can make a difference on their day. Based on current form and conditions, both sides have a realistic chance of winning.

## Conclusion
Stay tuned for the live score and match updates. May the best team win!`;
  } else if (type === "pitchReport") {
    const venueSlug = venue
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    title = `${venue} Pitch Report: ${team1} vs ${team2} ${year}`;
    slug = `${venueSlug}-pitch-report-${matchSlug(team1, team2, "").replace(
      /-$/,
      "",
    )}-${year}`;
    content = `## ${venue} Pitch Report for ${team1} vs ${team2}

## Venue Overview
${venue} is a well-known cricket ground that has hosted numerous international and domestic matches. The pitch here is known for its balanced nature, offering something for both batters and bowlers.

## Pitch Characteristics
- **Surface:** Good batting surface with some early pace
- **Bounce:** Medium to high, consistent throughout
- **Swing:** Moderate swing conditions in overcast weather
- **Turn:** Minimal in the early stages, may develop later
- **Dew Factor:** Evening matches may see dew affecting the surface

## Historical Stats at ${venue}
The pitch at ${venue} has historically produced competitive scores. Batting first or second, both teams have had success at this venue.

## Expected Conditions
The track is expected to be good for batting initially. Pacers will find some assistance in the powerplay overs, while spinners may come into play in the latter half of the innings.

## Fantasy Tips Based on Pitch
- Prefer batters who like to play on good surfaces
- Include a mix of pace and spin bowlers
- The toss could play an important role; winning the toss and batting first is often preferred here

## Conclusion
Overall, the ${venue} pitch promises to provide an exciting match between ${team1} and ${team2}. Expect a high-scoring affair with wickets spread throughout the innings.`;
  } else {
    title = `${team1} vs ${team2} Predicted Playing XI ${year}`;
    slug = matchSlug(team1, team2, "playing-xi");
    content = `## ${team1} vs ${team2} Predicted Playing XI ${year}

## Match Details
- **Match:** ${team1} vs ${team2}
- **Date:** ${formattedDate}
- **Venue:** ${venue}
- **Match Type:** ${matchType}

## ${team1} Predicted Playing XI

The following is the probable playing XI for ${team1} based on recent team selections and squad announcements:

1. Opening batter (right-handed)
2. Opening batter (left-handed)
3. Top-order batter
4. Middle-order batter (captain)
5. Middle-order batter
6. All-rounder (batting)
7. Wicket-keeper batter
8. All-rounder (bowling)
9. Pace bowler
10. Pace bowler
11. Spinner

**Captain:** TBA | **Vice-Captain:** TBA

## ${team2} Predicted Playing XI

The following is the probable playing XI for ${team2} based on recent team selections and squad announcements:

1. Opening batter
2. Opening batter
3. Top-order batter (captain)
4. Middle-order batter
5. Middle-order batter
6. Wicket-keeper batter
7. All-rounder
8. All-rounder
9. Pace bowler
10. Pace bowler
11. Spinner

**Captain:** TBA | **Vice-Captain:** TBA

## Key Inclusions and Exclusions
Watch out for last-minute team changes and injury updates. Check the official team announcements 30 minutes before the match for the confirmed Playing XI.

## Fantasy Picks Based on Playing XI
Once the official XI is announced, pick your fantasy team wisely. Focus on in-form players and those with good records at the venue.`;
  }

  const excerpt = content
    .replace(/##[^\n]*/g, "")
    .trim()
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
    imageUrl: "",
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
    <div className="max-w-[400px] mx-auto px-4 py-16">
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
    isFetchingMatches || isGenerating || isPublishing;
  const publishedCount = articles.filter(
    (a) => a.status === "published",
  ).length;

  if (!isAdmin) {
    return <LoginForm />;
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
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
