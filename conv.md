### 1. Consulta de Registro Individual de Cuotas de Convenios

- **Propósito de Negocio**: Esta consulta permite la auditoría granular de cada cuota emitida dentro del sistema de convenios. Es fundamental para procesos de conciliación bancaria y verificación de transacciones individuales por fecha de emisión.
- **Uso en Frontend**: Alimentación de tablas maestras con paginación y filtros por rango de fecha.

```sql
SET NOCOUNT ON;

DECLARE @Date_Start DATETIME
DECLARE @Date_End DATETIME

SET @Date_Start = CONVERT(DATETIME, '2026-01-01 00:00:00', 120)
SET @Date_End = CONVERT(DATETIME, '2026-04-15 23:59:59', 120)

SELECT
    di.id AS income_id,
    di.clave_catastral AS cadastral_key,
    c.CED_IDENT_CIUDADANO AS card_id,
    c.NOMBRES_CIUDADANO AS first_name,
    c.APELLIDOS_CIUDADANO AS last_name,
    di.fecha_emision AS issue_date,
    di.fecha_vencimiento AS due_date,
    di.fecha_pago AS payment_date,
    di.estado_pago AS payment_status,
    di.usuario_cobro AS collected_by,
    di.forma_de_pago AS payment_method,
    di.valor_capital AS principal_value,
    di.valor_interes AS interest_value,
    di.valor_recargo AS penalty_value,
    di.detalle AS details,
    di.n_cuotas AS total_installments,
    di.cuota AS current_installment
FROM Datos_Ingreso_Convenio di
INNER JOIN CIUDADANO c
    ON c.CED_IDENT_CIUDADANO = di.ciudadano_id
WHERE di.fecha_emision >= @Date_Start AND di.fecha_emision <= @Date_End
ORDER BY di.fecha_emision DESC;
```

- **Definiciones Técnicas (Modelado de Datos)**

```typescript
/** Representación lógica del resultado SQL bruto */
interface AgreementInstallmentSqlResult {
  income_id: number;
  cadastral_key: string;
  card_id: string;
  first_name: string;
  last_name: string;
  issue_date: string;
  due_date: string;
  payment_date: string | null;
  payment_status: number;
  collected_by: string | null;
  payment_method: string | null;
  principal_value: number;
  interest_value: number;
  penalty_value: number;
  details: string;
  total_installments: number;
  current_installment: number;
}

/** Objeto de Transferencia de Datos (DTO) para el Frontend */
interface AgreementInstallmentResponse {
  incomeId: number;
  cadastralKey: string;
  cardId: string;
  firstName: string;
  lastName: string;
  issueDate: string;
  dueDate: string;
  paymentDate: string | null;
  paymentStatus: number;
  collectedBy: string | null;
  paymentMethod: string | null;
  principalValue: number;
  interestValue: number;
  penaltyValue: number;
  details: string;
  totalInstallments: number;
  currentInstallment: number;
}

/** Modelo de Dominio con lógica si fuera necesaria */
class AgreementInstallment {
  constructor(
    public readonly incomeId: number,
    public readonly cadastralKey: string,
    public readonly cardId: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly issueDate: Date,
    public readonly dueDate: Date,
    public readonly paymentDate: Date | null,
    public readonly paymentStatus: number,
    public readonly collectedBy: string | null,
    public readonly paymentMethod: string | null,
    public readonly principalValue: number,
    public readonly interestValue: number,
    public readonly penaltyValue: number,
    public readonly details: string,
    public readonly totalInstallments: number,
    public readonly currentInstallment: number
  ) {}

  get isOverdue(): boolean {
    return this.paymentStatus === 0 && new Date() > this.dueDate;
  }

  get totalAmount(): number {
    return this.principalValue + this.interestValue + this.penaltyValue;
  }
}
```

---

### 2. Consolidado de Convenios Agrupado por Ciudadano

- **Propósito de Negocio**: Provee una vista analítica del nivel de endeudamiento y cumplimiento por contribuyente. Permite identificar de un vistazo quiénes son los principales beneficiarios de convenios y su comportamiento histórico de pago.
- **Uso en Frontend**: Pantallas de gestión de carteras y reportes de morosidad institucional.

