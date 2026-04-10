/*
 * Truncates a string to a specified maximum length.
 * @param text - The string to truncate.
 * @param maxLength - The maximum length of the string.
 * @returns The truncated string.
 */
function truncateText(
  text: string | undefined | null,
  maxLength: number = 25
): string {
  if (!text) return '';

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength).trim() + '...';
}

export { truncateText };
