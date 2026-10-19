export class ProcessWorkOrderRequest {
  workOrderId: string;
  newStatus: string;
  userId: string;
  comment?: string;
  finalizationDescription?: string;

  constructor(
    workOrderId: string,
    newStatus: string,
    userId: string,
    comment?: string,
    finalizationDescription?: string,
  ) {
    this.workOrderId = workOrderId;
    this.newStatus = newStatus;
    this.userId = userId;
    this.comment = comment;
    this.finalizationDescription = finalizationDescription;
  }
}
