import React from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { FaList } from 'react-icons/fa';
import { Button } from '@/shared/presentation/components/Button/Button';
import type { OverduePayment } from '../../../domain/models/OverdueReading';
import './OverduePaymentDetailModal.css';

interface OverduePaymentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewPendingReadings: (cadastralKey: string) => void;
  item: OverduePayment | null;
}

export const OverduePaymentDetailModal: React.FC<OverduePaymentDetailModalProps> = ({
  isOpen,
  onClose,
  onViewPendingReadings,
  item
}) => {
  const { t } = useTranslation();
  if (!isOpen || !item) return null;

  const fmt = (val: number | undefined | null) =>
    val != null ? `$${val.toFixed(2)}` : '-';

  const rows = [
    {
      labelKey: t('accounting.overdue.clientId', 'ID Cliente'),
      value: item.clientId
    },
    {
      labelKey: t('accounting.overdue.cadastralKey', 'Clave Catastral'),
      value: item.cadastralKey
    },
    { labelKey: t('accounting.overdue.name', 'Nombre'), value: item.name },
    {
      labelKey: t('accounting.overdue.monthsPastDue', 'Meses de mora'),
      value: String(item.monthsPastDue)
    },
    {
      labelKey: t('accounting.overdue.totalTrashRate', 'Total Tasa Basura'),
      value: fmt(item.totalTrashRate)
    },
    {
      labelKey: t('accounting.overdue.totalEpaaValue', 'Total EPAA'),
      value: fmt(item.totalEpaaValue)
    },
    {
      labelKey: t('accounting.overdue.totalSurcharge', 'Recargo'),
      value: fmt(item.totalSurcharge)
    },
    {
      labelKey: t('accounting.overdue.totalOldSurcharge', 'Recargo Anterior'),
      value: fmt(item.totalOldSurcharge)
    },
    {
      labelKey: t(
        'accounting.overdue.totalOldImprovementsInterest',
        'Interés Mejoras'
      ),
      value: fmt(item.totalOldImprovementsInterest)
    }
  ];

  const totalDue =
    (item.totalTrashRate ?? 0) +
    (item.totalEpaaValue ?? 0) +
    (item.totalSurcharge ?? 0) +
    (item.totalOldSurcharge ?? 0) +
    (item.totalOldImprovementsInterest ?? 0);

  return (
    <div className="conn-detail-overlay" onClick={onClose}>
      <div className="conn-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="conn-detail-header">
          <h3>{t('accounting.overdue.detailTitle', 'Detalle de Mora')}</h3>
          <Button variant="ghost" size="sm" circle onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
        <div className="conn-detail-body">
          {rows.map(({ labelKey, value }) => (
            <div key={labelKey} className="conn-detail-row">
              <span className="conn-detail-label">{labelKey}</span>
              <span className="conn-detail-value">{value || '-'}</span>
            </div>
          ))}
          
          <div className="conn-detail-row conn-detail-total-row">
            <span className="conn-detail-label conn-detail-total-label">
              {t('accounting.overdue.totalDue', 'TOTAL A PAGAR')}
            </span>
            <span className="conn-detail-value conn-detail-total-value">
              ${totalDue.toFixed(2)}
            </span>
          </div>

          <div className="conn-detail-actions">
            <Button
              variant="outline"
              fullWidth
              className="btn-view-pending"
              onClick={() => {
                onClose();
                onViewPendingReadings(item.cadastralKey);
              }}
              leftIcon={<FaList size={14} />}
            >
              {t(
                'accounting.overdue.viewPendingReadings',
                'Ver lecturas pendientes'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
