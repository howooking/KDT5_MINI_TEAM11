export interface IMySchedule {
  id: number;
  key: number;
  scheduleType: 'ANNUAL' | 'DUTY';
  startDate: string;
  endDate: string;
  state: 'REJECT' | 'APPROVE' | 'PENDING';
}
