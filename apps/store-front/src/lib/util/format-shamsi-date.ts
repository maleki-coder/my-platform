// src/lib/util/format-shamsi-date.ts
import { format } from 'date-fns-jalali';
import { faIR } from 'date-fns-jalali/locale';

interface FormatOptions {
  includeTime?: boolean;
}

/**
 * Converts a Gregorian date to formatted Shamsi date string with exact Persian format
 * @param date - Gregorian date from Medusa API (string or Date object)
 * @param options - Optional flags for formatting
 * @returns Formatted Persian (Shamsi) date string: "ش 27 اسفند 1401" or "ش 27 اسفند 1401 . ساعت 12:15:05"
 */
export function formatShamsiDate(date: string | Date, options: FormatOptions = {}): string {
  try {
    if (!date) return '';
    
    const gregorianDate = typeof date === 'string' ? new Date(date) : date;
    
    // Validate date
    if (isNaN(gregorianDate.getTime())) {
      console.warn('Invalid date provided to formatShamsiDate:', date);
      return '-';
    }

    const { includeTime = false } = options;
    
    // Format date components with Persian locale and digits
    const shamsiYear = format(gregorianDate, 'yyyy', { locale: faIR });
    const shamsiMonth = format(gregorianDate, 'MMMM', { locale: faIR });
    const shamsiDay = format(gregorianDate, 'd', { locale: faIR });
    
    // Format: ش DAY MONTH YEAR
    const datePart = ` ${shamsiDay} ${shamsiMonth} ${shamsiYear}`;
    
    if (includeTime) {
      // Include seconds in time format (HH:mm:ss)
      const timePart = format(gregorianDate, 'HH:mm:ss', { locale: faIR });
      return `${datePart} . ساعت ${timePart}`;
    }
    
    return datePart;
    
  } catch (error) {
    console.error('Error formatting Shamsi date:', error);
    return '-';
  }
}