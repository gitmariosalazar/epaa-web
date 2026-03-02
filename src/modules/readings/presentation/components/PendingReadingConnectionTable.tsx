import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import type { PendingReadingConnection } from '../../domain/models/Reading';

interface PropTypes {
  data: PendingReadingConnection[];
  isLoading: boolean;
}

export const PendingReadingConnectionTable: React.FC<PropTypes> = ({
  data,
  isLoading
}) => {
  const columns: Column<PendingReadingConnection>[] = [
    {
      header: 'Cadastral Key',
      accessor: 'cadastralKey'
    },
    {
      header: 'Meter Number',
      accessor: 'meterNumber'
    },
    {
      header: 'Address',
      accessor: 'address'
    },
    {
      header: 'Sector',
      accessor: 'sector'
    },
    {
      header: 'Account',
      accessor: 'account'
    },
    {
      header: 'Client Name',
      accessor: 'clientName'
    },
    {
      header: 'Card ID',
      accessor: 'cardId'
    },
    {
      header: 'Rate Name',
      accessor: 'rateName'
    },
    {
      header: 'Average Consumption',
      accessor: 'averageConsumption'
    }
  ];

  return (
    <div className="cr-table-container">
      <h3 style={{ marginBottom: '5px', color: 'var(--text-primary)' }}>
        Lecturas Pendientes
      </h3>
      <Table<PendingReadingConnection>
        data={data}
        columns={columns}
        isLoading={isLoading}
        pagination
        pageSize={7}
      />
    </div>
  );
};
