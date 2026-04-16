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