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
  Edit,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  LogIn,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Article } from "../backend.d";
import {
  useArticles,
  useCreateArticle,
  useDeleteArticle,
  useUpdateArticle,
} from "../hooks/useQueries";
import { useSimpleAuth } from "../hooks/useSimpleAuth";

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

const CATEGORIES = ["General", "IPL", "International", "News"] as const;

function ArticlePreview({
  title,
  category,
  imageUrl,
  content,
}: {
  title: string;
  category: string;
  imageUrl: string;
  content: string;
}) {
  const excerpt = content.slice(0, 400) + (content.length > 400 ? "..." : "");
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
        {excerpt || <span className="italic">No content yet</span>}
      </p>
    </div>
  );
}

export default function AdminPage() {
  const { isAdmin } = useSimpleAuth();

  const {
    data: articles = [],
    isLoading: loadingArticles,
    refetch: refetchArticles,
  } = useArticles();
  const createArticleMutation = useCreateArticle();
  const updateArticleMutation = useUpdateArticle();
  const deleteArticleMutation = useDeleteArticle();

  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState("General");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formPublished, setFormPublished] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    document.title = "Admin Panel – CricFlash";
  }, []);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    setFormSlug(generateSlug(val));
  };

  const resetForm = () => {
    setFormTitle("");
    setFormContent("");
    setFormCategory("General");
    setFormImageUrl("");
    setFormSlug("");
    setFormPublished(true);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      toast.error("Title and content are required");
      return;
    }
    const payload = {
      title: formTitle.trim(),
      content: formContent.trim(),
      category: formCategory,
      imageUrl: formImageUrl.trim(),
      slug: formSlug.trim() || generateSlug(formTitle.trim()),
      status: formPublished ? "published" : "draft",
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
    } catch {
      toast.error("Failed to save article");
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteArticleMutation.mutateAsync(id);
      toast.success("Article deleted");
    } catch {
      toast.error("Failed to delete article");
    }
  };

  const isSaving =
    createArticleMutation.isPending || updateArticleMutation.isPending;

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
                required
                data-ocid="admin.input"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label htmlFor="article-category">Category</Label>
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
                type="url"
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
                required
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
            <h2 className="text-lg font-bold text-foreground">
              Articles ({articles.length})
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
                    </div>
                    <div className="flex items-center gap-2">
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
