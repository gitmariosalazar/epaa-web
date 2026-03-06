export class DateRangeParams {
  public startDate: string;
  public endDate: string;
  public top?: number;
  public limit?: number;
  public offset?: number;

  constructor(
    startDate: string,
    endDate: string,
    top?: number,
    limit?: number,
    offset?: number
  ) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.top = top;
    this.limit = limit;
    this.offset = offset;
  }
}
