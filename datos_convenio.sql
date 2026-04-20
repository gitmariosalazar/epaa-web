/*
Tabla Datos Ingreso Convenio
id	n_cuotas	cuota	detalle	valor_capital	valor_interes	valor_recargo	fecha_emision	fecha_vencimiento	fecha_pago	estado_pago	usuario_creacion	usuario_cobro	numero_titulo	forma_de_pago	facturado	secuencial	ciudadano_id	facturar	clave_catastral
65,962	6	1	Cuota 1	16.63	0.38	3	2026-04-16 08:36:43.000	2026-05-16 08:36:43.000	[NULL]	0	andrader	[NULL]	[NULL]	[NULL]	0	[NULL]	1002791034	0	33-263
65,963	6	2	Cuota 2	16.63	0.38	3	2026-04-16 08:36:43.000	2026-06-16 08:36:43.000	[NULL]	0	andrader	[NULL]	[NULL]	[NULL]	0	[NULL]	1002791034	0	33-263
65,964	6	3	Cuota 3	16.63	0.38	3	2026-04-16 08:36:43.000	2026-07-16 08:36:43.000	[NULL]	0	andrader	[NULL]	[NULL]	[NULL]	0	[NULL]	1002791034	0	33-263
65,965	6	4	Cuota 4	16.63	0.38	3	2026-04-16 08:36:43.000	2026-08-16 08:36:43.000	[NULL]	0	andrader	[NULL]	[NULL]	[NULL]	0	[NULL]	1002791034	0	33-263
65,966	6	5	Cuota 5	16.63	0.38	3	2026-04-16 08:36:43.000	2026-09-16 08:36:43.000	[NULL]	0	andrader	[NULL]	[NULL]	[NULL]	0	[NULL]	1002791034	0	33-263
65,960	3	3	Cuota 3	40.42	1.4	7.22	2026-04-15 11:54:46.000	2026-07-15 11:54:46.000	[NULL]	0	erazod	[NULL]	[NULL]	[NULL]	0	[NULL]	1002631040	0	31-398
65,957	3	0	Abono	79.11	2.74	14.11	2026-04-15 11:54:45.000	2026-04-15 11:54:45.000	2026-04-15 12:04:45.000	1	erazod	artiedac	253,013	Efectivo	0	[NULL]	1002631040	0	31-398
65,958	3	1	Cuota 1	40.42	1.4	7.21	2026-04-15 11:54:45.000	2026-05-15 11:54:45.000	[NULL]	0	erazod	[NULL]	[NULL]	[NULL]	0	[NULL]	1002631040	0	31-398
65,959	3	2	Cuota 2	40.42	1.4	7.21	2026-04-15 11:54:45.000	2026-06-15 11:54:45.000	[NULL]	0	erazod	[NULL]	[NULL]	[NULL]	0	[NULL]	1002631040	0	31-398
65,956	3	3	Cuota 3	85.77	4.44	45.06	2026-04-15 10:43:30.000	2026-07-15 10:43:30.000	[NULL]	0	lopezl	[NULL]	[NULL]	[NULL]	0	[NULL]	0400061628	0	[NULL]
65,955	3	2	Cuota 2	85.77	4.44	45.07	2026-04-15 10:43:29.000	2026-06-15 10:43:29.000	[NULL]	0	lopezl	[NULL]	[NULL]	[NULL]	0	[NULL]	0400061628	0	[NULL]
65,954	3	1	Cuota 1	85.77	4.44	45.07	2026-04-15 10:43:28.000	2026-05-15 10:43:28.000	[NULL]	0	lopezl	[NULL]	[NULL]	[NULL]	0	[NULL]	0400061628	0	[NULL]
*/
-- Consultar Datos Ingreso Convenio General Individual

SET NOCOUNT ON;


DECLARE @Date_Start DATETIME
DECLARE @Date_End   DATETIME

SET @Date_Start = CONVERT(DATETIME, '2026-01-01 00:00:00', 120)
SET @Date_End   = CONVERT(DATETIME, '2026-04-15 23:59:59', 120)

SELECT
    di.id                       AS income_id,
    di.clave_catastral          AS cadastral_key,
    c.CED_IDENT_CIUDADANO       AS card_id,
    c.NOMBRES_CIUDADANO         AS first_name,
    c.APELLIDOS_CIUDADANO       AS last_name,
    di.fecha_emision            AS issue_date,
    di.fecha_vencimiento        AS due_date,
    di.fecha_pago               AS payment_date,
    di.estado_pago              AS payment_status,
    di.usuario_cobro            AS collected_by,
    di.forma_de_pago            AS payment_method,
    di.valor_capital            AS principal_value,
    di.valor_interes            AS interest_value,
    di.valor_recargo            AS penalty_value,
    di.detalle                  AS details,
    di.n_cuotas                 AS total_installments,
    di.cuota                    AS current_installment
