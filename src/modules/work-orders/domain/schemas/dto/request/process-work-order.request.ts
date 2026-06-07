export class ProcessWorkOrderRequest {
  workOrderId: string;
  newStatus: string;
  userId: string;
  comment?: string;

  constructor(
    workOrderId: string,
    newStatus: string,
    userId: string,
    comment?: string,
  ) {
    this.workOrderId = workOrderId;
    this.newStatus = newStatus;
    this.userId = userId;
    this.comment = comment;
  }
}
