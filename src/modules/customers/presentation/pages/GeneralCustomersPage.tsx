import React from 'react';
import { Card } from '@/shared/presentation/components/Card/Card';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Table } from '@/shared/presentation/components/Table/Table';
import { Pagination } from '@/shared/presentation/components/Pagination/Pagination';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Search, RefreshCw, Edit2, Trash2, Plus, Eye } from 'lucide-react';
import { useGeneralCustomersViewModel } from '../hooks/useGeneralCustomersViewModel';
import type { Column } from '@/shared/presentation/components/Table/Table';
import type { GeneralCustomer } from '../../domain/models/GeneralCustomer';
import { CustomerForm } from '../components/CustomerForm';
import { CompanyForm } from '../components/CompanyForm';
import { CustomerDetails } from '../components/CustomerDetails';
import { CompanyDetails } from '../components/CompanyDetails';

export const GeneralCustomersPage: React.FC = () => {
  const viewModel = useGeneralCustomersViewModel();

  const columns: Column<GeneralCustomer>[] = [
    { header: 'ID / RUC', accessor: 'customerId' },
    { header: 'Name / Reason', accessor: 'customerName' },
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
    },
    {
      header: 'Actions',
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
            title="View Details"
          >
            <Eye size={14} color="var(--text-secondary)" />
          </Button>
          <Button
            size="sm"
            variant="action"
            circle
            onClick={() => viewModel.handleEdit(row, false)}
            title="Edit"
          >
            <Edit2 size={14} color="var(--text-secondary)" />
          </Button>
          <Button
            size="sm"
            variant="action"
            circle
            onClick={() => viewModel.promptDelete(row)}
            title="Delete"
          >
            <Trash2 size={14} color="var(--error)" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="users-page">
      <div className="users-page__header">
        <h1>General Customers</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            onClick={() => {
              viewModel.setIsViewOnly(false);
              viewModel.setIsCustomerFormOpen(true);
            }}
            leftIcon={<Plus size={18} />}
          >
            New Client
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              viewModel.setIsViewOnly(false);
              viewModel.setIsCompanyFormOpen(true);
            }}
            leftIcon={<Plus size={18} />}
          >
            New Company
          </Button>
        </div>
      </div>

      <Card className="users-page__content">
        <div className="users-page__toolbar">
          <div className="users-page__search">
            <Search size={20} color="var(--text-secondary)" />
            <Input
              placeholder="Search by name, ID or RUC..."
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

      {/* Customer Modal */}
      <Modal
        isOpen={viewModel.isCustomerFormOpen}
        onClose={() => viewModel.setIsCustomerFormOpen(false)}
        title={
          viewModel.isViewOnly
            ? 'Client Details'
            : viewModel.selectedCustomer
              ? 'Edit Client'
              : 'New Client'
        }
        size={viewModel.isViewOnly ? 'lg' : 'xl'}
        footer={
          <div className="users-modal__footer--end">
            <Button
              variant={viewModel.isViewOnly ? 'primary' : 'outline'}
              onClick={() => viewModel.setIsCustomerFormOpen(false)}
            >
              {viewModel.isViewOnly ? 'Close' : 'Cancel'}
            </Button>
            {!viewModel.isViewOnly && (
              <Button
                onClick={
                  viewModel.selectedCustomer
                    ? viewModel.handleUpdateCustomer
                    : viewModel.handleCreateCustomer
                }
              >
                Save
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
            ? 'Company Details'
            : viewModel.selectedCompany
              ? 'Edit Company'
              : 'New Company'
        }
        size={viewModel.isViewOnly ? 'lg' : 'xl'}
        footer={
          <div className="users-modal__footer--end">
            <Button
              variant={viewModel.isViewOnly ? 'primary' : 'outline'}
              onClick={() => viewModel.setIsCompanyFormOpen(false)}
            >
              {viewModel.isViewOnly ? 'Close' : 'Cancel'}
            </Button>
            {!viewModel.isViewOnly && (
              <Button
                onClick={
                  viewModel.selectedCompany
                    ? viewModel.handleUpdateCompany
                    : viewModel.handleCreateCompany
                }
              >
                Save
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
        title="Confirm Deletion"
        size="sm"
        footer={
          <div className="users-modal__footer--end">
            <Button
              variant="outline"
              onClick={() => viewModel.setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="users-modal__btn-danger"
              onClick={viewModel.handleDelete}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p>
          Are you sure you want to delete{' '}
          <strong>{viewModel.generalCustomerToDelete?.customerName}</strong>?
        </p>
      </Modal>
    </div>
  );
};