FROM Datos_Ingreso_Convenio di
INNER JOIN CIUDADANO c
    ON c.CED_IDENT_CIUDADANO = di.ciudadano_id
WHERE di.fecha_emision >= @Date_Start AND di.fecha_emision <= @Date_End
ORDER BY di.fecha_emision DESC ;


/*
    Consultar Datos Ingreso Convenio Agrupado por Cliente
forma_de_pago
TransBanPI
Tarjeta
Transferencia
Cheque

Efectivo
NotaDeCredito

*/
SET NOCOUNT ON;

DECLARE @Date_Start DATETIME
DECLARE @Date_End   DATETIME

SET @Date_Start = CONVERT(DATETIME, '2026-01-01 00:00:00', 120)
SET @Date_End   = CONVERT(DATETIME, '2026-04-15 23:59:59', 120)

SELECT
    di.clave_catastral          AS cadastral_key,
    c.CED_IDENT_CIUDADANO       AS card_id,
    c.NOMBRES_CIUDADANO         AS first_name,
    c.APELLIDOS_CIUDADANO       AS last_name,
    COUNT(di.id)                AS total_incomes,
    SUM(di.valor_capital)       AS total_principal_value,
    SUM(di.valor_interes)       AS total_interest_value,
    SUM(di.valor_recargo)       AS total_surcharge_value,
    SUM(di.valor_capital + di.valor_interes + di.valor_recargo) AS total_amount_value,
    -- Contar por estado de pago
    COUNT(CASE WHEN di.estado_pago = 0 THEN 1 END) AS pending_incomes,
    COUNT(CASE WHEN di.estado_pago = 1 THEN 1 END) AS paid_incomes,
    -- Contar por forma de pago
    COUNT(CASE WHEN di.forma_de_pago = 'TransBanPI' THEN 1 END) AS transbanpi_incomes,
    COUNT(CASE WHEN di.forma_de_pago = 'Tarjeta' THEN 1 END) AS card_incomes,
    COUNT(CASE WHEN di.forma_de_pago = 'Transferencia' THEN 1 END) AS transfer_incomes,
    COUNT(CASE WHEN di.forma_de_pago = 'Cheque' THEN 1 END) AS check_incomes,
    COUNT(CASE WHEN di.forma_de_pago = 'Efectivo' THEN 1 END) AS cash_incomes,
    COUNT(CASE WHEN di.forma_de_pago = 'NotaDeCredito' THEN 1 END) AS credit_note_incomes,
    COUNT(CASE WHEN di.forma_de_pago IS NULL THEN 1 END) AS null_incomes
FROM Datos_Ingreso_Convenio di
INNER JOIN CIUDADANO c
    ON c.CED_IDENT_CIUDADANO = di.ciudadano_id
WHERE di.fecha_emision >= @Date_Start AND di.fecha_emision <= @Date_End
GROUP BY c.CED_IDENT_CIUDADANO,
         di.clave_catastral, c.CED_IDENT_CIUDADANO, c.NOMBRES_CIUDADANO, c.APELLIDOS_CIUDADANO
ORDER BY c.CED_IDENT_CIUDADANO DESC ;




/*******************************************************************************
 * SISTEMA DE GESTIÓN DE CONVENIOS - CONSULTAS PARA DASHBOARDS Y BACKEND
 *******************************************************************************/

-- 1. DASHBOARD OVERVIEW: KPIs Principales
-- Propósito: Alimentar la fila superior del dashboard con los números globales.

SET NOCOUNT ON;

DECLARE @Date_Start DATETIME
DECLARE @Date_End   DATETIME

SET @Date_Start = CONVERT(DATETIME, '2026-01-01 00:00:00', 120)
SET @Date_End   = CONVERT(DATETIME, '2026-04-15 23:59:59', 120)

