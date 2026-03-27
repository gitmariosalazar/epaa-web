import React from 'react';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Table } from '@/shared/presentation/components/Table/Table';
import { Pagination } from '@/shared/presentation/components/Pagination/Pagination';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Edit2, Trash2, Plus, Eye, SearchX } from 'lucide-react';
import '@/shared/presentation/styles/Table.css';
import { useGeneralCustomersViewModel } from '../hooks/useGeneralCustomersViewModel';
import type { Column } from '@/shared/presentation/components/Table/Table';
import type { GeneralCustomer } from '../../domain/models/GeneralCustomer';
import { CustomerForm } from '../components/CustomerForm';
import { CompanyForm } from '../components/CompanyForm';
import { CustomerDetails } from '../components/CustomerDetails';
import { CompanyDetails } from '../components/CompanyDetails';
import { CustomerFilters } from '../components/CustomerFilters';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { useTranslation } from 'react-i18next';

export const GeneralCustomersPage: React.FC = () => {
  const viewModel = useGeneralCustomersViewModel();
  const { t } = useTranslation();

  const columns: Column<GeneralCustomer>[] = [
    {
      header: t('customers.columns.nameReason'),
      accessor: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar
            name={row.customerName.trim() === '' ? 'S/N' : row.customerName}
            size="sm"
          />
          <div>
            <div style={{ fontWeight: 300 }}>{row.customerName}</div>
            <div style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>
              {row.customerId}
            </div>
          </div>
        </div>
      )
    },
    { header: t('customers.columns.type'), accessor: 'identificationType' },
    { header: t('customers.columns.address'), accessor: 'customerAddress' },
    {
      header: t('customers.columns.email'),
      accessor: (row) => {
        const email = row.emails?.[0];
        if (typeof email === 'string') return email;
        return email?.correo || 'N/A';
      }
    },
    {
      header: t('customers.columns.phone'),
      accessor: (row) => {
        const phone = row.phoneNumbers?.[0];
        if (typeof phone === 'string') return phone;
        return phone?.numero || 'N/A';
      }
    },
    {
      header: t('customers.columns.actions'),
      accessor: (row) => (
        <div
          className="users-page__actions"
          style={{ display: 'flex', gap: '8px' }}
        >
          <Button
            size="sm"
            variant="action"
            circle
            onClick={() => viewModel.handleEdit(row, true)}
            title={t('customers.actions.viewDetails')}
          >
            <Eye size={14} color="var(--text-secondary)" />
          </Button>
          <Button
            size="sm"
            variant="action"
            circle
            onClick={() => viewModel.handleEdit(row, false)}
            title={t('customers.actions.edit')}
          >
            <Edit2 size={14} color="var(--text-secondary)" />
          </Button>
          <Button
            size="sm"
            variant="action"
            circle
            onClick={() => viewModel.promptDelete(row)}
            title={t('customers.actions.delete')}
          >
            <Trash2 size={14} color="var(--error)" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <PageLayout
      className="users-page"
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <h1 style={{ margin: 0 }}>{t('customers.pageTitle')}</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              onClick={() => {
                viewModel.setIsViewOnly(false);
                viewModel.setIsCustomerFormOpen(true);
              }}
              leftIcon={<Plus size={18} />}
            >
              {t('customers.newClient')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                viewModel.setIsViewOnly(false);
                viewModel.setIsCompanyFormOpen(true);
              }}
              leftIcon={<Plus size={18} />}
            >
              {t('customers.newCompany')}
            </Button>
          </div>
        </div>
      }
      filters={
        <CustomerFilters
          searchTerm={viewModel.searchTerm}
          onSearchTermChange={viewModel.setSearchTerm}
          onRefresh={() => window.location.reload()}
          isLoading={viewModel.isLoading}
        />
      }
    >
      <div className="table-responsive-wrapper" style={{ flex: 1, minHeight: '450px', display: 'flex', flexDirection: 'column' }}>
        <Table
          data={viewModel.filteredGeneralCustomers}
          columns={columns}
          isLoading={viewModel.isLoading}
          emptyState={
            <EmptyState
              message={t('common.noResults', 'No se encontraron resultados')}
              icon={SearchX}
              minHeight="300px"
            />
          }
        />
        <Pagination
          currentPage={viewModel.page}
          hasMore={viewModel.hasMore}
          onPageChange={viewModel.setPage}
        />
      </div>

      {/* Customer Modal */}
      <Modal
        isOpen={viewModel.isCustomerFormOpen}
        onClose={() => viewModel.setIsCustomerFormOpen(false)}
        title={
          viewModel.isViewOnly
            ? t('customers.modals.clientDetails')
            : viewModel.selectedCustomer
              ? t('customers.modals.editClient')
              : t('customers.modals.newClient')
        }
        size={viewModel.isViewOnly ? 'lg' : 'xl'}
        footer={
          <div className="users-modal__footer--end">
            <Button
              variant={viewModel.isViewOnly ? 'primary' : 'outline'}
              onClick={() => viewModel.setIsCustomerFormOpen(false)}
            >
              {viewModel.isViewOnly
                ? t('common.close', 'Close')
                : t('common.cancel', 'Cancel')}
            </Button>
            {!viewModel.isViewOnly && (
              <Button
                onClick={
                  viewModel.selectedCustomer
                    ? viewModel.handleUpdateCustomer
                    : viewModel.handleCreateCustomer
                }
              >
                {t('common.save', 'Save')}
              </Button>
            )}
          </div>
        }
      >
        {viewModel.isViewOnly ? (
          <CustomerDetails customer={viewModel.customerFormData} />
        ) : (
          <CustomerForm
            formData={viewModel.customerFormData}
            onChange={viewModel.handleCustomerInputChange}
            setFormData={viewModel.setCustomerFormData}
            isEditMode={!!viewModel.selectedCustomer}
            isViewOnly={viewModel.isViewOnly}
          />
        )}
      </Modal>

      {/* Company Modal */}
      <Modal
        isOpen={viewModel.isCompanyFormOpen}
        onClose={() => viewModel.setIsCompanyFormOpen(false)}
        title={
          viewModel.isViewOnly
            ? t('customers.modals.companyDetails')
            : viewModel.selectedCompany
              ? t('customers.modals.editCompany')
              : t('customers.modals.newCompany')
        }
        size={viewModel.isViewOnly ? 'lg' : 'xl'}
        footer={
          <div className="users-modal__footer--end">
            <Button
              variant={viewModel.isViewOnly ? 'primary' : 'outline'}
              onClick={() => viewModel.setIsCompanyFormOpen(false)}
            >
              {viewModel.isViewOnly
                ? t('common.close', 'Close')
                : t('common.cancel', 'Cancel')}
            </Button>
            {!viewModel.isViewOnly && (
              <Button
                onClick={
                  viewModel.selectedCompany
                    ? viewModel.handleUpdateCompany
                    : viewModel.handleCreateCompany
                }
              >
                {t('common.save', 'Save')}
              </Button>
            )}
          </div>
        }
      >
        {viewModel.isViewOnly ? (
          <CompanyDetails company={viewModel.companyFormData} />
        ) : (
          <CompanyForm
            formData={viewModel.companyFormData}
            onChange={viewModel.handleCompanyInputChange}
            setFormData={viewModel.setCompanyFormData}
            isEditMode={!!viewModel.selectedCompany}
            isViewOnly={viewModel.isViewOnly}
          />
        )}
      </Modal>

      {/* Generic Delete Modal */}
      <Modal
        isOpen={viewModel.isDeleteOpen}
        onClose={() => viewModel.setIsDeleteOpen(false)}
        title={t('customers.modals.confirmDelete')}
        size="sm"
        footer={
          <div className="users-modal__footer--end">
            <Button
              variant="outline"
              onClick={() => viewModel.setIsDeleteOpen(false)}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              className="users-modal__btn-danger"
              onClick={viewModel.handleDelete}
            >
              {t('customers.actions.delete')}
            </Button>
          </div>
        }
      >
        <p>
          {t('customers.modals.deleteMessage')}{' '}
          <strong>{viewModel.generalCustomerToDelete?.customerName}</strong>?
        </p>
      </Modal>
    </PageLayout>
  );
};