```sql
SET NOCOUNT ON;

DECLARE @Date_Start DATETIME
DECLARE @Date_End DATETIME

SET @Date_Start = CONVERT(DATETIME, '2026-01-01 00:00:00', 120)
SET @Date_End = CONVERT(DATETIME, '2026-04-15 23:59:59', 120)

SELECT
    di.clave_catastral AS cadastral_key,
    c.CED_IDENT_CIUDADANO AS card_id,
    c.NOMBRES_CIUDADANO AS first_name,
    c.APELLIDOS_CIUDADANO AS last_name,
    COUNT(di.id) AS total_incomes,
    SUM(di.valor_capital) AS total_principal_value,
    SUM(di.valor_interes) AS total_interest_value,
    SUM(di.valor_recargo) AS total_surcharge_value,
    SUM(di.valor_capital + di.valor_interes + di.valor_recargo) AS total_amount_value,
    COUNT(CASE WHEN di.estado_pago = 0 THEN 1 END) AS pending_incomes,
    COUNT(CASE WHEN di.estado_pago = 1 THEN 1 END) AS paid_incomes,
    COUNT(CASE WHEN di.forma_de_pago = 'TransBanPI' THEN 1 END) AS transbanpi_incomes,
    COUNT(CASE WHEN di.forma_de_pago = 'Tarjeta' THEN 1 END) AS card_incomes,
    COUNT(CASE WHEN di.forma_de_pago = 'Transferencia' THEN 1 END) AS transfer_incomes,
    COUNT(CASE WHEN di.forma_de_pago = 'Cheque' THEN 1 END) AS check_incomes,
    COUNT(CASE WHEN di.forma_de_pago = 'Efectivo' THEN 1 END) AS cash_incomes,
    COUNT(CASE WHEN di.forma_de_pago = 'NotaDeCredito' THEN 1 END) AS credit_note_incomes
FROM Datos_Ingreso_Convenio di
INNER JOIN CIUDADANO c
    ON c.CED_IDENT_CIUDADANO = di.ciudadano_id
WHERE di.fecha_emision >= @Date_Start AND di.fecha_emision <= @Date_End
GROUP BY c.CED_IDENT_CIUDADANO, di.clave_catastral, c.NOMBRES_CIUDADANO, c.APELLIDOS_CIUDADANO
ORDER BY total_amount_value DESC;
```

- **Definiciones Técnicas**

```typescript
/** Resultado directo del SQL */
interface CitizenAgreementSummarySqlResult {
  cadastral_key: string;
  card_id: string;
  first_name: string;
  last_name: string;
  total_incomes: number;
  total_principal_value: number;
  total_interest_value: number;
  total_surcharge_value: number;
  total_amount_value: number;
  pending_incomes: number;
  paid_incomes: number;
  transbanpi_incomes: number;
  card_incomes: number;
  transfer_incomes: number;
  check_incomes: number;
  cash_incomes: number;
  credit_note_incomes: number;
}

/** DTO para transferencia al cliente */
/** Modelo de Dominio */
class CitizenAgreementSummary {
  constructor(
    public readonly cadastralKey: string,
    public readonly cardId: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly totalIncomes: number,
    public readonly totalPrincipalValue: number,
    public readonly totalInterestValue: number,
    public readonly totalSurchargeValue: number,
    public readonly totalAmountValue: number,
    public readonly pendingIncomes: number,
    public readonly paidIncomes: number,
    public readonly paymentMethodStats: {
      transbanpi: number;
      card: number;
      transfer: number;
      check: number;
      cash: number;
      creditNote: number;
    }
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get complianceRate(): number {
    return this.totalIncomes > 0
      ? (this.paidIncomes / this.totalIncomes) * 100
      : 0;
  }
}
```

---

### 3. Dashboard Overview: Indicadores Clave de Desempeño (KPIs)

- **Propósito de Negocio**: Ofrece una visión ejecutiva de la salud financiera del sistema de convenios. Mide la eficacia de la recaudación y expone el riesgo de morosidad actual en términos monetarios.
- **Uso en Frontend**: Widgets de resumen (Cards) en la parte superior del Dashboard General.