SELECT 
    -- Totales Financieros
    SUM(valor_capital + valor_interes + valor_recargo) AS total_emitted,
    SUM(CASE WHEN estado_pago = 1 THEN (valor_capital + valor_interes + valor_recargo) ELSE 0 END) AS total_collected,
    SUM(CASE WHEN estado_pago = 0 THEN (valor_capital + valor_interes + valor_recargo) ELSE 0 END) AS total_pending,
    
    -- Desglose por Concepto
    SUM(valor_capital) AS total_principal,
    SUM(valor_interes) AS total_interest,
    SUM(valor_recargo) AS total_surcharge,
    
    -- Eficacia y Estado
    CAST(SUM(CASE WHEN estado_pago = 1 THEN 1.0 ELSE 0 END) / COUNT(*) * 100 AS DECIMAL(10,2)) AS collection_efficiency_pct,
    COUNT(DISTINCT ciudadano_id) AS total_citizens_with_agreements,
    COUNT(*) AS total_installments_count,
    
    -- Alerta de Morosidad
    SUM(CASE WHEN estado_pago = 0 AND fecha_vencimiento < GETDATE() THEN 1 ELSE 0 END) AS overdue_installments_count,
    SUM(CASE WHEN estado_pago = 0 AND fecha_vencimiento < GETDATE() THEN (valor_capital + valor_interes + valor_recargo) ELSE 0 END) AS overdue_amount
FROM Datos_Ingreso_Convenio
WHERE fecha_emision BETWEEN @Date_Start AND @Date_End;


-- 2. DISTRIBUCIÓN POR FORMA DE PAGO (Donut Chart)
-- Propósito: Entender la preferencia de pago de los ciudadanos.
SET NOCOUNT ON;

DECLARE @Date_Start DATETIME
DECLARE @Date_End   DATETIME

SET @Date_Start = CONVERT(DATETIME, '2026-01-01 00:00:00', 120)
SET @Date_End   = CONVERT(DATETIME, '2026-04-15 23:59:59', 120)

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


-- 3. TENDENCIA MENSUAL DE RECAUDACIÓN (Area/Line Chart)
-- Propósito: Visualizar el flujo de dinero mes a mes.
SET NOCOUNT ON;

DECLARE @Date_Start DATETIME;
DECLARE @Date_End   DATETIME;

-- Usamos un rango de 12 meses hacia atrás desde hoy
SET @Date_Start = DATEADD(MONTH, -12, GETDATE());
SET @Date_End   = GETDATE();

SELECT 
    -- Genera formato YYYY-MM compatible con SQL Server 2008+
    CONVERT(VARCHAR(7), fecha_emision, 126) AS month_key,
    
    -- Suma total emitida
    SUM(valor_capital + valor_interes + valor_recargo) AS amount_emitted,
    
    -- Suma total recaudada (Solo donde estado_pago = 1)
    SUM(CASE 
            WHEN estado_pago = 1 THEN (valor_capital + valor_interes + valor_recargo) 
            ELSE 0 
        END) AS amount_collected,
        
    -- Extra: Diferencia (Cartera vencida/pendiente)
    SUM(CASE 
            WHEN estado_pago = 0 THEN (valor_capital + valor_interes + valor_recargo) 
            ELSE 0 
        END) AS amount_pending
FROM Datos_Ingreso_Convenio
WHERE fecha_emision >= @Date_Start AND fecha_emision <= @Date_End
GROUP BY CONVERT(VARCHAR(7), fecha_emision, 126)
ORDER BY month_key;


-- 4. REPORTE DE MOROSIDAD Y RIESGO (Auditoría)
-- Propósito: Identificar ciudadanos que no están cumpliendo su compromiso.
SET NOCOUNT ON;

DECLARE @Date_Start DATETIME;
DECLARE @Date_End   DATETIME;

SET @Date_Start = CONVERT(DATETIME, '2026-01-01 00:00:00', 120)
SET @Date_End   = CONVERT(DATETIME, '2026-04-15 23:59:59', 120)

SELECT
    c.CED_IDENT_CIUDADANO AS card_id,
    c.NOMBRES_CIUDADANO + ' ' + c.APELLIDOS_CIUDADANO AS full_name,
    di.clave_catastral AS cadastral_key,
    COUNT(CASE WHEN di.estado_pago = 0 AND di.fecha_vencimiento < GETDATE() THEN 1 END) AS overdue_installments,
    SUM(CASE WHEN di.estado_pago = 0 THEN (di.valor_capital + di.valor_interes + di.valor_recargo) ELSE 0 END) AS total_debt,
    MAX(di.fecha_vencimiento) AS last_due_date,
    CASE 
        WHEN COUNT(CASE WHEN di.estado_pago = 0 AND di.fecha_vencimiento < GETDATE() THEN 1 END) >= 3 THEN 'CRÍTICO'
        WHEN COUNT(CASE WHEN di.estado_pago = 0 AND di.fecha_vencimiento < GETDATE() THEN 1 END) > 0 THEN 'EN RIESGO'
        ELSE 'AL DÍA'
    END AS financial_health_status
