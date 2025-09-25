import { Author } from "../types"

// Helper function to ensure compatibility
const safeGetDisplayName = (author: Author): string | null => {
  // Handle both string | null and string | null | undefined
  return author.displayName !== undefined ? author.displayName : null
}

export const getAuthorDisplay = (author: Author): string => {
  const displayName = safeGetDisplayName(author)
  return author?.name || displayName || author?.username || "Unknown Author"
}

export const getAvatarUrl = (author: Author): string | null => {
  return author?.avatarUrl || null
}

export const getInitials = (author: Author): string => {
  const name = getAuthorDisplay(author)
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}