```sql
SET NOCOUNT ON;

DECLARE @SearchType VARCHAR(10)
SET @SearchType = 'MONTH'

DECLARE @startDate DATETIME
SET @startDate = CONVERT(DATETIME, '2015-01-01 00:00:00.000', 120)

DECLARE @endDate DATETIME
SET @endDate = CONVERT(DATETIME, '2026-12-31 23:59:59.997', 120)

SELECT
    -- =============================================
    -- 1. DIMENSIONES TEMPORALES
    -- =============================================
    YEAR(fecha_emision) AS year,
    CASE WHEN @SearchType IN ('MONTH','DAY') THEN MONTH(fecha_emision) ELSE NULL END AS month,
    CASE WHEN @SearchType = 'DAY' THEN DAY(fecha_emision) ELSE NULL END AS day,

    -- =============================================
    -- 2. TOTALES FINANCIEROS
    -- =============================================
    SUM(valor_capital + valor_interes + valor_recargo) AS total_emitted,
    SUM(CASE WHEN estado_pago = 1 THEN (valor_capital + valor_interes + valor_recargo) ELSE 0 END) AS total_collected,
    SUM(CASE WHEN estado_pago = 0 THEN (valor_capital + valor_interes + valor_recargo) ELSE 0 END) AS total_pending,

    -- =============================================
    -- 3. DESGLOSE POR COMPONENTE
    -- =============================================
    SUM(valor_capital)      AS total_principal,
    SUM(valor_interes)      AS total_interest,
    SUM(valor_recargo)      AS total_surcharge,

    -- =============================================
    -- 4. NUEVOS: RECUPERACIÓN DE CAPITAL
    -- =============================================
    SUM(CASE WHEN estado_pago = 1 THEN valor_capital ELSE 0 END) AS principal_collected,
    CAST(SUM(CASE WHEN estado_pago = 1 THEN valor_capital ELSE 0 END) * 100.0 /
         NULLIF(SUM(valor_capital), 0) AS DECIMAL(10,2)) AS principal_recovery_pct,

    -- =============================================
    -- 5. EFICIENCIA DE COBRO
    -- =============================================
    CAST(SUM(CASE WHEN estado_pago = 1 THEN 1.0 ELSE 0.0 END) * 100.0 /
         NULLIF(COUNT(*), 0) AS DECIMAL(10,2)) AS collection_efficiency_pct,

    CAST(SUM(CASE WHEN estado_pago = 1 THEN (valor_capital + valor_interes + valor_recargo) ELSE 0 END) * 100.0 /
         NULLIF(SUM(valor_capital + valor_interes + valor_recargo), 0) AS DECIMAL(10,2)) AS collection_amount_pct,

    -- =============================================
    -- 6. CONTEOS Y CLIENTES
    -- =============================================
    COUNT(DISTINCT ciudadano_id)        AS total_citizens_with_agreements,
    COUNT(*)                            AS total_installments_count,
    SUM(CASE WHEN estado_pago = 0 THEN 1 ELSE 0 END ) AS total_installments_pendings,
    SUM(CASE WHEN estado_pago = 1 THEN 1 ELSE 0 END ) AS total_installments_paid,

    -- =============================================
    -- 7. MÉTRICAS DE VENCIMIENTO Y RIESGO (Mejoradas)
    -- =============================================
    SUM(CASE WHEN estado_pago = 0 AND fecha_vencimiento < GETDATE() THEN 1 ELSE 0 END) AS overdue_installments_count,
    SUM(CASE WHEN estado_pago = 0 AND fecha_vencimiento < GETDATE() THEN (valor_capital + valor_interes + valor_recargo) ELSE 0 END) AS overdue_amount,

    AVG(CASE WHEN estado_pago = 0 AND fecha_vencimiento < GETDATE()
             THEN DATEDIFF(day, fecha_vencimiento, GETDATE()) END) AS avg_overdue_days,

    MAX(CASE WHEN estado_pago = 0 AND fecha_vencimiento < GETDATE()
             THEN DATEDIFF(day, fecha_vencimiento, GETDATE()) END) AS max_overdue_days,

    -- Aging Buckets (muy útil para gestión de cobranza)
    SUM(CASE WHEN estado_pago = 0 AND fecha_vencimiento < GETDATE()
             AND DATEDIFF(day, fecha_vencimiento, GETDATE()) BETWEEN 1 AND 30 THEN 1 ELSE 0 END) AS overdue_1_30_days,

    SUM(CASE WHEN estado_pago = 0 AND fecha_vencimiento < GETDATE()
             AND DATEDIFF(day, fecha_vencimiento, GETDATE()) BETWEEN 31 AND 60 THEN 1 ELSE 0 END) AS overdue_31_60_days,

    SUM(CASE WHEN estado_pago = 0 AND fecha_vencimiento < GETDATE()
             AND DATEDIFF(day, fecha_vencimiento, GETDATE()) BETWEEN 61 AND 90 THEN 1 ELSE 0 END) AS overdue_61_90_days,

    SUM(CASE WHEN estado_pago = 0 AND fecha_vencimiento < GETDATE()
             AND DATEDIFF(day, fecha_vencimiento, GETDATE()) > 90 THEN 1 ELSE 0 END) AS overdue_more_90_days,

    SUM(CASE WHEN estado_pago = 0 AND fecha_vencimiento < DATEADD(month, -3, GETDATE()) THEN 1 ELSE 0 END) AS critical_overdue_count,

    SUM(CASE WHEN estado_pago = 0 THEN valor_capital ELSE 0 END) AS capital_balance_pending,

    -- =============================================
    -- 8. PROMEDIOS Y OTROS
    -- =============================================
    AVG(valor_capital + valor_interes + valor_recargo) AS avg_installment_value,

    AVG(CASE WHEN estado_pago = 1 THEN DATEDIFF(day, fecha_emision, fecha_pago) END) AS avg_days_to_pay   -- (si tienes columna fecha_pago)

FROM Datos_Ingreso_Convenio
WHERE fecha_emision BETWEEN @startDate AND @endDate
GROUP BY
    YEAR(fecha_emision),
    CASE WHEN @SearchType IN ('MONTH','DAY') THEN MONTH(fecha_emision) ELSE NULL END,
    CASE WHEN @SearchType = 'DAY' THEN DAY(fecha_emision) ELSE NULL END
ORDER BY year DESC, month DESC, day DESC;
```

