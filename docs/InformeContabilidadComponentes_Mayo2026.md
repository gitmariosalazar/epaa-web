# Reporte Técnico de Desarrollo: Arquitectura y Componentes del Módulo Accounting (Versión Final Auditada)

**Fecha:** 13 de Mayo de 2026  
**Proyecto:** SIGEPAA-AA  
**Enfoque:** Detalle de Ingeniería, Auditoría, Anexos y Evidencia de Interfaz (IU)

---

## 1. Introducción al Proceso de Desarrollo

El desarrollo del módulo de contabilidad (`accounting`) se ha regido por una filosofía de ingeniería de software que prioriza la robustez y la facilidad de mantenimiento. En lugar de construir pantallas aisladas, se ha creado un sistema de componentes interconectados que comparten una lógica común. Este informe detalla cómo se concibió, estructuró y desarrolló cada parte de este módulo, siguiendo estándares de calidad.

Antes de detallar cada componente, es pertinente mencionar que el desarrollo se basó en una arquitectura modularizada, implementando Clean Architecture, esto permite que cada componente sea reutilizable e independiente, facilitando el mantenimiento y la escalabilidad del sistema.

### Estructura de Archivos y Jerarquía

Para mantener el orden, se estableció la siguiente jerarquía de carpetas que sirve como guía para cualquier nuevo desarrollo:

- `src/modules/accounting/application/`: Lógica de orquestación (Casos de Uso).

Esta carpeta contiene los casos de uso del módulo de contabilidad, es decir, la lógica de negocio que se encarga de orquestar las operaciones que se pueden realizar en el módulo. Por ejemplo, un caso de uso podría ser el de obtener un resumen de la recaudación de convenios de pago, o el de obtener el detalle de los pagos realizados por los contribuyentes.

- `src/modules/accounting/domain/`: Reglas de negocio puras e interfaces.

Esta carpeta contiene las interfaces que definen los contratos entre las capas del módulo de contabilidad. Por ejemplo, una interfaz podría ser la de obtener un resumen de la recaudación de convenios de pago, o la de obtener el detalle de los pagos realizados por los contribuyentes.

- `src/modules/accounting/infrastructure/`: Comunicación con servidores y APIs.

Esta carpeta contiene la lógica de comunicación con los servidores y APIs que proporcionan los datos necesarios para el funcionamiento del módulo de contabilidad. Por ejemplo, una API podría ser la que proporciona un resumen de la recaudación de convenios de pago, o la que proporciona el detalle de los pagos realizados por los contribuyentes.

- `src/modules/accounting/presentation/`: Todo lo relacionado con la interfaz visual (Tablas, Dashboards).

Esta carpeta contiene todo lo relacionado con la interfaz visual del módulo de contabilidad, es decir, las tablas, los dashboards y los componentes de interfaz de usuario que se utilizan para mostrar los datos del módulo de contabilidad. Por ejemplo, una tabla podría ser la que muestra el resumen de la recaudación de convenios de pago, o la que muestra el detalle de los pagos realizados por los contribuyentes.

> Este anexo muestra una representación visual de la estructura de carpetas del módulo, el cual es estandarizado para todos los módulos del sistema aplicando Clean Architecture y un enfoque modular.

---

## 2. Metodología de Construcción por Capas

Se utilizó una organización por "niveles de responsabilidad" para asegurar que el sistema sea estable y escalable.

> Esta metodología se conoce como Clean Architecture, la cual es una arquitectura de software que se basa en el principio de separación de capas, permitiendo que cada capa sea independiente de las demás y que las dependencias fluyan desde el interior hacia el exterior. Esto permite que el código sea más fácil de mantener, probar y reutilizar.

### 2.1 El Nivel de Reglas (Dominio)

Definimos los moldes de datos (interfaces) para asegurar la integridad financiera del sistema, especialmente para el manejo de acometidas en mora.

