import type { ReadingNovelty } from '@/modules/readings/domain/models/ReadingNovelty';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { Button } from '@/shared/presentation/components/Button/Button';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import { getNoveltyColor } from '@/shared/presentation/utils/colors/novelties.colors';
import { Eye } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEdit } from 'react-icons/fa';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { TbChartPieFilled } from 'react-icons/tb';

interface ReadingsNoveltyTableProps {
  data: ReadingNovelty[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  error: Error | null;
  month: string;
  novelty: string;
  sector: string;
}

export const ReadingsNoveltyTable: React.FC<ReadingsNoveltyTableProps> = ({
  data,
  isLoading,
  onSort,
  sortConfig,
  error,
  month,
  sector
}) => {
  const { t } = useTranslation();

  const columns: Column<ReadingNovelty>[] = [
    {
      header: t('readingsNovelty.id', 'ID'),
      accessor: (item) => item.readingId,
      id: 'readingId',
      isColumnVisible: false
    },
    {
      header: t('readingsNovelty.sector', 'Sector'),
      accessor: (item) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
        >
          <ColorChip
            label={item.sector.toString()}
            status="info"
            size="sm"
            borderRadius="4px"
            variant="soft"
            icon={<TbChartPieFilled size={16} />}
          />
        </div>
      ),
      id: 'sector'
    },
    {
      header: t('readingsNovelty.account', 'Cuenta'),
      accessor: (item) => item.account,
      id: 'account',
      isColumnVisible: false
    },
    {
      header: t('readingsNovelty.clientName', 'Cliente'),
      accessor: (item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar name={item.clientName} size="sm" />
          <div>
            <div style={{ fontWeight: 300 }}>{item.clientName}</div>
            <div style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>
              {item.cardId}
            </div>
          </div>
        </div>
      ),
      id: 'clientName'
    },
    {
      header: t('readingsNovelty.address', 'Dirección'),
      accessor: (item) => item.address,
      id: 'address',
      isColumnVisible: false
    },
    {
      header: t('readingsNovelty.cadastralKey', 'Clave Catastral'),
      accessor: (item) => item.cadastralKey,
      id: 'cadastralKey'
    },
    {
      header: t('readingsNovelty.meterNumber', 'Medidor'),
      accessor: (item) => item.meterNumber,
      id: 'meterNumber',
      isColumnVisible: false
    },
    {
      header: t('readingsNovelty.readingType', 'Tipo Lectura'),
      accessor: (item) => item.readingTypeName,
      id: 'readingTypeName',
      isColumnVisible: false
    },
    {
      header: t('readingsNovelty.readingValue', 'Valor Lectura'),
      accessor: (item) => item.readingValue,
      id: 'readingValue',
      isColumnVisible: false
    },
    {
      header: t('readingsNovelty.calculatedConsumption', 'Consumo'),
      accessor: (item) => `${item.calculatedConsumption} m³`,
      id: 'calculatedConsumption'
    },
    {
      header: t('readingsNovelty.averageConsumption', 'Consumo Promedio'),
      accessor: (item) => `${item.averageConsumption} m³`,
      id: 'averageConsumption',
      isColumnVisible: false
    },
    {
      header: t('readingsNovelty.rateName', 'Tarifa'),
      accessor: (item) => item.rateName,
      id: 'rateName',
      isColumnVisible: false
    },
    {
      header: t('readingsNovelty.readingDate', 'Fecha Lectura'),
      accessor: (item) => (
        <div>
          <p>
            {item.readingDate
              ? dateService.formatToDateTimeString(item.readingDate)
              : 'N/A'}
          </p>
        </div>
      ),
      id: 'readingDate'
    },
    {
      header: t('readingsNovelty.previousReadingValue', 'Lectura Anterior'),
      accessor: (item) => item.previousReading,
      id: 'previousReadingValue'
    },
    {
      header: t('readingsNovelty.readingValue', 'Lectura Actual'),
      accessor: (item) => item.currentReading,
      id: 'currentReadingValue'
    },
    {
      header: t('readingsNovelty.novelty', 'Novedad'),
      accessor: (item) => {
        const color = getNoveltyColor(item.novelty || 'NOT_READ');
        return (
          <ColorChip
            label={item.novelty || '-'}
            color={color}
            size="xs"
            borderRadius="10px"
            variant="soft"
          />
        );
      },
      id: 'novelty',
      isColumnVisible: true
    },
    {
      header: t('common.actions', 'Acciones'),
      accessor: (reading) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Tooltip
            themeColor="info"
            content={
              <>
                <div> Ver Detalles </div>
                <div> Lectura ID: {reading.readingId} </div>
              </>
            }
          >
            <Button size="sm" variant="ghost" onClick={() => {}} circle>
              <Eye size={16} />
            </Button>
          </Tooltip>
          <Tooltip themeColor="warning" content={t('common.edit', 'Editar')}>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {}}
              color="warning"
              circle
            >
              <FaEdit size={16} />
            </Button>
          </Tooltip>
        </div>
      ),
      id: 'actions',
      isColumnVisible: false
    }
  ];

  const totalConsumption = useMemo(() => {
    if (isLoading) {
      return 0;
    }
    return data.reduce((acc, item) => {
      return acc + Number(item.calculatedConsumption ?? 0);
    }, 0);
  }, [data, isLoading]);

  const totalReadings = useMemo(() => {
    return data.length;
  }, [data]);

  const totalRows = [
    {
      label: 'Consumo Total',
      value: totalConsumption,
      columnId: 'calculatedConsumption'
    },
    {
      label: 'Total de Lecturas',
      value: totalReadings,
      columnId: 'readingId'
    }
  ];

  const { setShowPdfPreview, PdfPreviewModal } =
    useTablePdfExport<ReadingNovelty>({
      data,
      availableColumns: columns.map((c) => {
        const id =
          c.id ||
          (typeof c.accessor === 'string'
            ? c.accessor
            : ((c.accessor as any)?.name ?? JSON.stringify(c.accessor)));
        // Set default columns to avoid squishing 16 columns in the PDF
        const isDefault = [
          'account',
          'clientName',
          'meterNumber',
          'readingValue',
          'readingDate',
          'novelty'
        ].includes(id as string);
        return {
          id,
          label: c.header as string,
          isDefault
        };
      }),
      reportTitle: t(
        'readingsNovelty.reportTitle',
        'Lecturas por novedad en el sector'
      ),
      reportDescription: t(
        'readingsNovelty.reportDescription',
        'Sector: {{sector}}, Mes: {{month}}',
        {
          sector,
          month
        }
      ),
      labelsHorizontal: {
        'Fecha de Exportación':
          new Date().toLocaleDateString() +
          ' ' +
          new Date().toLocaleTimeString()
      },
      totalRows,
      mapRowData: (item, selectedColumns) => {
        const rowData: Record<string, string> = {
          readingId: item.readingId?.toString() ?? 'N/A',
          sector: item.sector?.toString() ?? 'N/A',
          account: item.account?.toString() ?? 'N/A',
          clientName: item.clientName ?? 'N/A',
          address: item.address ?? 'N/A',
          cadastralKey: item.cadastralKey ?? 'N/A',
          meterNumber: item.meterNumber ?? 'N/A',
          readingTypeName: item.readingTypeName ?? 'N/A',
          readingValue: item.readingValue?.toString() ?? 'N/A',
          calculatedConsumption:
            item.calculatedConsumption?.toString() ?? 'N/A',
          averageConsumption: item.averageConsumption?.toString() ?? 'N/A',
          rateName: item.rateName ?? 'N/A',
          readingDate:
            item.readingDate && !isNaN(new Date(item.readingDate).getTime())
              ? dateService.formatToDateTimeString(item.readingDate)
              : item.readingDate
                ? String(item.readingDate)
                : 'N/A',
          previousReadingValue: item.previousReading?.toString() ?? 'N/A',
          currentReadingValue: item.currentReading?.toString() ?? 'N/A',
          novelty: item.novelty ?? 'N/A'
        };

        return selectedColumns.map((column) => rowData[column.id] ?? 'N/A');
      }
    });

  if (error) {
    return (
      <div>
        <h1>Error: {error.message}</h1>
      </div>
    );
  }

  return (
    <div className="cr-table-container">
      <Table<ReadingNovelty>
        columns={columns}
        data={data}
        isLoading={isLoading}
        sortConfig={sortConfig}
        onSort={onSort}
        pagination={true}
        pageSize={15}
        onExportPdf={() => setShowPdfPreview(true)}
        emptyState={
          <EmptyState
            message={t(
              'readingsNovelty.noData',
              'No se encontraron lecturas por novedad'
            )}
            description={t(
              'readingsNovelty.noDataDesc',
              'Selecciona un sector y una novedad, o presiona Consultar.'
            )}
            icon={IoInformationCircleOutline}
            minHeight="300px"
            variant="info"
          />
        }
      />
      {PdfPreviewModal}
    </div>
  );
};
