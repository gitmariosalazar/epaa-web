import React, { useState, useMemo } from 'react';
import { Table, type Column } from '@/shared/presentation/components/Table/Table';
import { type ClientHistoryInvoiceGroup } from '../../hooks/pending-readings/useClientHistoryInvoices';
import { type PendingReading } from '../../../domain/models/PendingReading';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Eye, Download } from 'lucide-react';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { ClientPendingBillsPdfGenerator } from '../templates/pdf/ClientPendingBillsPdfGenerator';
import { ClientHistoryInvoiceDetailsModal } from './ClientHistoryInvoiceDetailsModal';
import '../../styles/payments/PaymentsTable.css';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { getColorIncomeStatus, getLabelIncomeStatus, type TypeIncomeStatus } from '@/shared/utils/IncomeStatus';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';

interface ClientHistoryInvoicesTableProps {
  groups: ClientHistoryInvoiceGroup[];
  isLoading: boolean;
}

export const ClientHistoryInvoicesTable: React.FC<ClientHistoryInvoicesTableProps> = ({
  groups,
  isLoading
}) => {
  const [selectedReading, setSelectedReading] = useState<PendingReading | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const pdfGenerator = new ClientPendingBillsPdfGenerator();

  const handleDownloadGlobal = async () => {
    if (groups.length === 0) return;
    setIsGeneratingPdf(true);
    try {
      const adaptedGroups = groups.map(group => ({
        ...group,
        bills: group.invoices,
        totalToPay: group.totalPaid
      }));
      await pdfGenerator.downloadPdf(adaptedGroups as any, 'Historial_Pagos_Todos.pdf');
    } catch (error) {
      console.error('Error generating global PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadIndividual = async (group: ClientHistoryInvoiceGroup) => {
    setIsGeneratingPdf(true);
    try {
      const adaptedGroup = {
        ...group,
        bills: group.invoices,
        totalToPay: group.totalPaid
      };
      await pdfGenerator.downloadPdf([adaptedGroup as any], `Historial_Pagos_${group.cadastralKey}.pdf`);
    } catch (error) {
      console.error('Error generating individual PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Flatten the invoices from all groups
  const data = useMemo(() => {
    return groups.flatMap(group => group.invoices);
  }, [groups]);

  const columns: Column<PendingReading>[] = [
    {
      header: 'Período',
      accessor: (item) => `${item.month}-${item.year}`,
      sortKey: 'year',
      sortable: true
    },
    {
      header: 'Cliente',
      accessor: (item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar
            name={`${item.name} ${item.lastName}`}
            size="sm"
          />
          <div>
            <div style={{ fontWeight: 500 }}>
              {item.name} {item.lastName}
            </div>
            <div style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>
              {item.cardId}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Clave Catastral',
      accessor: 'cadastralKey',
      sortable: true
    },
    {
      header: 'Consumo',
      accessor: (item) => `${item.consumption} m³`,
      sortable: false
    },
    {
      header: 'Valor EPAA',
      accessor: (item) => CurrencyFormatter.format(Number(item.epaaValue) || 0),
      sortable: true,
      sortKey: 'epaaValue',
      isNumeric: true,
      id: 'epaaValue'
    },
    {
      header: 'Tasa Basura',
      accessor: (item) => CurrencyFormatter.format(Number(item.totalTrashRate) || 0),
      sortable: true,
      sortKey: 'totalTrashRate',
      isNumeric: true,
      id: 'totalTrashRate'
    },
    {
      header: 'Recargo',
      accessor: (item) => CurrencyFormatter.format(Number(item.surcharge) || 0),
      sortable: true,
      sortKey: 'surcharge',
      isNumeric: true,
      id: 'surcharge'
    },
    {
      header: 'Total Pagado',
      accessor: (item) => CurrencyFormatter.format(Number(item.adjustedTotal || item.total) || 0),
      sortable: true,
      sortKey: 'total',
      isNumeric: true,
      id: 'total'
    },
    {
      header: 'Fecha Pago',
      accessor: (item) => item.paymentDate ? new Date(item.paymentDate).toLocaleDateString() : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <ColorChip
        label={'PENDIENTE'}
        status={getColorIncomeStatus(item.incomeStatus as TypeIncomeStatus)}
        variant="soft"
        size="xs"
      ></ColorChip></div>,
      sortable: true,
      sortKey: 'paymentDate'
    },
    {
      header: 'Estado',
      accessor: (item) => {
        return <ColorChip
          label={getLabelIncomeStatus(item.incomeStatus as TypeIncomeStatus)}
          status={getColorIncomeStatus(item.incomeStatus as TypeIncomeStatus)}
          variant="soft"
          size="xs"
        ></ColorChip>
      },
      sortable: true,
      sortKey: 'incomeStatus'
    },
    {
      header: 'Opciones',
      accessor: (item) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Tooltip content="Detalles" followCursor={false}>
            <Button
              onClick={() => setSelectedReading(item)}
              variant="ghost"
              size="sm"
              color="sky"
              circle
            >
              <Eye size={16} />
            </Button>
          </Tooltip>
          <Tooltip content="Descargar Historial" followCursor={false}>
            <Button
              onClick={() => {
                const parentGroup = groups.find(g => g.cadastralKey === item.cadastralKey);
                if (parentGroup) handleDownloadIndividual(parentGroup);
              }}
              variant="ghost"
              size="sm"
              color="indigo"
              circle
              isLoading={isGeneratingPdf}
            >
              <Download size={16} />
            </Button>
          </Tooltip>
        </div>
      )
    }
  ];

  const totalEpaa = data.reduce((sum, item) => sum + (Number(item.epaaValue) || 0), 0);
  const totalTrash = data.reduce((sum, item) => sum + (Number(item.totalTrashRate) || 0), 0);
  const totalSurcharge = data.reduce((sum, item) => sum + (Number(item.surcharge) || 0), 0);
  const totalAmount = data.reduce((sum, item) => sum + (Number(item.adjustedTotal || item.total) || 0), 0);

  const totalRows = [
    {
      label: 'TOTAL VALOR EPAA',
      value: totalEpaa,
      columnId: 'epaaValue'
    },
    {
      label: 'TOTAL TASA BASURA',
      value: totalTrash,
      columnId: 'totalTrashRate'
    },
    {
      label: 'TOTAL RECARGO',
      value: totalSurcharge,
      columnId: 'surcharge'
    },
    {
      label: 'TOTAL PAGADO',
      value: totalAmount,
      highlight: true,
      columnId: 'total'
    }
  ];



  return (
    <div className="payments-table-wrapper" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Table<PendingReading>
        data={data}
        columns={columns}
        isLoading={isLoading}
        pagination
        pageSize={15}
        totalRows={totalRows}
        onExportPdf={handleDownloadGlobal}
        width="100"
        emptyState={
          <EmptyState
            message="No se encontraron pagos"
            description="No hay facturas pagadas en el historial."
            variant="info"
          />
        }
        getRowColor={(item: PendingReading) => {
          if (item.incomeStatus === 'P') return 'neutral';
          return 'error';
        }}
      />

      <ClientHistoryInvoiceDetailsModal
        reading={selectedReading}
        isOpen={!!selectedReading}
        onClose={() => setSelectedReading(null)}
      />
    </div>
  );
};