**Ejemplo:**

```typescript
export interface OverdueSummary {
  totalDebtAmount: number;
  totalClientsWithDebt: number;
  avgDebtPerClient: number;
}
```

### Diccionario de Datos del Dominio

- **`OverdueReading`**: Estructura de datos que encapsula el estado financiero de una acometida en mora. Incluye el valor del consumo, tasas adicionales y recargos calculados dinámicamente según la antigüedad.
- **`YearlyOverdueSummary`**: Agrupación de alto nivel que permite el análisis plurianual de la morosidad. Proporciona métricas de comparación entre ejercicios fiscales para identificar tendencias de impago.
- **`MonthlyDebtSummary`**: Registro detallado que desglosa la deuda por periodos mensuales, permitiendo la trazabilidad exacta de los haberes pendientes desde el origen de la obligación.
- **`GeneralYearlyKPI`**: Interfaz de indicadores clave de desempeño que mide la salud financiera global de la institución a través de la recaudación por acometida.

> Este anexo muestra una representación visual del diccionario de datos del módulo, el cual es estandarizado para todos los módulos del sistema aplicando Clean Architecture y un enfoque modular.

---

## 3. Desarrollo del Submódulo de Convenios de Pago (`agreements`)

El objetivo de este submódulo fue facilitar la gestión de los **Convenios de Pago** para aquellas **acometidas** que presentan valores pendientes. El sistema permite regularizar la situación de las acometidas mediante planes estructurados de cuotas.

### 3.1 AgreementsAnuallySummaryTable

Procesa datos anuales de los convenios y los agrupa para mostrar totales por mes. Utiliza el componente `ProgressBar` para visualizar el cumplimiento de las acometidas dentro de sus respectivos convenios.

Este componente fue diseñado para proporcionar una visión gerencial del estado de la recuperación de cartera. Al agrupar los convenios por año y mes, la institución puede identificar patrones estacionales de pago y evaluar si las políticas de flexibilización financiera están surtiendo efecto. La implementación de indicadores visuales permite que, con un solo vistazo, se detecten los periodos donde la recaudación de convenios ha sido deficiente, facilitando la toma de decisiones correctivas inmediatas para asegurar el flujo de caja necesario para la operación institucional.

> **[ESPACIO PARA IMAGEN DE IU: Captura de pantalla de la Tabla de Resumen Anual de Convenios en funcionamiento]**

**Ejemplo:**

```typescript
const totals = useMemo(() => {
  return data.reduce(
    (acc, item) => ({
      totalEpaa: acc.totalEpaa + item.epaaValue,
      totalTrash: acc.totalTrash + item.trashRate
    }),
    { totalEpaa: 0, totalTrash: 0 }
  );
}, [data]);
```

### Listado de Componentes de Convenios

- **`AgreementsAnuallySummaryTable.tsx`**: Panel de control anual que consolida la efectividad de los convenios firmados. Permite identificar meses de alta y baja suscripción de acuerdos de pago.
- **`AgreementsMonthlySummaryTable.tsx`**: Tabla de detalle transaccional mensual. Desglosa los pagos recibidos por concepto de convenios, diferenciando entre abonos a capital, intereses y tasas administrativas.
- **`AgreementsCitizenSummaryTable.tsx`**: Vista consolidada del contribuyente. Agrupa todas las acometidas vinculadas a un mismo ciudadano que poseen convenios vigentes, facilitando la gestión de cobro personalizada.
- **`AgreementsCollectorPerformanceTable.tsx`**: Monitor de eficiencia del personal de recaudación. Mide el volumen de convenios gestionados y la tasa de recaudación efectiva por cada funcionario.
- **`AgreementsFilters.tsx`**: Motor de búsqueda inteligente. Permite la segmentación por estados de convenio (Activo, Incumplido, Finalizado), sectores geográficos y rangos de deuda inicial.

---

