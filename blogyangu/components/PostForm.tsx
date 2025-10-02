import { useState, useEffect, ChangeEvent } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



import ReactMde from "react-mde"
import * as Showdown from "showdown"
import "react-mde/lib/styles/css/react-mde-all.css"

import { Command } from "react-mde";


interface Category {
  id: number
  name: string
}

interface PostFormProps {
  initialData?: {
    id?: number
    title: string
    content: string
    excerpt?: string
    metaDescription?: string
    coverImage?: string
    categoryId?: number
    status?: string
    allowComments?: boolean
  }
  categories?: Category[]
  onSubmit: (formData: FormData) => Promise<void>
}

export default function PostForm({ initialData, categories = [], onSubmit }: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "")
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "")
  const [status, setStatus] = useState(initialData?.status || "DRAFT")
  const [allowComments, setAllowComments] = useState(initialData?.allowComments ?? true)
  const [categoryId, setCategoryId] = useState<string>(initialData?.categoryId?.toString() || "")
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState(initialData?.coverImage || "")
  const [imageError, setImageError] = useState<string | null>(null)
  const [errors, setErrors] = useState<{
    title?: string
    content?: string
    excerpt?: string
    metaDescription?: string
  }>({})

// inside PostForm component
const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write")
  const converter = new Showdown.Converter()
  
const insertImageCommand: Command = {
  icon: () => <span>🖼️</span>,
  buttonProps: { "aria-label": "Insert image" },
  execute: async ({ textApi }) => {
    // Open file picker
    const file: File | null = await new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => resolve(input.files?.[0] || null);
      input.click();
    });

    if (!file) return;

    // Upload file to backend
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (!data.url) return alert("Upload failed");

    // Insert permanent URL
    textApi.replaceSelection(`![${file.name}](${data.url})`);
  },
};


  // Clean up image preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (coverImagePreview && coverImageFile) {
        URL.revokeObjectURL(coverImagePreview)
      }
    }
  }, [coverImagePreview, coverImageFile])

  const validateForm = () => {
    const newErrors: { title?: string; content?: string; excerpt?: string; metaDescription?: string } = {}
    if (!title.trim()) newErrors.title = "Title is required"
    if (title.length > 200) newErrors.title = "Title must be 200 characters or less"
    if (!content.trim()) newErrors.content = "Content is required"
    if (excerpt && excerpt.length > 300) newErrors.excerpt = "Excerpt must be 300 characters or less"
    if (metaDescription && metaDescription.length > 160) {
      newErrors.metaDescription = "Meta description must be 160 characters or less"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type and size
      const validTypes = ["image/jpeg", "image/png", "image/gif"]
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (!validTypes.includes(file.type)) {
        setImageError("Only JPEG, PNG, or GIF images are allowed")
        setCoverImageFile(null)
        setCoverImagePreview("")
        return
      }
      if (file.size > maxSize) {
        setImageError("Image size must be less than 5MB")
        setCoverImageFile(null)
        setCoverImagePreview("")
        return
      }
      if (coverImagePreview && coverImageFile) {
        URL.revokeObjectURL(coverImagePreview)
      }
      setCoverImageFile(file)
      setImageError(null)
      setCoverImagePreview(URL.createObjectURL(file))
    } else {
      setCoverImageFile(null)
      setCoverImagePreview(initialData?.coverImage || "")
      setImageError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const formData = new FormData()
    formData.append("title", title)
    formData.append("content", content)
    formData.append("excerpt", excerpt)
    formData.append("metaDescription", metaDescription)
    formData.append("status", status)
    formData.append("allowComments", allowComments ? "true" : "false")
    if (categoryId) formData.append("categoryId", categoryId)
    if (coverImageFile) formData.append("coverImage", coverImageFile)
    if (initialData?.id) formData.append("id", initialData.id.toString())

    await onSubmit(formData)
  }

  const handleCancel = () => {
    setTitle(initialData?.title || "")
    setContent(initialData?.content || "")
    setExcerpt(initialData?.excerpt || "")
    setMetaDescription(initialData?.metaDescription || "")
    setStatus(initialData?.status || "DRAFT")
    setAllowComments(initialData?.allowComments ?? true)
    setCategoryId(initialData?.categoryId?.toString() || "")
    setCoverImageFile(null)
    setCoverImagePreview(initialData?.coverImage || "")
    setImageError(null)
    setErrors({})
  }

  return (
    <Card className="bg-card dark:bg-gray-900 border border-border dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-foreground">
          {initialData?.id ? "Edit Post" : "Create New Post"}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Fill in the details below to {initialData?.id ? "update" : "create"} your post
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">
              Title <span className="text-red-400">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setErrors((prev) => ({ ...prev, title: undefined }))
              }}
              className={`bg-background border border-input text-foreground dark:bg-gray-900 dark:border-gray-600 dark:text-white ${
                errors.title ? "border-red-400" : ""
              }`}
              placeholder="Enter post title"
              required
              maxLength={200}
            />
            <div className="flex justify-between text-xs">
              {errors.title ? (
                <span className="text-red-400">{errors.title}</span>
              ) : (
                <span className="text-muted-foreground">{title.length}/200 characters</span>
              )}
            </div>
          </div>

          {/* Excerpt Field */}
          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-foreground">
              Excerpt
            </Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              value={excerpt}
              onChange={(e) => {
                setExcerpt(e.target.value)
                setErrors((prev) => ({ ...prev, excerpt: undefined }))
              }}
              rows={3}
              className={`bg-background border border-input text-foreground dark:bg-gray-900 dark:border-gray-600 dark:text-white ${
                errors.excerpt ? "border-red-400" : ""
              }`}
              placeholder="Write a brief summary of your post"
              maxLength={300}
            />
            <div className="flex justify-between text-xs">
              {errors.excerpt ? (
                <span className="text-red-400">{errors.excerpt}</span>
              ) : (
                <span className="text-muted-foreground">{excerpt.length}/300 characters</span>
              )}
            </div>
          </div>

          {/* Meta Description Field */}
          <div className="space-y-2">
            <Label htmlFor="metaDescription" className="text-foreground">
              Meta Description
            </Label>
            <Textarea
              id="metaDescription"
              name="metaDescription"
              value={metaDescription}
              onChange={(e) => {
                setMetaDescription(e.target.value)
                setErrors((prev) => ({ ...prev, metaDescription: undefined }))
              }}
              rows={3}
              className={`bg-background border border-input text-foreground dark:bg-gray-900 dark:border-gray-600 dark:text-white ${
                errors.metaDescription ? "border-red-400" : ""
              }`}
              placeholder="Enter a meta description for SEO"
              maxLength={160}
            />
            <div className="flex justify-between text-xs">
              {errors.metaDescription ? (
                <span className="text-red-400">{errors.metaDescription}</span>
              ) : (
                <span className="text-gray-400">{metaDescription.length}/160 characters</span>
              )}
            </div>
          </div>

          {/* Content Field */}
