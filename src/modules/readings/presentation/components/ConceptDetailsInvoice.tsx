import React, { useMemo } from 'react';
import '../styles/ConceptDetailsInvoice.css';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';

export interface ConceptDetail {
  code: string;
  name: string;
  order: number;
  amount: number;
  formula: string;
  conceptId: number;
  description: string;
  defaultValue: any;
  tariffVersion: string;
  calculationBase: number;
  calculationType: string;
  isCompanyService: boolean;
  percentageApplied: number | null;
}

interface Props {
  conceptDetails?: ConceptDetail[];
  readingCode?: string;
  cadastralKey?: string;
  readingMonthName?: string;
}

export const ConceptDetailsInvoice: React.FC<Props> = ({
  conceptDetails = [],
  readingCode: accountNumber,
  cadastralKey,
  readingMonthName,
}) => {
  // Ordenamiento por prioridad operativa
  const sortedConcepts = useMemo(() => {
    return [...conceptDetails].sort((a, b) => a.order - b.order);
  }, [conceptDetails]);

  // Cálculos de agregados
  const { subTotalEmpresa, subTotalTerceros, grandTotal } = useMemo(() => {
    let empresa = 0;
    let terceros = 0;

    sortedConcepts.forEach((item) => {
      const val = Number(item.amount) || 0;
      if (item.isCompanyService) {
        empresa += val;
      } else {
        terceros += val;
      }
    });

    return {
      subTotalEmpresa: empresa,
      subTotalTerceros: terceros,
      grandTotal: empresa + terceros,
    };
  }, [sortedConcepts]);

  // Resuelve la visualización de la base según la modalidad de cálculo
  const renderRateOrQty = (item: ConceptDetail) => {
    if (item.percentageApplied !== null && item.percentageApplied !== undefined) {
      return `${(Number(item.percentageApplied) * 100).toFixed(0)}%`;
    }
    if (item.calculationType === 'FIJO') {
      return '1 serv.';
    }
    if (item.calculationBase) {
      return `${Number(item.calculationBase).toFixed(2)} base`;
    }
    return '—';
  };

  return (
    <div className="invoice-card">
      {/* Cabecera estilo recibo */}
      <div className="invoice-table-header">
        <span>DESCRIPCIÓN DEL CONCEPTO</span>
        <span className="text-center cell-qty-h">BASE / TASA</span>
        <span className="text-right cell-price-h">MODALIDAD</span>
        <span className="text-right">TOTAL</span>
      </div>

      {/* Lista de Conceptos */}
      <div className="invoice-rows">
        {sortedConcepts.length === 0 ? (
          <div className="empty-message">No se registran conceptos liquidados para este periodo.</div>
        ) : (
          sortedConcepts.map((item) => (
            <div key={item.conceptId || item.code} className="invoice-row">
              {/* Detalle del concepto */}
              <div>
                <div className="concept-title">
                  <span className="concept-name">{item.name}</span>
                  <Tooltip content={`${item.isCompanyService ? 'Este concepto es parte de la Empresa Pública de Agua Potable y Alcantarillado de Antonio Ante (EPAA-AA)' : 'Este concepto no pertenece a la Empresa Pública de Agua Potable y Alcantarillado de Antonio Ante (EPAA-AA)'}`} followCursor={false} themeColor={item.isCompanyService ? 'blue' : 'red'}>
                    <ColorChip
                      label={`${item.isCompanyService ? 'EPAA-AA' : 'Terceros'}`}
                      size="xs"
                      variant="soft"
                      color={item.isCompanyService ? 'blue' : 'red'}
                    />
                  </Tooltip>
                </div>
                {item.description && <p className="concept-desc">{item.description}</p>}
                {
                  /**
                   {item.formula && (
                  <span className="concept-meta" title="Fórmula de cálculo">
                    fx: {item.formula}
                  </span>
                )} 
                  */
                }

              </div>

              {/* Base / Cantidad */}
              <div className="cell-qty">{renderRateOrQty(item)}</div>

              {/* Modalidad de cobro */}
              <div className="cell-price">{item.calculationType.replace(/_/g, ' ')}</div>

              {/* Valor cobrado */}
              <div className="cell-total">{CurrencyFormatter.format(Number(item.amount) || 0)}</div>
            </div>
          ))
        )}
      </div>

      {/* Pie con detalles de cuenta y resumen financiero */}
      <div className="invoice-footer-section">
        <div className="footer-info">
          <div className="footer-info-title">Detalles de Facturación</div>
          <div className="footer-info-details">
            {accountNumber && (
              <p>
                <strong>Cuenta:</strong> {accountNumber}
              </p>
            )}
            {cadastralKey && (
              <p>
                <strong>Clave Catastral:</strong> {cadastralKey}
              </p>
            )}
            {readingMonthName && (
              <p>
                <strong>Periodo:</strong> {readingMonthName}
              </p>
            )}
          </div>
        </div>

        <div className="invoice-summary">
          <div className="summary-line">
            <span>Servicios de Agua Potable y Alc.</span>
            <span>{CurrencyFormatter.format(subTotalEmpresa)}</span>
          </div>
          <div className="summary-line">
            <span>Tasas de Terceros (Aseo / Bomberos)</span>
            <span>{CurrencyFormatter.format(subTotalTerceros)}</span>
          </div>

          <div className="summary-divider" />

          <div className="summary-total-reading">
            <span>Total a Pagar</span>
            <span className="total-amount-reading">{CurrencyFormatter.format(grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};