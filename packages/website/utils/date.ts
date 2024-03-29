/**
 * @returns The date in the format YYYY-MM-DD
 */
export function formatDateToAPI(date: Date) {
  return date.toISOString().split('T')[0];
}

export function formatApiToDate(date: string) {
  return new Date(date);
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

/**
 * @param date The date in the format `2023-01-25T00:00:00.000Z`
 * @returns The date in the format `12:00`
 */
export function formatApiToHumanTime(date: string, options?: Intl.DateTimeFormatOptions) {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };

  return new Date(date).toLocaleTimeString('de-DE', defaultOptions);
}

// `getLastMonday` (modified) and `getUpcomingFriday` (modified) from <https://stackoverflow.com/a/60243057/13707908>
// Monday is first of the week

/**
 * @param date Date to get the monday of the week of
 * @description This does not mutate the date object
 * @returns the monday of the week
 */
export function getMondayOfWeek(date = new Date()) {
  const clonedDate = new Date(date);
  const today = clonedDate.getDate();
  const currentDay = clonedDate.getDay();
  const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1;
  clonedDate.setDate(today - daysToSubtract);
  return clonedDate;
}

/**
 * @param date Date to get the friday of the week of
 * @description This does not mutate the date object
 * @returns the friday of the week
 */
export function getFridayOfWeek(date = new Date()) {
  const clonedDate = new Date(date);
  const today = clonedDate.getDate();
  const currentDay = clonedDate.getDay();
  const daysToDay = currentDay === 0 ? -2 : 5;
  clonedDate.setDate(today - currentDay + daysToDay);
  return clonedDate;
}

// `dateRange` from <https://stackoverflow.com/a/64592438/13707908>
/**
 * @param startDate The start date
 * @param endDate The end date
 * @param steps The number of days to add to the current date
 * @description This does not mutate the date object
 * @returns An array of dates between the start and end date
 */
export function dateRange(startDate: Date, endDate: Date, steps = 1) {
  const dateArray = [];
  const currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate));
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
  }

  return dateArray;
}

// `getWeekNumber` from <https://weeknumber.com/how-to/javascript>
/**
 * @param date The date to get the week number of
 * @description This does not mutate the date object
 * @returns The week number of the date
 */
export function getWeekNumber(date: Date) {
  const copiedDate = new Date(date);
  copiedDate.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  copiedDate.setDate(copiedDate.getDate() + 3 - ((copiedDate.getDay() + 6) % 7));
  // January 4 is always in week 1.
  const week1 = new Date(copiedDate.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((copiedDate.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
    )
  );
}

/**
 * @param date The date to get the next working day of
 * @description This does not mutate the date object
 * @returns The next working day
 */
export function getNextWorkingDay(date: Date) {
  const copiedDate = new Date(date);
  const day = copiedDate.getDay();
  copiedDate.setDate(copiedDate.getDate() + 1);
  if (day === 5) {
    copiedDate.setDate(copiedDate.getDate() + 2);
  }
  if (day === 6) {
    copiedDate.setDate(copiedDate.getDate() + 1);
  }
  return copiedDate;
}

// Credits: https://stackoverflow.com/a/15289883/13707908
export function dateDiffInDays(a: Date, b: Date) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

/**
 * @param date The date to format
 * @returns If today: "HH:MM", if yesterday: "Gestern", if this week: "dddd", else: "dd.mm.yy"
 */
export function formatTimestamp(date: Date) {
  const today = new Date();
  const yesterday = dateInTime({ days: -1 });

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return 'Gestern';
  }

  if (dateDiffInDays(date, today) <= 7) {
    return date.toLocaleDateString('de-DE', { weekday: 'long' });
  }

  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
}
