export interface DashboardKpiResponse {
  year: number;
  month: string;
  sector: number;

  // Cantidad de lecturas
  totalMetersRead: number;

  // Consumos (Metros Cúbicos)
  totalConsumptionM3: number;
  averageConsumptionM3: number;

  // Valores propios de AP_LECTURAS
  consumptionValue: number; // Mantenido igual que el alias en SQL
  totalSewageValue: number;

  // Valores financieros (Agua y Tasas en Datos_ingreso)
  totalBilledWater: number;
  totalPaidWater: number;
  totalUnpaidWater: number;

  totalTrashRate: number;
  totalOldImprovementsInterest: number;
  totalSurcharge: number;
  totalBillsGenerated: number;

  // Intereses y conteos de facturas
  totalInterestCalculated: number;
  unpaidBillsCount: number;
  paidBillsCount: number;

  // Total deuda general consolidada
  totalDebtAmount: number;
}
