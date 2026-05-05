/**
 * DashboardInfoModal
 * SRP  : responsabilidad única → mostrar la documentación informativa del Dashboard de KPIs.
 * OCP  : recibe startDate/endDate como props para personalizar el texto sin modificar el componente.
 * ISP  : interfaz mínima, solo lo que necesita.
 * DIP  : depende del Modal compartido (abstracción), no de una implementación propia.
 */
import React, { useState } from 'react';
import {
  Info,
  DollarSign,
  CheckCircle,
  Clock,
  FileText,
  Home,
  AlertTriangle,
  TrendingUp,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import './DashboardInfoModal.css';

export interface DashboardInfoModalProps {
  startDate?: string;
  endDate?: string;
}

interface KpiDescItem {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: 'green' | 'blue' | 'red' | 'amber' | 'purple' | 'teal' | 'rose';
}

const KPI_DESCRIPTIONS: KpiDescItem[] = [
  {
    icon: <TrendingUp size={16} />,
    label: '% Cumplimiento',
    description:
      'Porcentaje del monto total emitido que ya fue recaudado (cobrado neto). Fórmula: (Total Cobrado − Descuentos) / Total a Recaudar × 100.',
    color: 'green'
  },
  {
    icon: <DollarSign size={16} />,
    label: 'Total a Recaudar',
    description:
      'Suma bruta de todas las facturas de tasa de basura emitidas en el período, independientemente de si fueron pagadas o no.',
    color: 'blue'
  },
  {
    icon: <CheckCircle size={16} />,
    label: 'Total Cobrado',
    description:
      'Monto neto efectivamente recaudado (valor de factura menos descuentos aplicados) de todas las facturas del período que ya tienen una fecha de pago registrada.',
    color: 'green'
  },
  {
    icon: <AlertCircle size={16} />,
    label: 'Total Pendiente',
    description:
      'Monto que aún no ha sido cancelado. Corresponde a facturas emitidas en el período que NO tienen fecha de pago registrada a la fecha de consulta.',
    color: 'red'
  },
  {
    icon: <FileText size={16} />,
    label: 'Facturas Emitidas',
    description:
      'Número total de comprobantes de tasa de recolección de residuos sólidos generados en el período seleccionado.',
    color: 'purple'
  },
  {
    icon: <CheckCircle size={16} />,
    label: 'Facturas Pagadas',
    description:
      'Cantidad de comprobantes del período que ya cuentan con un registro de pago confirmado en el sistema.',
    color: 'teal'
  },
  {
    icon: <Clock size={16} />,
    label: 'Pendientes',
    description:
      'Comprobantes emitidos en el período que aún NO tienen fecha de pago. Representa la cartera activa por cobrar.',
    color: 'amber'
  },
  {
    icon: <FileText size={16} />,
    label: 'Notas de Crédito',
    description:
      'Documentos de ajuste (abonos, créditos) asociados a clientes con facturas emitidas en el período. Reducen la deuda efectiva del contribuyente.',
    color: 'rose'
  },
  {
    icon: <Home size={16} />,
    label: 'Predios Únicos',
    description:
      'Número de claves catastrales distintas que recibieron al menos una factura de tasa de basura en el período.',
    color: 'blue'
  },
  {
    icon: <AlertTriangle size={16} />,
    label: 'Sin Valor',
    description:
      'Facturas que no tienen registro correspondiente en la tabla Valor (Orden 10). Puede indicar un problema de integridad contable y debe revisarse.',
    color: 'rose'
  }
];

export const DashboardInfoModal: React.FC<DashboardInfoModalProps> = ({
  startDate,
  endDate
}) => {
  const [open, setOpen] = useState(false);

  const periodLabel =
    startDate && endDate
      ? `${startDate} → ${endDate}`
      : 'el período seleccionado';

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        className="dim-trigger-btn"
        onClick={() => setOpen(true)}
        title="Información del Dashboard"
        aria-label="Ver información del Dashboard"
      >
        <Info size={15} />
        <span>¿Qué muestra este Dashboard?</span>
      </button>

      {/* ── Modal usando el componente compartido ── */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Dashboard de KPIs — Vista de Emisión"
        description={`Todas las facturas de tasa de basura emitidas durante ${periodLabel}`}
        size="xl"
      >
        <div className="dim-modal-body">
          {/* Intro banner */}
          <div className="dim-intro">
            <ChevronRight size={14} className="dim-intro-icon" />
            <p>
              Este dashboard presenta un resumen financiero de{' '}
              <strong>todas las facturas emitidas</strong> en el período,
              independientemente de si ya fueron canceladas. Permite conocer
              cuánto se generó, cuánto se ha recaudado hasta la fecha y cuánto
              permanece pendiente de cobro.
            </p>
          </div>

          {/* KPI grid */}
          <div className="dim-grid">
            {KPI_DESCRIPTIONS.map((item) => (
              <div
                key={item.label}
                className={`dim-kpi-card dim-kpi-card--${item.color}`}
              >
                <div className="dim-kpi-icon-wrap">{item.icon}</div>
                <div className="dim-kpi-body">
                  <span className="dim-kpi-label">{item.label}</span>
                  <p className="dim-kpi-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Warning note */}
          <div className="dim-warning">
            <AlertTriangle size={14} className="dim-warning-icon" />
            <p>
              <strong>Nota:</strong> «Total Cobrado» puede incluir pagos
              realizados <em>fuera del período</em> (meses anteriores o
              posteriores) siempre que correspondan a facturas{' '}
              <strong>emitidas</strong> en este rango. Para ver exclusivamente
              lo recaudado en un período de cobro, utilice la categoría{' '}
              <strong>«Recaudación»</strong> del módulo{' '}
              <strong>KPI de Recolección</strong>.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};
