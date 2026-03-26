import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  Droplets,
  Trash2,
  FileText,
  Info,
  AlertTriangle,
  MapPin,
  User
} from 'lucide-react';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { Button } from '@/shared/presentation/components/Button/Button';
import type { PendingReading } from '../../domain/models/PendingReading';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import './PendingReadingsModal.css';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { FaAddressCard } from 'react-icons/fa';
import { ConverDate } from '@/shared/presentation/utils/datetime/ConverDate';

interface PendingReadingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PendingReading[];
  isLoading: boolean;
  clientName?: string;
  clientId?: string;
  hasMore?: boolean;
  onEndReached?: () => void;
  error?: string | null;
}

export const PendingReadingsModal: React.FC<PendingReadingsModalProps> = ({
  isOpen,
  onClose,
  data,
  isLoading,
  clientName,
  clientId,
  hasMore,
  onEndReached,
  error
}) => {
  const { t } = useTranslation();

  const fmt = (val: number) => `$${val.toFixed(2)}`;

  const clientMetadata = useMemo(() => {
    if (data.length === 0) return null;
    const first = data[0];
    return {
      name: first.name + ' ' + first.lastName,
      clientId: first.cardId,
      address: first.address
    };
  }, [data]);

  const columns: Column<PendingReading>[] = useMemo(
    () => [
      {
        header: t('accounting.pending.incomeCode', 'Código'),
        accessor: (item: PendingReading) => (
          <div className="period-cell">
            <span className="period-text">{item.incomeCode}</span>
          </div>
        ),
        id: 'incomeCode'
      },
      {
        header: t('accounting.pending.incomeTitleCode', 'Cod. Título'),
        accessor: (item: PendingReading) => (
          <div className="period-cell">
            <span className="period-text">{item.incomeTitleCode}</span>
          </div>
        ),
        id: 'incomeTitleCode'
      },
      {
        header: t('accounting.pending.cadastralKey', 'Clave Catastral'),
        accessor: (item: PendingReading) => (
          <div className="period-cell">
            <span className="period-text">{item.cadastralKey}</span>
          </div>
        ),
        id: 'incomeTitleCode'
      },
      {
        header: t('accounting.pending.incomeDate', 'Emisión'),
        accessor: (item: PendingReading) => (
          <div className="currency-cell">
            <span className="currency-val">
              {item.monthDue + ' - ' + item.yearDue}
            </span>
            {
              <span className="sub-text">
                F. Emisión: {ConverDate(item.incomeDate)}
              </span>
            }
          </div>
        ),
        id: 'incomeDate'
      },
      {
        header: t('accounting.pending.period', 'Período'),
        accessor: (item: PendingReading) => (
          <div className="currency-cell">
            <span className="currency-val">
              {item.month + ' - ' + item.year}
            </span>
            {
              <span className="sub-text">
                F. Lectura: {ConverDate(item.readingCaptureDate)}
              </span>
            }
          </div>
        ),
        id: 'period'
      },
      {
        header: t('accounting.pending.consumption', 'Consumo'),
        accessor: (item: PendingReading) => (
          <Tooltip
            className="reading-cell"
            content={
              item.cadastralKey !== '0' ? (
                <>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
                  >
                    <p>
                      {t(
                        'accounting.pending.previousReading',
                        'Lectura Anterior'
                      )}
                      : {item.previousReading}
                    </p>
                    <p>
                      {t('accounting.pending.currentReading', 'Lectura Actual')}
                      : {item.currentReading}
                    </p>
                  </div>
                </>
              ) : (
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
                >
                  <p>
                    Esta deuda pendiente no tiene lectura de consumo, es un
                    valor por otro concepto y es de tipo {item.incomeTitleCode}
                  </p>
                </div>
              )
            }
          >
            {item.cadastralKey !== '0' ? (
              <>
                <Droplets size={14} className="icon-blue" />
                <div className="reading-data">
                  <span className="consumption-text">
                    {item.consumption} m³
                  </span>
                </div>
              </>
            ) : (
              <>
                <FileText size={14} className="icon-gray" />
                <div className="reading-data">
                  <span className="consumption-text">S/C</span>
                </div>
              </>
            )}
          </Tooltip>
        ),
        id: 'consumption'
      },
      {
        header: t('accounting.pending.epaaValue', 'Valor Agua'),
        accessor: (item: PendingReading) => (
          <div className="currency-cell">
            <span className="currency-val">{fmt(item.epaaValue)}</span>
            {
              <span className="sub-text">
                Serv. Terce: {fmt(item.thirdPartyValue)}
              </span>
            }
          </div>
        ),
        id: 'epaaValue'
      },
      {
        header: t('accounting.pending.surcharge', 'Recargo'),
        accessor: (item: PendingReading) => (
          <div className="currency-cell">
            <span
              className={`currency-val ${item.surcharge > 0 ? 'text-warning' : ''}`}
            >
              {fmt(item.surcharge)}
            </span>
          </div>
        ),
        id: 'surcharge'
      },
      {
        header: t('accounting.pending.trashRate', 'Tasa Basura'),
        accessor: (item: PendingReading) => (
          <div className="currency-cell">
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Trash2 size={12} className="icon-muted" />
              <span className="currency-val">{fmt(item.trashRate)}</span>
            </div>
          </div>
        ),
        id: 'trashRate'
      },
      {
        header: t('accounting.pending.status', 'V. Terceros'),
        accessor: (item: PendingReading) => (
          <div className="currency-cell">
            <span className="currency-val">{fmt(item.thirdPartyValue)}</span>
          </div>
        ),
        id: 'thirdPartyValue'
      },
      {
        header: t('accounting.pending.total', 'Total Planilla'),
        accessor: (item: PendingReading) => (
          <div className="total-cell">
            <span className="total-amount">{fmt(item.adjustedTotal)}</span>
          </div>
        ),
        id: 'total'
      }
    ],
    [t]
  );

  const totalDue = useMemo(
    () =>
      data.reduce((acc: number, item: PendingReading) => acc + item.total, 0),
    [data]
  );

  if (!isOpen) return null;

  return (
    <div className="pending-readings-overlay" onClick={onClose}>
      <div
        className="pending-readings-modal premium-theme"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="pending-readings-header">
          <div className="header-main">
            <div className="title-icon">
              <FileText size={30} className="icon-accent-p" />
            </div>
            <div className="title-group">
              <div className="top-row">
                <h3>{t('accounting.pending.title', 'Cuentas Pendientes')}</h3>
                <div className="total-badge-header">{fmt(totalDue)}</div>
              </div>
              <div className="client-badge">
                <span className="id">
                  <FaAddressCard size={12} className="icon-muted" />
                  {clientId}
                </span>
                <span className="dot">|</span>
                <span className="name">
                  <User size={12} className="icon-muted" />
                  {clientName}
                </span>
              </div>
              <span className="info-address">
                <MapPin size={12} className="icon-muted" />
                {clientMetadata?.address}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            circle
            onClick={onClose}
            className="close-btn-p"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="pending-readings-body">
          {isLoading ? (
            <div className="pending-loading-state">
              <div className="shimmer-table"></div>
              <p>{t('common.loading', 'Cargando información...')}</p>
            </div>
          ) : error ? (
            <div className="pending-error-state">
              <AlertTriangle size={32} className="text-error" />
              <h3>{t('common.error', 'Ha ocurrido un error')}</h3>
              <p>{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
              >
                {t('common.retry', 'Reintentar')}
              </Button>
            </div>
          ) : (
            <Table
              data={data}
              columns={columns}
              isLoading={isLoading}
              pagination={true}
              totalRows={[
                {
                  label: t(
                    'accounting.pending.grandTotal',
                    'TOTAL DEUDA ACUMULADA'
                  ),
                  value: totalDue,
                  highlight: true,
                  columnId: 'total'
                }
              ]}
              emptyState={
                <EmptyState
                  message={t(
                    'accounting.pending.noData',
                    'Sin deudas pendientes'
                  )}
                  description={t(
                    'accounting.pending.noDataDesc',
                    'Felicidades, esta cuenta no presenta haberes pendientes de pago.'
                  )}
                  icon={Droplets}
                />
              }
              fullHeight
              hasMore={hasMore}
              onEndReached={onEndReached}
            />
          )}
        </div>

        {/* Footer info */}
        <div className="pending-readings-footer">
          <Info size={14} />
          <span>
            {t(
              'accounting.pending.footerNote',
              'Los valores incluyen recargo por mora acumulado hasta la fecha.'
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
