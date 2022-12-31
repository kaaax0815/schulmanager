/**
 * @returns The date in the format YYYY-MM-DD
 */
export function formatDateToAPI(date: Date) {
  return date.toISOString().split('T')[0];
}

/**
 * @param months The number of months to add to the current date
 * @returns The date that is `months` months in the future
 */
export function dateInMonth(months: number) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date;
}

/**
 * @param date The date in the format `2023-01-25T00:00:00.000Z`
 * @returns The date in the format `Mittwoch, 25.01.2023`
 */
export function formatApiToHuman(date: string, options?: Intl.DateTimeFormatOptions) {
  return new Date(date).toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options
  });
}
