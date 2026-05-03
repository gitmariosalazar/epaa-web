import type { IDateService } from '../../domain/services/IDateService';

export class EcuadorDateService implements IDateService {
  private readonly timeZone = 'America/Guayaquil';
  private readonly locale = 'es-EC';

  getCurrentDate(): Date {
    // Create a date object that represents the current time in Ecuador
    // We get the current UTC time
    const now = new Date();

    // Format it to Ecuador time parts
    const ecuadorTimeParts = new Intl.DateTimeFormat('en-US', {
      timeZone: this.timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    }).formatToParts(now);

    // Reconstruct date object (Note: this "Date" object will technically be in local browser timezone but holding Ecuador time values.
    // This is often sufficient for display and "YYYY-MM-DD" generation, but be careful with UTC conversions.)
    // However, a better approach for "getCurrentDateString" is using format directly.

    // For strictly getting a Date object that "looks" like Ecuador time:
    const year = parseInt(
      ecuadorTimeParts.find((p) => p.type === 'year')?.value || '0'
    );
    const month =
      parseInt(ecuadorTimeParts.find((p) => p.type === 'month')?.value || '0') -
      1;
    const day = parseInt(
      ecuadorTimeParts.find((p) => p.type === 'day')?.value || '0'
    );
    const hour = parseInt(
      ecuadorTimeParts.find((p) => p.type === 'hour')?.value || '0'
    );
    const minute = parseInt(
      ecuadorTimeParts.find((p) => p.type === 'minute')?.value || '0'
    );
    const second = parseInt(
      ecuadorTimeParts.find((p) => p.type === 'second')?.value || '0'
    );

    return new Date(year, month, day, hour, minute, second);
  }

  getCurrentDateString(): string {
    return this.toISODateString(new Date());
  }

  getCurrentMonthString(): string {
    const date = this.toISODateString(new Date()); // YYYY-MM-DD
    return date.slice(0, 7); // YYYY-MM
  }

  formatToLocaleString(
    date: Date | string | number,
    options?: Intl.DateTimeFormatOptions
  ): string {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        return String(date || '');
      }
      return new Intl.DateTimeFormat(this.locale, {
        timeZone: this.timeZone,
        ...options
      }).format(d);
    } catch (error) {
      console.error('Error formatting date:', error);
      return String(date || '');
    }
  }

  toISODateString(date: Date | string | number): string {
    const d = new Date(date);
    // Use Intl to get YYYY, MM, DD in Ecuador time specifically
    const formatter = new Intl.DateTimeFormat('en-CA', {
      // en-CA gives YYYY-MM-DD
      timeZone: this.timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(d);
  }
  // 2026-04-16T16:07:29-05:00
  toISODateStringWithOffset(date: Date | string | number): string {
    const d = new Date(date);
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: this.timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    return formatter.format(d);
  }

  // Returns "YYYY-MM-DD HH:mm:ss" in Ecuador timezone.
  // Example: new Date() → "2026-05-03 14:30:45"
  formatToDateTimeString(date: Date | string | number): string {
    const d = new Date(date);
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: this.timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).formatToParts(d);

    const get = (type: string) =>
      parts.find((p) => p.type === type)?.value ?? '00';

    return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')}`;
  }

  // Returns "YYYY-NOMBRE_MES" in uppercase Spanish.
  // Accepts a Date, a timestamp number, or a "YYYY-MM" / "YYYY-MM-DD" string.
  // Examples: "2026-05" → "2026-MAYO"  |  new Date() → "2026-MAYO"
  getMonthString(date: Date | string | number): string {
    // If input is a "YYYY-MM" string, append "-01" so Date can parse it correctly
    const normalized =
      typeof date === 'string' && /^\d{4}-\d{2}$/.test(date)
        ? `${date}-01`
        : date;

    const d = new Date(normalized);

    const yearFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: this.timeZone,
      year: 'numeric'
    });

    const monthFormatter = new Intl.DateTimeFormat('es-ES', {
      timeZone: this.timeZone,
      month: 'long'
    });

    const year = yearFormatter.format(d);
    const month = monthFormatter.format(d).toUpperCase();

    return `${year}-${month}`;
  }
}

export const dateService = new EcuadorDateService();
