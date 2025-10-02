import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PostForm from "../../../components/PostForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function EditPostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [dialogMessage, setDialogMessage] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    const slug = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';

    async function fetchPost() {
      try {
        setLoading(true);
        const [postRes, catRes] = await Promise.all([
          fetch(`/api/posts/${slug}`),
          fetch(`/api/categories`),
        ]);

        if (postRes.ok) setPost(await postRes.json());
        if (catRes.ok) setCategories(await catRes.json());
      } catch (error) {
        console.error("Failed to fetch post or categories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  async function handleUpdate(formData: FormData) {
    try {
      const slug = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : ''
      const res = await fetch(`/api/posts/${post?.slug || slug}`, {
        method: "PUT",
        body: formData, // FormData sent directly
      });

      if (res.ok) {
        const updated = await res.json();
        router.push(`/posts/${updated.slug || post?.slug || slug}`);
      } else {
        const text = await res.text().catch(() => "");
        setDialogTitle("Update failed");
        setDialogMessage(text || `Error updating post ${slug}`);
        setDialogOpen(true);
      }
    } catch (err) {
      const slug = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : ''
      console.error(`Failed to update post ${slug}:`, err);
      setDialogTitle("Update error");
      setDialogMessage(err instanceof Error ? err.message : `Error updating post ${slug}`);
      setDialogOpen(true);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground dark:text-gray-300 text-lg">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white flex items-center justify-center">
      <Card className="bg-card dark:bg-gray-800 border border-border dark:border-gray-700">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Post not found</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="bg-card dark:bg-gray-800 border border-border dark:border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">Edit Post</CardTitle>
            <CardDescription className="text-muted-foreground">
              Update your post information
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <PostForm
              initialData={post}
              categories={categories}
              onSubmit={handleUpdate}
            />
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogTitle || "Notice"}</DialogTitle>
              {dialogMessage ? (
                <DialogDescription>{dialogMessage}</DialogDescription>
              ) : null}
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setDialogOpen(false)}>OK</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