- **Definiciones Técnicas**

```typescript
/** Resultado directo del SQL */
interface AgreementKPIsSqlResult {
  year: number;
  month: number | null;
  day: number | null;
  total_emitted: number;
  total_collected: number;
  total_pending: number;
  total_principal: number;
  total_interest: number;
  total_surcharge: number;
  principal_collected: number;
  principal_recovery_pct: number;
  collection_efficiency_pct: number;
  collection_amount_pct: number;
  total_citizens_with_agreements: number;
  total_installments_count: number;
  total_installments_pendings: number;
  total_installments_paid: number;
  overdue_installments_count: number;
  overdue_amount: number;
  avg_overdue_days: number;
  max_overdue_days: number;
  overdue_1_30_days: number;
  overdue_31_60_days: number;
  overdue_61_90_days: number;
  overdue_more_90_days: number;
  critical_overdue_count: number;
  capital_balance_pending: number;
  avg_installment_value: number;
  avg_days_to_pay: number;
}

/** DTO para el Dashboard */
interface AgreementKPIsResponse {
  year: number;
  month: number | null;
  day: number | null;
  totalEmitted: number;
  totalCollected: number;
  totalPending: number;
  totalPrincipal: number;
  totalInterest: number;
  totalSurcharge: number;
  efficiencyPct: number;
  totalCitizens: number;
  totalInstallments: number;
  overdueCount: number;
  overdueAmount: number;
  principalCollected: number;
  principalRecoveryPct: number;
  collectionAmountPct: number;
  totalInstallmentsPendings: number;
  totalInstallmentsPaid: number;
  avgOverdueDays: number;
  maxOverdueDays: number;
  overdue1_30Days: number;
  overdue31_60Days: number;
  overdue61_90Days: number;
  overdueMore90Days: number;
  criticalOverdueCount: number;
  capitalBalancePending: number;
  avgInstallmentValue: number;
  avgDaysToPay: number;
}

/** Modelo de Dominio de KPIs */
class AgreementKPIs {
  constructor(
    public readonly year: number,
    public readonly month: number | null,
    public readonly day: number | null,
    public readonly totalEmitted: number,
    public readonly totalCollected: number,
    public readonly totalPending: number,
    public readonly totalPrincipal: number,
    public readonly totalInterest: number,
    public readonly totalSurcharge: number,
    public readonly efficiencyPct: number,
    public readonly totalCitizens: number,
    public readonly totalInstallments: number,
    public readonly overdueCount: number,
    public readonly overdueAmount: number,
    public readonly principalCollected: number,
    public readonly principalRecoveryPct: number,
    public readonly collectionAmountPct: number,
    public readonly totalInstallmentsPendings: number,
    public readonly totalInstallmentsPaid: number,
    public readonly avgOverdueDays: number,
    public readonly maxOverdueDays: number,
    public readonly overdue1_30Days: number,
    public readonly overdue31_60Days: number,
    public readonly overdue61_90Days: number,
    public readonly overdueMore90Days: number,
    public readonly criticalOverdueCount: number,
    public readonly capitalBalancePending: number,
    public readonly avgInstallmentValue: number,
    public readonly avgDaysToPay: number
  ) {}

  get pendingPercentage(): number {
    return this.totalEmitted > 0
      ? (this.totalPending / this.totalEmitted) * 100
      : 0;
  }

  get averageInstallmentValue(): number {
    return this.totalInstallments > 0
      ? this.totalEmitted / this.totalInstallments
      : 0;
  }
}
```

