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
  totalDue?: number;
}

export interface OverdueSummary {
  totalClientsWithDebt: number;
  totalUniqueCadastralKeys: number;
  totalMonthsPastDue: number;
  totalDebtAmount: number;
  totalEpaaValue: number;
  totalTrashRate: number;
  totalSurcharge: number;
  totalOldSurcharge: number;
  totalImprovementsInterest: number;
  avgMonthsPastDue: number;
  maxMonthsInDebt: number;
  minMonthsInDebt: number;
  clientsOver6Months: number;
  clientsOver1Year: number;
  maxDaysInDebt: number;
  avgDebtPerClient: number;
}

export interface YearlyOverdueSummary {
  year: number;
  totalUniqueClients: number;
  totalUniqueCadastralKeys: number;
  clientsWithDebt: number;
  totalUniqueCadastralKeysByYear: number;
  totalMonthsPastDue: number;
  totalDebtAmount: number;
  totalEpaaValue: number;
  totalTrashRate: number;
  totalSurcharge: number;
  totalOldSurcharge: number;
  totalImprovementsInterest: number;
  avgMonthsPastDue: number;
  maxMonthsInDebt: number;
  minMonthsInDebt: number;
  clientsOver6Months: number;
  clientsOver1Year: number;
  maxDaysInDebt: number;
  avgDebtPerClient: number;
}

export interface MonthlyDebtSummary {
  year: number;
  month: number;
  monthName: string;

  totalUniqueClients: number;
  totalUniqueCadastralKeys: number;

  clientsWithDebtThisMonth: number;
  uniqueCadastralKeysThisMonth: number;

  totalMonthsPastDue: number;
  totalDebtAmount: number;

  totalEpaaValue: number;
  totalTrashRate: number;
  totalSurcharge: number;
  totalOldSurcharge: number;
  totalImprovementsInterest: number;

  avgMonthsPastDue: number | null;
  maxMonthsInDebt: number;
  minMonthsInDebt: number;

  clientsOver6Months: number;
  clientsOver1Year: number;

  maxDaysInDebt: number;
  avgDebtPerClient: number;
}
