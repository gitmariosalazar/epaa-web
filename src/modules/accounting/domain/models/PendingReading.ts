export interface PendingReading {
  // ── Identificación del Cliente y Suministro ────────────────────────────────
  incomeCode: string;
  incomeTitleCode?: string;
  readingCaptureDate: Date | null;
  cardId: string;
  name: string;
  lastName: string;
  cadastralKey: string;
  address: string;
  rate: string;

  // ── Período de Facturación e Ingresos ──────────────────────────────────────
  month: string;
  year: number;
  monthDue: string;
  yearDue: number;
  dueDate: Date | null;
  paymentDate: Date | null;
  incomeStatus: string;
  incomeDate: Date | null;

  // ── Lectura del Medidor ────────────────────────────────────────────────────
  currentReading: number;
  previousReading: number;
  consumption: number;
  readingStatus: string;
  readingValue: number;

  // ── Valores de Agua (Servicios Base) ───────────────────────────────────────
  epaaValue: number; // Valor del consumo de agua
  thirdPartyValue: number; // Valor por servicios de terceros (ej. alcantarillado)
  surcharge: number; // Recargo por mora
  totalEpaaValue: number; // Subtotal: Agua + Terceros + Recargo

  // ── Tasa de Basura y Notas de Crédito ──────────────────────────────────────
  trashRateOfficial: number; // Tarifa de basura OFICIAL (según tabla Valor o Datos_ingreso)
  trashRate: number; // Lo que EFECTIVAMENTE paga (0 si el saldo a favor cubre todo)
  trashRatePrevious: number; // Crédito o nota de crédito original que arrastra del pasado
  balanceInFavorCurrentMonth: number; // Saldo a favor actual
  balanceInFavorNextMonth: number; // Saldo sobrante a favor para el próximo mes
  balanceAgainstNextMonth: number; // Saldo en contra (siempre nulo/0)
  discountTrashRate: number; // Descuento manual aplicado (0 en recibos pendientes)
  totalTrashRate: number; // Total neto de basura cobrado en esta planilla

  // ── Totales de la Planilla ─────────────────────────────────────────────────
  total: number; // Sumatoria base asumiendo tarifa plena de basura
  adjustedTotal: number; // TOTAL REAL A PAGAR (Total Epaa + Basura Efectiva Pagada)
}