---

### 4. Distribución por Métodos de Pago

- **Propósito de Negocio**: Identifica el volumen transaccional y el peso financiero de cada canal de pago. Ayuda a optimizar las ventanillas de cobro y los canales electrónicos.
- **Uso en Frontend**: Gráficos de dona (Donut Charts) para el análisis de métodos de pago.

```sql
SET NOCOUNT ON;

DECLARE @Date_Start DATETIME
DECLARE @Date_End DATETIME

SET @Date_Start = CONVERT(DATETIME, '2026-01-01 00:00:00', 120)
SET @Date_End = CONVERT(DATETIME, '2026-04-15 23:59:59', 120)

SELECT
    ISNULL(forma_de_pago, 'PENDIENTE') AS payment_method,
    COUNT(*) AS transaction_count,
    SUM(valor_capital + valor_interes + valor_recargo) AS total_amount,
    CAST(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() AS DECIMAL(10,2)) AS percentage
FROM Datos_Ingreso_Convenio
WHERE estado_pago = 1
AND fecha_pago BETWEEN @Date_Start AND @Date_End
GROUP BY forma_de_pago
ORDER BY total_amount DESC;
```

- **Definiciones Técnicas**

```typescript
/** Resultado directo del SQL */
interface PaymentMethodDistributionSqlResult {
  payment_method: string;
  transaction_count: number;
  total_amount: number;
  percentage: number;
}

/** DTO para Gráficos */
interface PaymentMethodDistributionResponse {
  method: string;
  count: number;
  amount: number;
  percentage: number;
}

/** Clase de Dominio */
class PaymentMethodDistribution {
  constructor(
    public readonly method: string,
    public readonly count: number,
    public readonly amount: number,
    public readonly percentage: number
  ) {}

  get formattedAmount(): string {
    return `$${this.amount.toLocaleString()}`;
  }
}
```

---

### 5. Análisis de Tendencia Mensual (Recaudación vs. Pendiente)

- **Propósito de Negocio**: Expone el comportamiento cíclico de los pagos. Es vital para detectar meses de baja recaudación y planificar campañas de incentivos.
- **Uso en Frontend**: Gráficos de área o de barras comparativas.

```sql
SELECT
    CONVERT(VARCHAR(7), fecha_emision, 126) AS month_key,
    SUM(valor_capital + valor_interes + valor_recargo) AS amount_emitted,
    SUM(CASE WHEN estado_pago = 1 THEN (valor_capital + valor_interes + valor_recargo) ELSE 0 END) AS amount_collected,
    SUM(CASE WHEN estado_pago = 0 THEN (valor_capital + valor_interes + valor_recargo) ELSE 0 END) AS amount_pending
FROM Datos_Ingreso_Convenio
WHERE fecha_emision >= DATEADD(MONTH, -12, GETDATE())
GROUP BY CONVERT(VARCHAR(7), fecha_emision, 126)
ORDER BY month_key;
```

- **Definiciones Técnicas**

```typescript
/** Resultado directo del SQL */
interface MonthlyTrendSqlResult {
  month_key: string;
  amount_emitted: number;
  amount_collected: number;
  amount_pending: number;
}

/** DTO para Gráficos de Línea/Área */
interface MonthlyTrendResponse {
  month: string;
  emitted: number;
  collected: number;
  pending: number;
}

/** Modelo de Tendencia */
class MonthlyTrend {
  constructor(
    public readonly month: string,
    public readonly emitted: number,
    public readonly collected: number,
    public readonly pending: number
  ) {}

  get collectionEfficiency(): number {
    return this.emitted > 0 ? (this.collected / this.emitted) * 100 : 0;
  }
}
```

