import React from 'react';
import { Card } from '@/shared/presentation/components/Card/Card';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Table } from '@/shared/presentation/components/Table/Table';
import { Pagination } from '@/shared/presentation/components/Pagination/Pagination';
import { Search, RefreshCw } from 'lucide-react';
import { useGeneralCustomersViewModel } from '../hooks/useGeneralCustomersViewModel';
import type { Column } from '@/shared/presentation/components/Table/Table';
import type { GeneralCustomer } from '../../domain/models/GeneralCustomer';

export const GeneralCustomersPage: React.FC = () => {
  const viewModel = useGeneralCustomersViewModel();

  const columns: Column<GeneralCustomer>[] = [
    { header: 'ID', accessor: 'customerId' },
    { header: 'Name', accessor: 'customerName' },
    { header: 'Type', accessor: 'identificationType' },
    { header: 'Address', accessor: 'customerAddress' },
    {
      header: 'Email',
      accessor: (row) => {
        const email = row.emails?.[0];
        if (typeof email === 'string') return email;
        return email?.correo || 'N/A';
      }
    },
    {
      header: 'Phone',
      accessor: (row) => {
        const phone = row.phoneNumbers?.[0];
        if (typeof phone === 'string') return phone;
        return phone?.numero || 'N/A';
      }
    }
  ];

  return (
    <div className="users-page">
      <div className="users-page__header">
        <h1>General Customers Management</h1>
      </div>

      <Card className="users-page__content">
        <div className="users-page__toolbar">
          <div className="users-page__search">
            <Search size={20} color="var(--text-secondary)" />
            <Input
              placeholder="Search general customers..."
              value={viewModel.searchTerm}
              onChange={(e) => viewModel.setSearchTerm(e.target.value)}
              className="users-page__search-input"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            leftIcon={<RefreshCw size={18} />}
          >
            Refresh
          </Button>
        </div>

        <Table
          data={viewModel.filteredGeneralCustomers}
          columns={columns}
          isLoading={viewModel.isLoading}
        />
        <Pagination
          currentPage={viewModel.page}
          hasMore={viewModel.hasMore}
          onPageChange={viewModel.setPage}
        />
      </Card>
    </div>
  );
};