## 4. Desarrollo del Submódulo de Entrada de Ingresos (`entry-data`)

Bloque encargado de la auditoría y control diario del flujo de caja generado por los pagos de acometidas y convenios.

### 4.1 FullBreakdownReportTable

Componente de alta complejidad diseñado para la reconciliación financiera multi-tasa. Maneja más de 12 columnas financieras con persistencia de totales.

La implementación de este reporte detallado representa el nivel más alto de rigor contable dentro del sistema. Su desarrollo se centró en permitir que cada transacción sea auditada de forma individual, desglosando componentes complejos como la Tasa de Basura, el IVA y los diversos tipos de recargos que se aplican a una acometida. Esta transparencia es fundamental para el departamento de tesorería, ya que permite justificar cada ingreso ante los organismos de control y asegura que la distribución de los fondos recaudados se realice de manera exacta según la normativa municipal vigente.

> **[ESPACIO PARA IMAGEN DE IU: Captura de pantalla de la Interfaz del Reporte Detallado (Full Breakdown)]**

**Ejemplo:**

```typescript
const columns: Column<FullBreakdown>[] = [
  { header: 'Cód. Título', accessor: 'titleCode' },
  { header: 'Agua ($)', accessor: 'epaaValue', isNumeric: true }
];
```

### Análisis de Reportes de Entrada

- **`DailyCollectorSummaryTable.tsx`**: Auditoría por cajero. Genera un resumen ejecutivo de la jornada, permitiendo el arqueo físico de valores contra los registros del sistema en tiempo real.
- **`DailyGroupedReportTable.tsx`**: Clasificación por rubros de ingreso. Agrupa la recaudación por códigos presupuestarios, facilitando la exportación de datos para los sistemas de contabilidad gubernamental.
- **`DailyPaymentMethodReportTable.tsx`**: Conciliación bancaria. Separa los ingresos por canal (Efectivo, Tarjeta, Transferencia), fundamental para la validación de depósitos al final del día.
- **`FullBreakdownReportTable.tsx`**: La herramienta definitiva de auditoría. Permite rastrear el origen de cada centavo recaudado, desglosando componentes como el IVA, tasas de servicio y contribuciones especiales.

---

## 5. Desarrollo del Submódulo de Recaudación General (`general-collection`)

Capa de analítica avanzada para visualizar el ingreso total proveniente de todas las acometidas del sistema.

### 5.1 Dashboards y Gráficos de Recaudación

Muestra KPIs como "Total Recaudado por Acometidas" y evolución histórica mediante gráficos dinámicos en la interfaz.

Este submódulo transforma los datos contables en inteligencia de negocios pura. En lugar de navegar por listas interminables de números, el usuario dispone de gráficos dinámicos que representan la salud financiera de la institución a lo largo del tiempo. Se desarrollaron herramientas que permiten comparar la recaudación actual con datos históricos que se remontan hasta el año 2013, permitiendo identificar tendencias de crecimiento y medir el impacto de las campañas de cobro. Esta capacidad analítica es crucial para la planificación presupuestaria anual, ya que proporciona una base sólida de datos reales sobre el comportamiento histórico de los ingresos por acometida.

> **[ESPACIO PARA IMAGEN DE IU: Captura del Dashboard de Recaudación General (Gráficos y KPIs)]**

**Ejemplo:**

```tsx
<DynamicBarChart data={chartData} dataKeyX="year" dataKeyY="totalCollection" />
```

### Capacidades Analíticas del Módulo

- **`GeneralCollectionDashboard.tsx`**: Centro neurálgico de BI (Business Intelligence). Proporciona una vista 360° de la recaudación diaria, con comparativas de desempeño contra periodos anteriores.
- **`GeneralCollectionYearlyDashboard.tsx`**: Análisis de tendencias de largo plazo. Utiliza algoritmos de proyección para representar visualmente el crecimiento de la base de acometidas y la efectividad de la recaudación desde 2013.
- **`GeneralCollectionGroupedTable.tsx`**: Tabla maestra con capacidades de "Pivot". Permite al usuario reconfigurar la visualización de datos entre vistas de fecha, mes o año con un solo click.

