export interface Payment {
  incomeCode: string;
  cardId: string;
  name: string;
  incomeDate: string;
  paymentDate: string;
  incomeStatus: string;
  titleCode: string;
  dueDate: string;
  titleValue: number;
  thirdPartyValue: number;
  surcharge: number;
  trashRate: number;
  cadastralKey: string;
  total: number;
  paymentUser: string;
  value?: number;
  orderValue?: number;
  paymentMethod?: string;
  comments: string;
}
