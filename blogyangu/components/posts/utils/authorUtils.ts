import { Author } from "../types"

// Safely get the displayName
const safeGetDisplayName = (author?: Author | null): string | null => {
  return author?.displayName ?? null
}

// Safely get the author’s display name for UI
export const getAuthorDisplay = (author?: Author | null): string => {
  if (!author) return "Unknown Author"
  const displayName = safeGetDisplayName(author)
  return displayName || author.username || "Unknown Author"
}

// Safely get avatar URL
export const getAvatarUrl = (author?: Author | null): string | null => {
  return author?.avatarUrl ?? null
}

// Safely get initials
export const getInitials = (author?: Author | null): string => {
  const name = getAuthorDisplay(author)
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2)
}