---

## 6. Desarrollo del Submódulo de Morosidad (`overdue`)

Gestión crítica para la identificación de acometidas con deudas acumuladas y diseño de estrategias de recuperación.

### 6.1 GlobalOverdueDashboard

Centro de comando que segmenta las acometidas en mora para su ingreso a **Convenios de Pago**.

El desarrollo de este dashboard responde a la necesidad estratégica de reducir la cartera vencida de la institución. El sistema agrupa automáticamente a los deudores por el tiempo de mora, permitiendo priorizar las gestiones de cobro sobre las acometidas con mayor retraso. Esta segmentación es vital para diseñar programas de convenios personalizados, donde se puede ofrecer facilidades de pago específicas a quienes tienen deudas críticas (más de un año). La interfaz proporciona una visión clara del riesgo financiero, ayudando a convertir cuentas incobrables en convenios de pago activos que inyectan liquidez al sistema.

> **[ESPACIO PARA IMAGEN DE IU: Captura de la Interfaz del Dashboard Global de Morosidad]**

### Arquitectura de Gestión de Cartera

- **`GlobalOverdueDashboard.tsx`**: Implementación de gráficos de composición de deuda. Permite analizar el peso relativo de los diferentes rubros en la cartera vencida global.
- **`MonthlyDebtSummaryTable.tsx`**: Herramienta de detección de estacionalidad en el impago. Ayuda a identificar en qué meses del año se genera el mayor volumen de mora.
- **`OverduePaymentsTable.tsx`**: Listado de acción inmediata. Proporciona acceso directo al historial de la acometida y permite iniciar el proceso de emisión de coactivas o convenios.
- **`YearlyOverdueSumaryTable.tsx`**: Resumen histórico de deuda estancada. Crucial para la depuración de carteras de difícil cobro de ejercicios fiscales antiguos.

---

## 7. Estándares Técnicos y Funcionalidades Compartidas

### 7.1 El Motor de Exportación a PDF (`useTablePdfExport`)

Genera reportes legales para la formalización de convenios y auditoría de acometidas.

La capacidad de exportación no fue tratada como un simple "botón de impresión", sino como una herramienta de validez legal. Cada reporte generado sigue un estándar de diseño institucional estricto, asegurando que la información entregada al ciudadano o a la gerencia sea formal y fidedigna. Se desarrolló una lógica que garantiza que el reporte contenga todos los filtros aplicados en la búsqueda, proporcionando un contexto completo sobre los datos exportados. Esto elimina cualquier ambigüedad en las auditorías externas y refuerza la transparencia institucional al entregar documentos estandarizados y matemáticamente validados.

> **[ESPACIO PARA IMAGEN DE IU: Vista previa del Reporte PDF en la interfaz de usuario]**

**Evidencia de Mapeo:**

```typescript
mapRowData: (item, selectedColumns) => {
  const rowData = { monto: CurrencyFormatter.format(item.amount) };
  return selectedColumns.map((col) => rowData[col.id]);
};
```

### Características del Motor de Reportes

- **Integridad de Datos**: Garantiza que los totales mostrados en el documento PDF coincidan matemáticamente con los datos en pantalla y en la base de datos.
- **Metadatos de Auditoría**: Cada reporte incluye automáticamente la fecha de generación, el usuario responsable y los filtros aplicados para asegurar la trazabilidad administrativa.
- **Adaptabilidad Visual**: Ajusta dinámicamente el tamaño de las columnas para optimizar el espacio en papel.

---

## 8. Innovación en Auditoría: ReadingAuditPage

Página diseñada para auditar las lecturas de las acometidas antes de que se conviertan en facturas o convenios.

