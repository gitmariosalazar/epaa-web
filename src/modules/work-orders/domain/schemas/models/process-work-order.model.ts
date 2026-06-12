export class ProcessWorkOrderModel {
  private readonly props: {
    workOrderId: string;
    newStatus: string;
    userId: string;
    comment?: string;
  };

  private constructor(props: {
    workOrderId: string;
    newStatus: string;
    userId: string;
    comment?: string;
  }) {
    this.props = props;
  }

  public static create(props: {
    workOrderId: string;
    newStatus: string;
    userId: string;
    comment?: string;
  }): ProcessWorkOrderModel {
    return new ProcessWorkOrderModel(props);
  }

  public get workOrderId(): string {
    return this.props.workOrderId;
  }

  public get newStatus(): string {
    return this.props.newStatus;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public get comment(): string | undefined {
    return this.props.comment;
  }
}
