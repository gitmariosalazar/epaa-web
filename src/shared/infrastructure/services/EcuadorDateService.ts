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
    const d = new Date(date);
    return new Intl.DateTimeFormat(this.locale, {
      timeZone: this.timeZone,
      ...options
    }).format(d);
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
}

export const dateService = new EcuadorDateService();
