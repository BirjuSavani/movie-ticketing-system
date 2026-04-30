import { DateTime, DateTimeFormatOptions } from 'luxon';

export const DEFAULT_TIMEZONE = 'Asia/Kolkata';

export const TimeUtil = {
  /**
   * Always use this for "current time" in business logic
   */
  now(): DateTime {
    return DateTime.now().setZone(DEFAULT_TIMEZONE);
  },

  /**
   * Always store in DB as UTC
   */
  nowUTC(): Date {
    return DateTime.utc().toJSDate();
  },

  /**
   * Convert Date or ISO → IST safely
   */
  toIST(date: Date | string): DateTime {
    if (typeof date === 'string') {
      return DateTime.fromISO(date, { zone: 'utc' }).setZone(DEFAULT_TIMEZONE);
    }
    return DateTime.fromJSDate(date).setZone(DEFAULT_TIMEZONE);
  },

  /**
   * Convert IST input → UTC (for DB storage)
   */
  fromIST(iso: string): Date {
    return DateTime.fromISO(iso, { zone: DEFAULT_TIMEZONE }).toUTC().toJSDate();
  },

  /**
   * Format for UI
   */
  formatIST(date: Date | string, format: DateTimeFormatOptions = DateTime.DATETIME_MED): string {
    return this.toIST(date).toLocaleString(format);
  },

  /**
   * Add minutes safely (returns UTC Date for DB)
   */
  addMinutes(date: Date, minutes: number): Date {
    return DateTime.fromJSDate(date).plus({ minutes }).toUTC().toJSDate();
  },

  subtractMinutes(date: Date, minutes: number): Date {
    return DateTime.fromJSDate(date).minus({ minutes }).toUTC().toJSDate();
  },

  /**
   * Booking cutoff check (CORRECT + CLEAR)
   */
  isBookingClosed(showtime: Date, cutoffMinutes: number): boolean {
    const now = this.now(); // IST
    const cutoff = this.toIST(showtime).minus({ minutes: cutoffMinutes });

    return now >= cutoff;
  },

  /**
   * Safe comparison
   */
  isAfter(date1: Date, date2: Date): boolean {
    return DateTime.fromJSDate(date1).toMillis() >
           DateTime.fromJSDate(date2).toMillis();
  },

  /**
   * Get IST day range (used in filters)
   */
  getISTDayRange(dateStr: string): { start: Date; end: Date } {
    const dt = DateTime.fromISO(dateStr, { zone: DEFAULT_TIMEZONE });

    return {
      start: dt.startOf('day').toUTC().toJSDate(),
      end: dt.endOf('day').toUTC().toJSDate(),
    };
  }
};