---

### 6. Auditoría de Riesgo y Cartera Vencida (Ranking de Morosos)

- **Propósito de Negocio**: herramienta operativa para el departamento jurídico y de cobro coactivo. Clasifica a los deudores según su nivel de incumplimiento (Salud Financiera).
- **Uso en Frontend**: Grillas de gestión operativa con acciones de contacto (Email/SMS).

```sql
SELECT
    c.CED_IDENT_CIUDADANO AS card_id,
    c.NOMBRES_CIUDADANO + ' ' + c.APELLIDOS_CIUDADANO AS full_name,
    di.clave_catastral AS cadastral_key,
    COUNT(CASE WHEN di.estado_pago = 0 AND di.fecha_vencimiento < GETDATE() THEN 1 END) AS overdue_installments,
    SUM(CASE WHEN di.estado_pago = 0 THEN (di.valor_capital + di.valor_interes + di.valor_recargo) ELSE 0 END) AS total_debt,
    MAX(di.fecha_vencimiento) AS last_due_date,
    CASE
        WHEN COUNT(CASE WHEN di.estado_pago = 0 AND di.fecha_vencimiento < GETDATE() THEN 1 END) >= 3 THEN 'CRÍTICO'
        WHEN COUNT(CASE WHEN di.estado_pago = 0 AND di.fecha_vencimiento < GETDATE() THEN 1 END) > 0 THEN 'RIDGIDO'
        ELSE 'AL DÍA'
    END AS risk_level
FROM Datos_Ingreso_Convenio di
INNER JOIN CIUDADANO c ON c.CED_IDENT_CIUDADANO = di.ciudadano_id
GROUP BY c.CED_IDENT_CIUDADANO, c.NOMBRES_CIUDADANO, c.APELLIDOS_CIUDADANO, di.clave_catastral
HAVING SUM(CASE WHEN di.estado_pago = 0 THEN 1 ELSE 0 END) > 0
ORDER BY overdue_installments DESC, total_debt DESC;
```

- **Definiciones Técnicas**

```typescript
/** Resultado directo del SQL */
interface DelinquencyReportSqlResult {
  card_id: string;
  full_name: string;
  cadastral_key: string;
  overdue_installments: number;
  total_debt: number;
  last_due_date: string;
  risk_level: string;
}

type RiskLevel = 'CRÍTICO' | 'RIDGIDO' | 'AL DÍA';

/** DTO para Grilla de Riesgo */
interface DelinquencyReportResponse {
  citizenCard: string;
  fullName: string;
  propertyKey: string;
  overdueCount: number;
  totalDebt: number;
  lastDueDate: string;
  riskLevel: RiskLevel;
}

/** Modelo de Deudores */
class DelinquencyReport {
  constructor(
    public readonly citizenCard: string,
    public readonly fullName: string,
    public readonly propertyKey: string,
    public readonly overdueCount: number,
    public readonly totalDebt: number,
    public readonly lastDueDate: string,
    public readonly riskLevel: RiskLevel
  ) {}

  get requiresLegalAction(): boolean {
    return this.riskLevel === 'CRÍTICO';
  }

  get daysSinceLastOverdue(): number {
    const lastDate = new Date(this.lastDueDate);
    return Math.floor(
      (new Date().getTime() - lastDate.getTime()) / (1000 * 3600 * 24)
    );
  }
}
```

---

### 7. Productividad y Análisis de Gestión de Caja (Recaudadores)

- **Propósito de Negocio**: Monitoreo del desempeño de los cajeros y puntos de recaudación físicos en relación a los convenios procesados.
- **Uso en Frontend**: Dashboard administrativo de talento humano/recaudación.

```sql
SET NOCOUNT ON;

DECLARE @Date_Start DATETIME
DECLARE @Date_End DATETIME

SET @Date_Start = CONVERT(DATETIME, '2026-01-01 00:00:00', 120)
SET @Date_End = CONVERT(DATETIME, '2026-04-15 23:59:59', 120)

SELECT
    ISNULL(usuario_cobro, 'SISTEMA/AUTO') AS collector,
    COUNT(*) AS total_items,
    SUM(valor_capital + valor_interes + valor_recargo) AS total_collected
FROM Datos_Ingreso_Convenio
WHERE estado_pago = 1
AND fecha_pago BETWEEN @Date_Start AND @Date_End
GROUP BY usuario_cobro
ORDER BY total_collected DESC;
```

