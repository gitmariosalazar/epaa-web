import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import type { Property } from '../../domain/models/Property';
import '../styles/PropertiesTable.css';

interface PropertiesTableProps {
  data: Property[];
  isLoading: boolean;
  onSort: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  onEndReached?: () => void;
  hasMore?: boolean;
}

export const PropertiesTable: React.FC<PropertiesTableProps> = ({
  data,
  isLoading,
  onSort,
  sortConfig,
  onEndReached,
  hasMore
}) => {
  const { t } = useTranslation();

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    onSort(key, direction);
  };

  const columns: Column<Property>[] = useMemo(
    () => [
      {
        header: t('properties.table.cadastralKey', 'Clave Catastral'),
        accessor: 'propertyCadastralKey',
        sortable: true
      },
      {
        header: t('properties.table.clientId', 'ID Cliente'),
        accessor: 'propertyClientId',
        sortable: true
      },
      {
        header: t('properties.table.sector', 'Sector'),
        accessor: 'propertySector',
        sortable: true
      },
      {
        header: t('properties.table.address', 'Dirección'),
        accessor: 'propertyAddress',
        sortable: true
      },
      /*
      {
        header: t('properties.table.landArea', 'Área Terreno'),
        accessor: 'propertyLandArea',
        sortable: true,
        Cell: ({ value }: { value: any }) => `${value} m²`
      },
      {
        header: t('properties.table.constructionArea', 'Área Const.'),
        accessor: 'propertyConstructionArea',
        sortable: true,
        Cell: ({ value }: { value: any }) => `${value} m²`
      },
      {
        header: t('properties.table.commercialValue', 'Valor Comercial'),
        accessor: 'propertyCommercialValue',
        sortable: true,
        Cell: ({ value }: { value: any }) => `$${Number(value).toFixed(2)}`
      },
      */
      {
        header: t('properties.table.type', 'Tipo'),
        accessor: 'propertyTypeName',
        sortable: true
      }
    ],
    [t]
  );

  return (
    <div className="properties-table-container">
      <Table
        columns={columns}
        data={data}
        isLoading={isLoading}
        onSort={handleSort}
        sortConfig={sortConfig}
        onEndReached={onEndReached}
        hasMore={hasMore}
        pagination={true}
        emptyState={
          <div className="properties-table-empty-state">
            {t('properties.table.empty', 'No properties found')}
          </div>
        }
      />
    </div>
  );
};
