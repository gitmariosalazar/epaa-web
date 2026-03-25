import React from 'react';
import { Card } from '@/shared/presentation/components/Card/Card';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Table } from '@/shared/presentation/components/Table/Table';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Pagination } from '@/shared/presentation/components/Pagination/Pagination';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useCustomersViewModel } from '../hooks/useCustomersViewModel';
import { CustomerForm } from '../components/CustomerForm';
import { CustomerFilters } from '../components/CustomerFilters';
import type { Column } from '@/shared/presentation/components/Table/Table';
import type { Customer } from '../../domain/models/Customer';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

export const NaturalPersonsPage: React.FC = () => {
  const customerVM = useCustomersViewModel();
  const { t } = useTranslation();

  const customerColumns = useMemo<Column<Customer>[]>(
    () => [
      {
        header: t('customers.filters.name'),
        accessor: (row) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar name={row.firstName || 'S/N'} size="sm" />
            <div>
              <div style={{ fontWeight: 300 }}>{row.firstName}</div>
              <div
                style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}
              >
                {row.lastName}
              </div>
            </div>
          </div>
        )
      },
      {
        header: t('customers.form.email'),
        accessor: (row) => row.emails?.[0] || 'N/A'
      },
      {
        header: t('customers.form.phone'),
        accessor: (row) => row.phoneNumbers?.[0] || 'N/A'
      },
      {
        header: t('common.actions'),
        accessor: (row) => (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              size="sm"
              variant="action"
              circle
              onClick={() => customerVM.openEdit(row)}
              title={t('common.edit')}
            >
              <Edit2 size={14} color="var(--text-secondary)" />
            </Button>
            <Button
              size="sm"
              variant="action"
              circle
              onClick={() => {
                customerVM.setSelectedCustomer(row);
                customerVM.setIsDeleteOpen(true);
              }}
              title={t('common.delete')}
            >
              <Trash2 size={14} color="var(--error)" />
            </Button>
          </div>
        )
      }
    ],
    [t, customerVM]
  );

  return (
    <div className="users-page">
      <div className="users-page__header">
        <h1>{t('sidebar.naturalPersons')}</h1>
        <Button
          onClick={() => customerVM.setIsFormOpen(true)}
          leftIcon={<Plus size={20} />}
        >
          {t('customers.newClient')}
        </Button>
      </div>

      <Card className="users-page__content">
        <CustomerFilters
          searchTerm={customerVM.searchTerm}
          onSearchTermChange={customerVM.setSearchTerm}
          searchType={customerVM.searchType}
          onSearchTypeChange={customerVM.setSearchType}
          searchOptions={[
            { value: 'all', label: t('customers.filters.allFields') },
            { value: 'name', label: t('customers.filters.name') },
            { value: 'id', label: t('customers.form.identityId') },
            { value: 'email', label: t('customers.form.email') },
            { value: 'phone', label: t('customers.form.phone') }
          ]}
          onRefresh={() => window.location.reload()}
          isLoading={customerVM.isLoading}
        />

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
        title={
          customerVM.selectedCustomer
            ? t('customers.modals.editClient')
            : t('customers.newClient')
        }
        size="xxl"
        footer={
          <div className="users-modal__footer--end">
            <Button
              variant="outline"
              onClick={() => customerVM.setIsFormOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={
                customerVM.selectedCustomer
                  ? customerVM.handleUpdate
                  : customerVM.handleCreate
              }
            >
              {t('common.save')}
            </Button>
          </div>
        }
      >
        <CustomerForm
          formData={customerVM.formData}
          onChange={customerVM.handleInputChange}
          setFormData={customerVM.setFormData}
          isEditMode={!!customerVM.selectedCustomer}
        />
      </Modal>

      <Modal
        isOpen={customerVM.isDeleteOpen}
        onClose={() => customerVM.setIsDeleteOpen(false)}
        title={t('customers.modals.confirmDelete')}
        size="sm"
        footer={
          <div className="users-modal__footer--end">
            <Button
              variant="outline"
              onClick={() => customerVM.setIsDeleteOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              style={{ backgroundColor: 'var(--error)', color: 'white' }}
              onClick={customerVM.handleDelete}
            >
              {t('common.delete')}
            </Button>
          </div>
        }
      >
        <p>
          {t('customers.modals.deleteMessage')}{' '}
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