- **Definiciones Técnicas**

```typescript
/** Resultado directo del SQL */
interface CollectorPerformanceSqlResult {
  collector: string;
  total_items: number;
  total_collected: number;
}

/** DTO para Reporte de Gestión */
interface CollectorPerformanceResponse {
  collector: string;
  count: number;
  totalCollected: number;
}

/** Modelo de Desempeño */
class CollectorPerformance {
  constructor(
    public readonly collector: string,
    public readonly count: number,
    public readonly totalCollected: number
  ) {}

  get averageAmountPerTicket(): number {
    return this.count > 0 ? this.totalCollected / this.count : 0;
  }
}
```

---

### 8. Proyección de Recaudación Futura (Rolling Forecast)

- **Propósito de Negocio**: **(NUEVA CONSULTA PROFESIONAL)** Permite a la tesorería proyectar los flujos de caja para los próximos 6 meses basándose en las cuotas por vencer.
- **Uso en Frontend**: Gráficos de proyección de ingresos estacionales.

```sql
SET NOCOUNT ON;

SELECT
    CONVERT(VARCHAR(7), fecha_vencimiento, 126) AS projection_month,
    COUNT(*) AS expected_installments,
    SUM(valor_capital + valor_interes + valor_recargo) AS projected_revenue
FROM Datos_Ingreso_Convenio
WHERE estado_pago = 0
AND fecha_vencimiento BETWEEN GETDATE() AND DATEADD(MONTH, 6, GETDATE())
GROUP BY CONVERT(VARCHAR(7), fecha_vencimiento, 126)
ORDER BY projection_month ASC;
```

- **Definiciones Técnicas**

```typescript
/** Resultado directo del SQL */
interface RevenueProjectionSqlResult {
  projection_month: string;
  expected_installments: number;
  projected_revenue: number;
}

/** DTO para Gráficos de Proyección */
interface RevenueProjectionResponse {
  projectionMonth: string;
  expectedInstallments: number;
  projectedRevenue: number;
}

/** Modelo de Proyección */
class RevenueProjection {
  constructor(
    public readonly projectionMonth: string,
    public readonly expectedInstallments: number,
    public readonly projectedRevenue: number
  ) {}

  get dailyAverageExpected(): number {
    return this.projectedRevenue / 30;
  }
}
```

---

### 9. Análisis de Cumplimiento por Tipo de Convenio (Scorecard)

- **Propósito de Negocio**: **(NUEVA CONSULTA PROFESIONAL)** Analiza si el ciudadano cumple más en los convenios de pocos meses vs los de largo plazo. Ayuda a definir políticas de plazos máximos.
- **Uso en Frontend**: Reporte de analítica predictiva de políticas de convenios.

```sql
SELECT
    n_cuotas AS agreement_term,
    COUNT(DISTINCT ciudadano_id) AS total_citizens,
    CAST(AVG(CASE WHEN estado_pago = 1 THEN 1.0 ELSE 0.0 END * 100) AS DECIMAL(10,2)) AS default_compliance_rate
FROM Datos_Ingreso_Convenio
GROUP BY n_cuotas
HAVING COUNT(*) > 5 -- Filtro de relevancia estadística
ORDER BY agreement_term ASC;
```

- **Definiciones Técnicas**

```typescript
/** Resultado directo del SQL */
interface TermComplianceSqlResult {
  agreement_term: number;
  total_citizens: number;
  default_compliance_rate: number;
}

/** DTO para Gráficos de Análisis */
interface TermComplianceResponse {
  agreementTerm: number;
  totalCitizens: number;
  defaultComplianceRate: number;
}

/** Modelo de Análisis */
class TermCompliance {
  constructor(
    public readonly agreementTerm: number,
    public readonly totalCitizens: number,
    public readonly defaultComplianceRate: number
  ) {}

  get riskFactor(): number {
    return 100 - this.defaultComplianceRate;
  }
}
```

---

### 10. Análisis de Composición Financiera por Método de Pago

- **Propósito de Negocio**: Determina el peso porcentual de cada medio de pago sobre la recaudación efectiva. Es crucial para negociaciones de comisiones bancarias y optimización de flujo de efectivo.
- **Uso en Frontend**: Gráficos de pie detallados con etiquetas de porcentaje y montos monetarios.

