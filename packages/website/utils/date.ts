/**
 * @returns The date in the format YYYY-MM-DD
 */
export function formatDateToAPI(date: Date) {
  return date.toISOString().split('T')[0];
}

/**
 * @param time The number of months or days, etc to add to the current date. Date object to to add to.
 * @description This does not mutate the date object
 * @returns The date that is in the future
 */
export function dateInTime({
  months,
  weeks,
  days,
  date = new Date()
}: {
  months?: number;
  weeks?: number;
  days?: number;
  date?: Date;
}) {
  const copiedDate = new Date(date);
  copiedDate.setMonth(copiedDate.getMonth() + (months ?? 0));
  copiedDate.setDate(copiedDate.getDate() + (weeks ?? 0) * 7);
  copiedDate.setDate(copiedDate.getDate() + (days ?? 0));
  return copiedDate;
}

/**
 * @param date The date in the format `2023-01-25T00:00:00.000Z`
 * @returns The date in the format `Mittwoch, 25.01.2023`
 */
export function formatApiToHuman(date: string, options?: Intl.DateTimeFormatOptions) {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options
  };

  return new Date(date).toLocaleDateString('de-DE', defaultOptions);
}

// `getLastMonday` (modified) and `getUpcomingSunday` (modified) from <https://stackoverflow.com/a/60243057/13707908>

/**
 * @param date Date to get the last monday from
 * @description This does not mutate the date object
 * @returns the last monday
 */
export function getLastMonday(date = new Date()) {
  const clonedDate = new Date(date);
  const today = clonedDate.getDate();
  const currentDay = clonedDate.getDay();
  clonedDate.setDate(today - (currentDay - 1));
  return clonedDate;
}

/**
 * @param date Date to get the upcoming sunday from
 * @description This does not mutate the date object
 * @returns the upcoming sunday
 */
export function getUpcomingSunday(date = new Date()) {
  const clonedDate = new Date(date);
  const today = clonedDate.getDate();
  const currentDay = clonedDate.getDay();
  clonedDate.setDate(today - currentDay + 7);
  return clonedDate;
}