### 8.1 Arquitectura y Validación de Lecturas

Valida que el consumo de la acometida sea coherente con su historial mediante la interfaz de usuario.

Este componente actúa como el "escudo de integridad" del sistema financiero. Su importancia radica en la prevención de errores de facturación que podrían dañar la confianza del ciudadano. Al permitir que un auditor verifique visualmente (mediante fotos y promedios históricos) que una lectura de acometida es correcta antes de procesar el cobro, el sistema garantiza que la recaudación posterior sea justa y precisa. Esta validación previa reduce drásticamente el volumen de reclamos y rectificaciones, optimizando el flujo de trabajo del departamento de contabilidad al recibir datos ya depurados y verificados.

> **[ESPACIO PARA IMAGEN DE IU: Captura de pantalla de la página de Auditoría de Lecturas]**

**Evidencia de Lógica:**

```typescript
const filteredAuditData = useMemo(() => {
  return auditData.filter(
    (row) =>
      statusFilter === 'all' ||
      (statusFilter === 'complete' ? row.isComplete : !row.isComplete)
  );
}, [auditData, statusFilter]);
```

### Protocolo de Auditoría Pre-Contable

- **Capa de Validación Temporal**: Asegura que las lecturas cargadas correspondan exactamente al ciclo de facturación activo.
- **Detección de Anomalías**: Mediante filtros avanzados, el auditor puede localizar acometidas con consumos atípicos.
- **Sincronización Modular**: Una vez aprobadas las lecturas en esta página, los datos fluyen automáticamente hacia los módulos de contabilidad.

---

## 9. Conclusiones Estratégicas del Desarrollo
El desarrollo integral del módulo `accounting` y sus sistemas de soporte representa un hito en la modernización digital de la institución. Tras la auditoría de los componentes y la lógica implementada, se desprenden las siguientes conclusiones:

1. **Integridad y Precisión Financiera**: La arquitectura por capas asegura que no existan discrepancias entre los datos capturados en campo (lecturas) y los valores facturados. El sistema de redondeo y formateo de alta precisión garantiza un cuadre de caja exacto hasta el último centavo.
2. **Escalabilidad Garantizada**: El uso de *Clean Architecture* permite que el sistema crezca sin degradar su rendimiento. La adición de nuevas tasas, impuestos o reglas de convenios se puede realizar de forma modular sin afectar el funcionamiento del núcleo contable.
3. **Optimización de la Recuperación de Cartera**: Gracias a la visibilidad proporcionada por los Dashboards de Morosidad y el submódulo de Convenios, la institución cuenta ahora con herramientas proactivas para reducir la cartera vencida, transformando deudas antiguas en ingresos recurrentes y seguros.
4. **Transparencia y Auditabilidad Total**: El motor de reportes PDF y las tablas de auditoría detallada (Full Breakdown) proporcionan una trazabilidad completa de cada centavo recaudado. Esto no solo facilita las auditorías externas, sino que fortalece la confianza del ciudadano en la gestión institucional.
5. **Excelencia en la Experiencia de Usuario (UX/UI)**: La implementación de una interfaz moderna, limpia y con feedback visual constante (semáforos de riesgo, barras de progreso) reduce significativamente la curva de aprendizaje de los funcionarios y minimiza los errores operativos humanos.
6. **Eficiencia en la Toma de Decisiones**: Los paneles de Business Intelligence (BI) permiten a la gerencia pasar de una gestión reactiva a una estratégica, basando sus decisiones en datos históricos reales y proyecciones visuales claras sobre el comportamiento de las acometidas.

En conclusión, el módulo de Contabilidad no es solo una herramienta de registro, sino un motor de gestión inteligente que asegura la sostenibilidad financiera y la transparencia operativa de la plataforma SIGEPAA-AA.

> **[ESPACIO PARA IMAGEN DE IU: Captura final del sistema integrado en plena operación]**
