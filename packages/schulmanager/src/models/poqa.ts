export interface ScheduleClassHourRequest {
  action: {
    action: 'findAll';
    model: 'main/class-hour';
    parameters: [{ attributes: ['id', 'number', 'from', 'until', 'fromByDay', 'untilByDay'] }];
  };
}

export interface ScheduleClassHourResponse {
  status: number;
  data: {
    id: number;
    number: string;
    from: string;
    until: string;
    fromByDay: string[];
    untilByDay: string[];
  }[];
}
