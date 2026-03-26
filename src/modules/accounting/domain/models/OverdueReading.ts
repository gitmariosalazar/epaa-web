export interface OverduePayment {
  cadastralKey: string;
  clientId: string;
  name: string;
  totalTrashRate: number;
  totalEpaaValue: number;
  totalOldImprovementsInterest: number;
  totalSurcharge: number;
  totalOldSurcharge: number;
  monthsPastDue: number;
}
