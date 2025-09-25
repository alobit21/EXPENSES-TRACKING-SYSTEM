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

export default function EditPostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchPost() {
      try {
        setLoading(true);
        const [postRes, catRes] = await Promise.all([
          fetch(`/api/posts/${id}`),
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
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        body: formData, // FormData sent directly
      });

      if (res.ok) {
        const updated = await res.json();
        router.push(`/posts/${updated.id}`);
      } else {
        alert("Error updating post");
      }
    } catch (err) {
      console.error("Failed to update post:", err);
      alert("Error updating post");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <p className="text-gray-300">Post not found</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Edit Post</CardTitle>
            <CardDescription className="text-gray-400">
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
      </div>
    </div>
  );
}