<div className="space-y-2">
  <Label htmlFor="content" className="text-foreground">
    Content <span className="text-red-400">*</span>
  </Label>

<div className="react-mde-wrapper bg-white text-gray-900 dark:bg-gray-900 dark:text-white text-foreground rounded border border-input w-full dark:bg-gray-900 dark:text-white dark:border-gray-600">
 <ReactMde
        value={content}
        onChange={setContent}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(converter.makeHtml(markdown))
        }
        toolbarCommands={[
          ["bold", "italic", "strikethrough"],
          ["link", "quote", "code"],
          ["unordered-list", "ordered-list"],
          ["insert-image"],
        ]}
        commands={{ "insert-image": insertImageCommand }}
        childProps={{
          textArea: {
            className: "bg-background text-foreground dark:bg-gray-900 dark:text-white focus:outline-none w-full",
          },
        }}
      />


</div>


  

  {errors.content && (
    <p className="text-xs text-red-400">{errors.content}</p>
  )}
</div>

<style jsx global>{`
  /* Main wrapper */
  .react-mde-wrapper {
  width: 100% !important;
}

.react-mde .mde-preview img {
  max-width: 200px;   /* or use Tailwind classes if you want */
  height: auto;
  border-radius: 8px;
  margin: 1rem auto;
  display: block;
}

.prose img {
  max-width: 200px;   /* or use max-width: 100% if you want responsiveness */
  height: auto;
  display: block;
  margin: 1rem auto;  /* centers the image */
  border-radius: 8px;
}



.react-mde {
  width: 100% !important;
  display: flex !important;
  flex-direction: column !important;
}

  /* Tabs */
  .react-mde .mde-tabs {
    background-color: #111827 !important;
    border-bottom: 1px solid #374151 !important;
  }

  .react-mde .mde-tabs button {
    background-color: transparent !important;
    color: #9ca3af !important;
    border: none !important;
    padding: 8px 16px !important;
  }

  .react-mde .mde-tabs button.selected {
    color: white !important;
    border-bottom: 2px solid #3b82f6 !important;
  }

  /* Toolbar */
  .react-mde .mde-header {
    background-color: #1f2937 !important;
    border-bottom: 1px solid #374151 !important;
  }

  .react-mde .mde-header .mde-header-group .mde-header-item button {
    color: #d1d5db !important;
    background-color: transparent !important;
    border: none !important;
    padding: 8px !important;
    margin: 0 2px !important;
    border-radius: 4px !important;
    transition: background-color 0.2s ease;
  }

  .react-mde .mde-header .mde-header-item button:hover {
    background-color: #374151 !important;
    color: white !important;
  }

  .react-mde .mde-header .mde-header-item button svg {
    fill: currentColor !important;
    color: currentColor !important;
    stroke: currentColor !important;
  }

  /* Dropdowns */
  .react-mde .mde-header .mde-header-item select {
    background-color: #1f2937 !important;
    color: white !important;
    border: 1px solid #4b5563 !important;
  }

  .react-mde .mde-header .mde-header-item select:focus {
    outline: none !important;
  }

  /* Textarea */
.react-mde .mde-text,
.react-mde .mde-textarea {
  width: 100% !important;
  resize: vertical !important;
  min-height: 200px !important; /* optional: gives breathing room */
}

  .react-mde .mde-textarea:focus {
    outline: none !important;
    box-shadow: none !important;
  }

  .react-mde .mde-textarea::placeholder {
    color: #9ca3af !important;
  }

  /* Preview */
  .react-mde .mde-preview {
    background-color: #1f2937 !important;
    color: white !important;
    padding: 16px !important;
  }

  .react-mde .mde-preview a {
    color: #3b82f6 !important;
    text-decoration: underline;
  }

  .react-mde .mde-preview .mde-preview-content blockquote {
    border-left: 4px solid #4b5563 !important;
    color: #d1d5db !important;
    padding-left: 12px !important;
    margin-left: 0 !important;
  }
`}</style>


          {/* Category Field */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">
              Category
            </Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="bg-background border border-input text-foreground dark:bg-gray-900 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-input text-foreground dark:bg-gray-900 dark:border-gray-600 dark:text-white">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cover Image Field */}
          <div className="space-y-2">
            <Label htmlFor="coverImage" className="text-foreground">
              Cover Image
            </Label>
            <Input
              type="file"
              id="coverImage"
              name="coverImage"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleFileChange}
              className="bg-background border border-input text-foreground dark:bg-gray-900 dark:border-gray-600 dark:text-white file:bg-blue-600 file:text-white file:border-0"
            />
            {imageError && (
              <p className="text-xs text-red-400">{imageError}</p>
            )}
            {coverImagePreview && !imageError && (
              <div className="mt-4 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={coverImagePreview}
                  alt="Cover image preview"
                  className="w-full h-64 object-cover"
                  onError={() => {
                    setImageError("Failed to load image preview")
                    setCoverImagePreview(initialData?.coverImage || "")
                  }}
                />
              </div>
            )}
          </div>

          {/* Status and Allow Comments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-foreground dark:text-white">
                Status
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-background border border-input text-foreground dark:bg-gray-900 dark:border-gray-600 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border border-input text-foreground dark:bg-gray-900 dark:border-gray-600 dark:text-white">
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end space-x-2">
              <Checkbox
                id="allowComments"
                checked={allowComments}
                onCheckedChange={(checked) => setAllowComments(checked as boolean)}
                className="border-input dark:border-gray-600 data-[state=checked]:bg-blue-600"
              />
              <Label htmlFor="allowComments" className="text-foreground cursor-pointer">
                Allow Comments
              </Label>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-4">
          <Link href="/posts">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="border border-border text-foreground hover:bg-accent hover:text-accent-foreground dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={!title.trim() || !content.trim()}
            className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-600"
          >
            {initialData?.id ? "Update Post" : "Create Post"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}