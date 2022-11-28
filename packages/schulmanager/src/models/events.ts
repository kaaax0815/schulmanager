export interface Group {
  createdAt: string;
  updatedAt: string;
  visibleEventsId: number;
  visibleForGroupsId: number;
}

export interface VisibleForGroup {
  /** Not sure about this Key. May be different for you */
  '26': Group;
  id: number;
}

export interface Event {
  summary: string;
  description: string;
  location: unknown;
  organizer: string;
  id: number;
  start: string;
  end: string;
  allDay: boolean;
  categoryId: number;
  recurrencePattern: unknown;
  visibleForGroups: VisibleForGroup[];
}

export interface Events {
  nonRecurringEvents: Event[];
  recurringEvents: Event[];
}

export interface EventsRequest {
  /** @format `YYYY-MM-DD` */
  end: string;
  /** @format `YYYY-MM-DD` */
  start: string;
  includeHolidays: boolean;
}
