// dateFormatter.ts

// Validates if a date string is in YYYY-MM-DD format and represents a valid date
export function isValidDate(dateString: string): boolean {
  try {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return false;
    }
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date.toISOString().startsWith(dateString);
  } catch {
    return false;
  }
}

// Formats a YYYY-MM-DD date string for GraphQL (ISO 8601 format)
export function formatDateForGraphQL(dateString: string): string {
  if (!isValidDate(dateString)) {
    throw new Error(`Invalid date format: ${dateString}`);
  }
  // Convert YYYY-MM-DD to ISO 8601 (e.g., 2025-08-21T00:00:00.000Z)
  return new Date(dateString).toISOString();
}

// Formats a date string or Date object for HTML input (YYYY-MM-DD)
export function formatDateForInput(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    return new Date().toISOString().split('T')[0]; // Fallback to today
  }
  return d.toISOString().split('T')[0];
}