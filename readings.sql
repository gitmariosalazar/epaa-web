SELECT
    l.lectura_id AS reading_id,
    l.fecha_lectura AS reading_date,
    ac.acometida_id AS cadastral_key,
    ac.numero_medidor AS meter_number,
    ac.direccion AS address,
    ac.sector,
    ac.cuenta AS account,
    COALESCE(ci.nombres || ' ' || ci.apellidos, COALESCE(e.razon_social, e.nombre_comercial)) AS client_name,
    c.cliente_id AS card_id,
    l.lectura_anterior AS previous_reading,
    l.lectura_actual AS current_reading,
    l.valor_lectura AS reading_value,
    coalesce(l.lectura_actual - l.lectura_anterior,0) AS calculated_consumption,
    cp.average_consumption AS average_consumption,
    ct.nombre AS rate_name,
    l.tipo_novedad_lectura_id AS reading_type,
    tnl.nombre as reading_type_name,
    l.novedad AS novelty
FROM lectura l
    INNER JOIN acometida ac ON ac.acometida_id = l.acometida_id
    LEFT JOIN cliente c ON ac.cliente_id = c.cliente_id
    LEFT JOIN ciudadano ci ON ci.ciudadano_id = c.cliente_id
    LEFT JOIN empresa e ON e.ruc = c.cliente_id
    LEFT JOIN tarifa t ON t.tarifa_id = ac.tarifa_id
    LEFT JOIN categoria ct ON t.categoria_id = ct.categoria_id
    LEFT JOIN consumo_promedio cp ON cp.acometida_id = ac.acometida_id
    LEFT JOIN public.tipo_novedad_lectura tnl on tnl.tipo_novedad_lectura_id = l.tipo_novedad_lectura_id
WHERE l.mes_lectura = '2026-02'
ORDER BY l.fecha_lectura DESC;


-- 1. CONFIGURACIÓN DE PARÁMETROS (Ajusta las fechas según necesites)
DECLARE @Date_Start     DATETIME
DECLARE @Date_End       DATETIME
DECLARE @Service_Order  INT

SET @Date_Start    = '2026-04-01 00:00:00' -- Cambia por tu fecha de inicio
SET @Date_End      = '2026-04-15 23:59:59' -- Cambia por tu fecha de fin
SET @Service_Order = 10                    -- Orden 10 es Tasa de Basura

-- 2. CONSULTA DETALLADA DE INTEGRITY GAP
SELECT
    di.Cod_Ingreso      AS income_code,
    di.ClaveCatastral   AS cadastral_key,
    di.CodCliente_Ingreso AS client_code,
    di.nombre           AS client_name,
    di.Fecha_Ingreso    AS income_date,
    di.Fecha_Pago       AS payment_date,
    di.Estado_Ingreso   AS income_status,
    di.tasa_basura      AS trash_rate_value_income,
    ISNULL(V.Valor, 0)  AS trash_rate_value_table,  
    (ISNULL(di.tasa_basura, 0) - ISNULL(V.Valor, 0)) AS integrity_gap_indivual,
    CASE
        WHEN V.cod_Ingreso IS NULL THEN 'SIN RECORD EN TABLA VALOR (KPI ALTO)'
        WHEN ABS(di.tasa_basura - V.Valor) > 0.01 THEN 'DIFERENCIA DE VALORES'
        ELSE 'OK'
    END AS diagnosis
FROM dbo.Datos_ingreso di
LEFT JOIN dbo.Valor V
    ON di.Cod_Ingreso = V.cod_Ingreso
    AND V.orden = @Service_Order
WHERE di.tasa_basura IS NOT NULL
  AND (
      -- Filtro global (Emitidos o Pagados en el rango)
      (di.Fecha_Ingreso >= @Date_Start AND di.Fecha_Ingreso <= @Date_End)
      OR
      (di.Fecha_Pago >= @Date_Start AND di.Fecha_Pago <= @Date_End)
  )
  -- Solo mostramos los que tienen GAP para que analices el error
  AND ABS(ISNULL(di.tasa_basura, 0) - ISNULL(V.Valor, 0)) > 0.01
ORDER BY integrity_gap_indivual DESC;






SET NOCOUNT ON;
DECLARE @Date_Start DATETIME
DECLARE @Date_End   DATETIME
DECLARE @Service_Order INT

SET @Date_Start = '2026-04-01 00:00:00'
SET @Date_End   = '2026-04-15 23:59:59'
SET @Service_Order = 10

SELECT
    di.Cod_Ingreso                                          AS income_code,
    di.ClaveCatastral                                       AS cadastral_key,
    di.CodCliente_Ingreso                                   AS card_id,
    di.nombre                                               AS customer_name,
    CONVERT(VARCHAR(10), di.Fecha_Ingreso, 120)             AS issue_date,
    CONVERT(VARCHAR(10), di.Fecha_Pago, 120)                AS payment_date,
    di.tasa_basura                                          AS trash_rate,
    di.Estado_Ingreso                                       AS payment_status_code,
    CASE
        WHEN di.Fecha_Pago IS NULL THEN 'PENDING'
        ELSE 'PAID'
    END                                                     AS payment_status,
    V.orden                                                 AS valor_order,
    di.tasa_basura                                          AS rate_in_income,
    ISNULL(V.Valor, 0)                                      AS rate_in_valor_table,
    (ISNULL(di.tasa_basura, 0) - ISNULL(V.Valor, 0))        AS integrity_gap_indivual,
    CASE
        WHEN V.cod_Ingreso IS NULL THEN 'MISSING: No record in Valor Table (KPI ALTO)'
        WHEN ABS(di.tasa_basura - V.Valor) > 0.01 THEN 'DISCREPANCY: Different Values - Review'
        WHEN di.tasa_basura IS NULL THEN 'MISSING: No record in Income Table (KPI ALTO)'
        ELSE 'OK'
    END AS final_diagnosis
FROM Datos_ingreso di
LEFT JOIN dbo.Valor V
    ON di.Cod_Ingreso = V.cod_Ingreso
    AND V.orden = @Service_Order
WHERE (
      (di.Fecha_Ingreso >= @Date_Start AND di.Fecha_Ingreso <= @Date_End)
      OR
      (di.Fecha_Pago >= @Date_Start AND di.Fecha_Pago <= @Date_End)
  )
  AND (
      V.cod_Ingreso IS NULL
      OR
      ABS(ISNULL(di.tasa_basura, 0) - ISNULL(V.Valor, 0)) > 0.01
  )
ORDER BY integrity_gap_indivual DESC, di.Fecha_Pago DESC;


/*
Datos Ingreso Convenio
*/
-- Consultar Datos Ingreso Convenio General Individual
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