FROM Datos_Ingreso_Convenio di
INNER JOIN CIUDADANO c ON c.CED_IDENT_CIUDADANO = di.ciudadano_id
GROUP BY c.CED_IDENT_CIUDADANO, c.NOMBRES_CIUDADANO, c.APELLIDOS_CIUDADANO, di.clave_catastral
HAVING SUM(CASE WHEN di.estado_pago = 0 THEN 1 ELSE 0 END) > 0 -- Solo deudores
ORDER BY overdue_installments DESC, total_debt DESC;


-- 5. DETALLE DE INSTALMENTOS POR CIUDADANO (Para Expandible en Frontend)
-- Propósito: Mostrar el plan de pagos detallado de un convenio específico.

SET NOCOUNT ON;

DECLARE @Selected_Citizen_ID VARCHAR(20);
DECLARE @Selected_Cadastral_Key VARCHAR(20)

SET @Selected_Citizen_ID = '1002631040'
SET @Selected_Cadastral_Key = ''

SELECT 
    cuota AS installment_number,
    detalle AS description,
    valor_capital AS principal,
    valor_interes AS interest,
    valor_recargo AS surcharge,
    forma_de_pago AS payment_method,
    (valor_capital + valor_interes + valor_recargo) AS total_to_pay,
    fecha_vencimiento AS due_date,
    fecha_pago AS payment_date,
    CASE 
        WHEN estado_pago = 1 THEN 'PAGADO'
        WHEN fecha_vencimiento < GETDATE() THEN 'VENCIDO'
        ELSE 'PENDIENTE'
    END AS status_display,
    usuario_creacion AS created_by,
    usuario_cobro AS collected_by
FROM Datos_Ingreso_Convenio
WHERE ciudadano_id = @Selected_Citizen_ID 
   OR clave_catastral = @Selected_Cadastral_Key
ORDER BY cuota ASC;


-- 6. PRODUCTIVIDAD POR CAJERO / USUARIO
-- Propósito: Reporte de gestión para administración.

SET NOCOUNT ON;

DECLARE @Date_Start DATETIME;
DECLARE @Date_End   DATETIME;

SET @Date_Start = CONVERT(DATETIME, '2026-01-01 00:00:00', 120)
SET @Date_End   = CONVERT(DATETIME, '2026-04-15 23:59:59', 120)

SELECT 
    ISNULL(usuario_cobro, 'SIN COBRO') AS collector_user,
    COUNT(*) AS total_collected_items,
    SUM(valor_capital) AS total_principal,
    SUM(valor_interes) AS total_interest,
    SUM(valor_recargo) AS total_surcharge,
    SUM(valor_capital + valor_interes + valor_recargo) AS total_amount_collected
FROM Datos_Ingreso_Convenio
WHERE estado_pago = 1 
  AND fecha_pago BETWEEN @Date_Start AND @Date_End
GROUP BY usuario_cobro
ORDER BY total_amount_collected DESC;


-- 7. PRODUCTIVIDAD POR CAJERO / USUARIO por dia
-- Propósito: Reporte de gestión para administración.

SET NOCOUNT ON;

DECLARE @Date_Start DATETIME;
DECLARE @Date_End   DATETIME;

SET @Date_Start = CONVERT(DATETIME, '2026-01-01 00:00:00', 120)
SET @Date_End   = CONVERT(DATETIME, '2026-04-15 23:59:59', 120)

SELECT 
    CONVERT(VARCHAR(10), fecha_pago, 120) AS payment_date,
    ISNULL(usuario_cobro, 'SIN COBRO') AS collector_user,
    COUNT(*) AS total_collected_items,
    SUM(valor_capital) AS total_principal,
    SUM(valor_interes) AS total_interest,
    SUM(valor_recargo) AS total_surcharge,
    SUM(valor_capital + valor_interes + valor_recargo) AS total_amount_collected
FROM Datos_Ingreso_Convenio
WHERE estado_pago = 1 
  AND fecha_pago BETWEEN @Date_Start AND @Date_End
GROUP BY usuario_cobro, fecha_pago
ORDER BY total_amount_collected DESC;




--//////////////////
SET NOCOUNT ON;

