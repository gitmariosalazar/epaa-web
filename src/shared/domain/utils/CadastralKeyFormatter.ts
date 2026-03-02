// src/shared/domain/utils/CadastralKeyFormatter.ts

export class CadastralKeyFormatter {
  static format(newValue: string, oldValue: string): string {
    // Basic cleanup: remove everything except digits and dashes
    let cleaned = newValue.replace(/[^\d-]/g, '');

    // Allow deleting the dash naturally without an infinite loop
    if (oldValue.endsWith('-') && newValue === oldValue.slice(0, -1)) {
      return cleaned; // user deleted the dash, let them have the number without it
    }

    // Strip hyphens to process rules easily by numbers
    const numbersOnly = cleaned.replace(/-/g, '');
    if (numbersOnly.length === 0) return '';

    let sectorStr = '';
    let cuentaStr = '';

    const firstDigit = parseInt(numbersOnly[0], 10);

    // First Digit Logic
    if (firstDigit >= 5) {
      // Sector is immediately complete at 1 digit
      sectorStr = numbersOnly[0];
      cuentaStr = numbersOnly.slice(1);
    } else {
      // First digit is 1, 2, 3, or 4
      if (numbersOnly.length >= 2) {
        const secondDigitStr = numbersOnly[1];
        const secondDigit = parseInt(secondDigitStr, 10);

        if (firstDigit === 4) {
          if (secondDigit === 0) {
            sectorStr = numbersOnly.slice(0, 2);
            cuentaStr = numbersOnly.slice(2);
          } else {
            // Invalid second digit after 4. Keep only the 4.
            sectorStr = numbersOnly[0];
            cuentaStr = '';
          }
        } else {
          // First digit is 1, 2, or 3. Any 0-9 is valid.
          sectorStr = numbersOnly.slice(0, 2);
          cuentaStr = numbersOnly.slice(2);
        }
      } else {
        // Only 1 digit typed so far
        sectorStr = numbersOnly;
      }
    }

    // Reconstruct the string
    // If cuenta has digits, we MUST have a dash
    if (cuentaStr.length > 0) {
      return `${sectorStr}-${cuentaStr}`;
    }

    // Auto-append dash if sector is fully formed and no cuenta yet
    if (
      (sectorStr.length === 1 && parseInt(sectorStr, 10) >= 5) ||
      sectorStr.length === 2
    ) {
      // Don't auto-append if they just deleted the dash
      if (oldValue === `${sectorStr}-` && newValue === sectorStr) {
        return sectorStr;
      }
      return `${sectorStr}-`;
    }

    return sectorStr;
  }
}
