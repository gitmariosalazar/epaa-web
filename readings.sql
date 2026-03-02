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