DECLARE @SearchType VARCHAR(10)
SET  @SearchType = 'YEAR'
DECLARE @startDate DATETIME;
SET @startDate = CONVERT(DATETIME, '2015-01-01 00:00:00.000', 120);
DECLARE @endDate DATETIME;
SET @endDate = CONVERT(DATETIME, '2026-12-31 23:59:59.997', 120);
DECLARE @startYear INTEGER;
SET @startYear = 2015;
DECLARE @endYear    INTEGER;
SET @endYear = 2026;

SELECT
    CASE
        WHEN @SearchType = 'YEAR' THEN YEAR(fecha_emision)
    END AS year,
    CASE
        WHEN @SearchType = 'MONTH' THEN MONTH(fecha_emision)
    END AS month,
    CASE
        WHEN @SearchType = 'DAY' THEN DAY(fecha_emision)
    END AS day,
    SUM(valor_capital + valor_interes + valor_recargo) AS total_emitted,
    SUM(CASE WHEN estado_pago = 1 THEN (valor_capital + valor_interes + valor_recargo) ELSE 0 END) AS total_collected,
    SUM(CASE WHEN estado_pago = 0 THEN (valor_capital + valor_interes + valor_recargo) ELSE 0 END) AS total_pending,
    SUM(valor_capital) AS total_principal,
    SUM(valor_interes) AS total_interest,
    SUM(valor_recargo) AS total_surcharge,
    CAST(SUM(CASE WHEN estado_pago = 1 THEN 1.0 ELSE 0 END) / COUNT(*) * 100 AS DECIMAL(10,2)) AS collection_efficiency_pct,
    COUNT(DISTINCT ciudadano_id) AS total_citizens_with_agreements,
    COUNT(*) AS total_installments_count,
    SUM(CASE WHEN estado_pago = 0 AND fecha_vencimiento < GETDATE() THEN 1 ELSE 0 END) AS overdue_installments_count,
    SUM(CASE WHEN estado_pago = 0 AND fecha_vencimiento < GETDATE() THEN (valor_capital + valor_interes + valor_recargo) ELSE 0 END) AS overdue_amount
FROM Datos_Ingreso_Convenio
WHERE fecha_emision BETWEEN @startDate AND @endDate
GROUP BY
    CASE
        WHEN @SearchType = 'YEAR' THEN YEAR(fecha_emision)
    END,
    CASE
        WHEN @SearchType = 'MONTH' THEN MONTH(fecha_emision)
    END,
    CASE
        WHEN @SearchType = 'DAY' THEN DAY(fecha_emision)
    END
ORDER BY year DESC;

--//////////////////
SET NOCOUNT ON;

DECLARE @SearchType VARCHAR(10);
DECLARE @StartDate DATETIME;
DECLARE @EndDate   DATETIME;
DECLARE @StartYear INT;
DECLARE @EndYear     INT;

SET @SearchType = 'YEAR';
SET @StartDate = '2015-01-01 00:00:00.000';
SET @EndDate   = '2026-12-31 23:59:59.997';


SELECT
    CASE
        WHEN @SearchType = 'YEAR' THEN YEAR(fecha_emision)
    END AS year,
    SUM(valor_capital + valor_interes + valor_recargo) AS total_emitted,
    SUM(CASE WHEN estado_pago = 1 THEN (valor_capital + valor_interes + valor_recargo) ELSE 0 END) AS total_collected,
    SUM(CASE WHEN estado_pago = 0 THEN (valor_capital + valor_interes + valor_recargo) ELSE 0 END) AS total_pending,
    SUM(valor_capital) AS total_principal,
    SUM(valor_interes) AS total_interest,
    SUM(valor_recargo) AS total_surcharge,
    CAST(SUM(CASE WHEN estado_pago = 1 THEN 1.0 ELSE 0 END) / COUNT(*) * 100 AS DECIMAL(10,2)) AS collection_efficiency_pct,
    COUNT(DISTINCT ciudadano_id) AS total_citizens_with_agreements,
    COUNT(*) AS total_installments_count,
    SUM(CASE WHEN estado_pago = 0 AND fecha_vencimiento < GETDATE() THEN 1 ELSE 0 END) AS overdue_installments_count,
    SUM(CASE WHEN estado_pago = 0 AND fecha_vencimiento < GETDATE() THEN (valor_capital + valor_interes + valor_recargo) ELSE 0 END) AS overdue_amount
FROM Datos_Ingreso_Convenio
WHERE fecha_emision BETWEEN @StartDate AND @EndDate
GROUP BY
    YEAR(fecha_emision)
ORDER BY year DESC;
