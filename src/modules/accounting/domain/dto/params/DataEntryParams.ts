export class DateRangeParams {
  public startDate: string; // ISO string: '2026-02-01T00:00:00.000Z'
  public endDate: string; // ISO string: '2026-02-28T23:59:59.999Z'

  constructor(startDate: string, endDate: string) {
    this.startDate = startDate;
    this.endDate = endDate;
  }
}