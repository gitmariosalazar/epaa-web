/**
 * Masks a string by keeping the first character of each word and replacing the rest with asterisks.
 * Only words longer than 2 characters are masked.
 * 
 * Example:
 * "VASCONEZ ESPINOSA MARTHA CECILIA" -> "V******* E******* M***** C******"
 * "1001123221" -> "1*********"
 * "DE" -> "DE"
 */
export const maskString = (text: string | undefined | null): string => {
  if (!text) return '';

  return text
    .split(' ')
    .map((word) => {
      // Only mask words longer than 2 characters
      if (word.length > 2) {
        return word[0] + '*'.repeat(word.length - 1);
      }
      return word;
    })
    .join(' ');
};
