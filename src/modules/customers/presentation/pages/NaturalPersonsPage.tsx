import React from 'react';
import { Card } from '@/shared/presentation/components/Card/Card';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Table } from '@/shared/presentation/components/Table/Table';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Pagination } from '@/shared/presentation/components/Pagination/Pagination';
import { Plus, Search, RefreshCw, Trash2, Edit2 } from 'lucide-react';
import { useCustomersViewModel } from '../hooks/useCustomersViewModel';
import { CustomerForm } from '../components/CustomerForm';
import type { Column } from '@/shared/presentation/components/Table/Table';
import type { Customer } from '../../domain/models/Customer';

export const NaturalPersonsPage: React.FC = () => {
  const customerVM = useCustomersViewModel();

  const customerColumns: Column<Customer>[] = [
    { header: 'ID', accessor: 'customerId' },
    { header: 'Name', accessor: (row) => `${row.firstName} ${row.lastName}` },
    { header: 'Email', accessor: (row) => row.emails?.[0] || 'N/A' },
    { header: 'Phone', accessor: (row) => row.phoneNumbers?.[0] || 'N/A' },
    {
      header: 'Actions',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            size="sm"
            variant="ghost"
            circle
            onClick={() => customerVM.openEdit(row)}
          >
            <Edit2 size={16} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            circle
            onClick={() => {
              customerVM.setSelectedCustomer(row);
              customerVM.setIsDeleteOpen(true);
            }}
            style={{ color: 'var(--error)' }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="users-page">
      <div className="users-page__header">
        <h1>Natural Persons Management</h1>
        <Button
          onClick={() => customerVM.setIsFormOpen(true)}
          leftIcon={<Plus size={20} />}
        >
          New Client
        </Button>
      </div>

      <Card className="users-page__content">
        <div className="users-page__toolbar">
          <div className="users-page__search">
            <Search size={20} color="var(--text-secondary)" />
            <Input
              placeholder="Search customers..."
              value={customerVM.searchTerm}
              onChange={(e) => customerVM.setSearchTerm(e.target.value)}
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
          data={customerVM.filteredCustomers}
          columns={customerColumns}
          isLoading={customerVM.isLoading}
        />
        <Pagination
          currentPage={customerVM.page}
          hasMore={customerVM.hasMore}
          onPageChange={customerVM.setPage}
        />
      </Card>

      <Modal
        isOpen={customerVM.isFormOpen}
        onClose={() => customerVM.setIsFormOpen(false)}
        title={customerVM.selectedCustomer ? 'Edit Client' : 'New Client'}
        size="lg"
        footer={
          <div className="users-modal__footer--end">
            <Button
              variant="outline"
              onClick={() => customerVM.setIsFormOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={
                customerVM.selectedCustomer
                  ? customerVM.handleUpdate
                  : customerVM.handleCreate
              }
            >
              Save
            </Button>
          </div>
        }
      >
        <CustomerForm
          formData={customerVM.formData}
          onChange={customerVM.handleInputChange}
          isEditMode={!!customerVM.selectedCustomer}
        />
      </Modal>

      <Modal
        isOpen={customerVM.isDeleteOpen}
        onClose={() => customerVM.setIsDeleteOpen(false)}
        title="Confirm Deletion"
        size="sm"
        footer={
          <div className="users-modal__footer--end">
            <Button
              variant="outline"
              onClick={() => customerVM.setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: 'var(--error)', color: 'white' }}
              onClick={customerVM.handleDelete}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p>
          Are you sure you want to delete{' '}
          <strong>
            {customerVM.selectedCustomer?.firstName}{' '}
            {customerVM.selectedCustomer?.lastName}
          </strong>
          ?
        </p>
      </Modal>
    </div>
  );
};