```sql
SET NOCOUNT ON;

DECLARE @Date_Start DATETIME
DECLARE @Date_End DATETIME

SET @Date_Start = CONVERT(DATETIME, '2020-01-01 00:00:00', 120)
SET @Date_End = CONVERT(DATETIME, '2026-04-15 23:59:59', 120)

DECLARE @Total_Global DECIMAL(18,4)

-- 1. Calculamos el total global primero
SELECT @Total_Global = SUM(valor_capital + valor_interes + valor_recargo)
FROM Datos_Ingreso_Convenio
WHERE estado_pago = 1
AND fecha_pago BETWEEN @Date_Start AND @Date_End;

-- 2. Ejecutamos la consulta principal usando la variable
SELECT
    ISNULL(forma_de_pago, 'OTRO') AS payment_method,
    SUM(valor_capital + valor_interes + valor_recargo) AS method_total,
    CASE
        WHEN @Total_Global = 0 THEN 0
        ELSE CAST(SUM(valor_capital + valor_interes + valor_recargo) * 100.0 / @Total_Global AS DECIMAL(10,2))
    END AS contribution_pct
FROM Datos_Ingreso_Convenio
WHERE estado_pago = 1
--AND fecha_pago BETWEEN @Date_Start AND @Date_End
GROUP BY forma_de_pago
ORDER BY 3 DESC;
```

- **Definiciones Técnicas**

```typescript
/** Resultado directo del SQL */
interface PaymentMethodCompositionSqlResult {
  payment_method: string;
  method_total: number;
  contribution_pct: number;
}

/** DTO para la API */
interface PaymentMethodCompositionResponse {
  paymentMethod: string;
  methodTotal: number;
  contributionPct: number;
}

/** Modelo de Dominio */
class PaymentMethodComposition {
  constructor(
    public readonly paymentMethod: string,
    public readonly methodTotal: number,
    public readonly contributionPct: number
  ) {}

  get isElectronic(): boolean {
    const electronic = ['TRANSFERENCIA', 'TARJETA', 'TRANSBANPI'];
    return electronic.includes(this.paymentMethod.toUpperCase());
  }
}
```

---

### 11. Análisis de Rendimiento y Participación por Recaudador

- **Propósito de Negocio**: Identifica el aporte relativo de cada cajero o usuario de cobro al total recolectado. Permite establecer metas de gestión y evaluar la carga transaccional por usuario.
- **Uso en Frontend**: Rankings de eficiencia y gráficos de donuts de participación de ingresos.

```sql
SET NOCOUNT ON;

DECLARE @Date_Start DATETIME
DECLARE @Date_End DATETIME

SET @Date_Start = CONVERT(DATETIME, '2026-01-01 00:00:00', 120)
SET @Date_End = CONVERT(DATETIME, '2026-04-15 23:59:59', 120)

DECLARE @Total_Global DECIMAL(18,4)

-- 1. Calculamos el total global primero
SELECT @Total_Global = SUM(valor_capital + valor_interes + valor_recargo)
FROM Datos_Ingreso_Convenio
WHERE estado_pago = 1
AND fecha_pago BETWEEN @Date_Start AND @Date_End;

-- 2. Ejecutamos la consulta principal usando la variable
SELECT
    ISNULL(usuario_cobro, 'OTRO') AS collector,
    SUM(valor_capital + valor_interes + valor_recargo) AS collector_total,
    CASE
        WHEN @Total_Global = 0 THEN 0
        ELSE CAST(SUM(valor_capital + valor_interes + valor_recargo) * 100.0 / @Total_Global AS DECIMAL(10,2))
    END AS performance_pct
FROM Datos_Ingreso_Convenio
WHERE estado_pago = 1
AND fecha_pago BETWEEN @Date_Start AND @Date_End
GROUP BY usuario_cobro
ORDER BY 3 DESC;
```

- **Definiciones Técnicas**

```typescript
/** Resultado directo del SQL */
interface CollectorPerformanceShareSqlResult {
  collector: string;
  collector_total: number;
  performance_pct: number;
}

/** DTO para la API */
interface CollectorPerformanceShareResponse {
  collector: string;
  collectorTotal: number;
  performancePct: number;
}

/** Modelo de Dominio */
class CollectorPerformanceShare {
  constructor(
    public readonly collector: string,
    public readonly collectorTotal: number,
    public readonly performancePct: number
  ) {}
}
```
