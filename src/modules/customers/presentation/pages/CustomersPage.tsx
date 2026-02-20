import React, { useState } from 'react';
import { Tabs } from '@/shared/presentation/components/common/Tabs';
import { Card } from '@/shared/presentation/components/Card/Card';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Table } from '@/shared/presentation/components/Table/Table'; // Generic table
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Pagination } from '@/shared/presentation/components/Pagination/Pagination';
import { Plus, Search, RefreshCw, Trash2, Edit2 } from 'lucide-react';
import { CustomersProvider } from '../context/CustomersContext';
import { useCustomersViewModel } from '../hooks/useCustomersViewModel';
import { useCompaniesViewModel } from '../hooks/useCompaniesViewModel';
import { CustomerForm } from '../components/CustomerForm';
import { CompanyForm } from '../components/CompanyForm';
import type { Column } from '@/shared/presentation/components/Table/Table';
import type { Customer } from '../../domain/models/Customer';
import type { Company } from '../../domain/models/Company';

// Layout Component
const CustomersLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'person' | 'company'>('person');

  // View Models
  const customerVM = useCustomersViewModel();
  const companyVM = useCompaniesViewModel();

  const tabs = [
    { id: 'person', label: 'Natural Persons' },
    { id: 'company', label: 'Companies' }
  ];

  // Columns - Customers
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

  // Columns - Companies
  const companyColumns: Column<Company>[] = [
    { header: 'RUC', accessor: 'companyRuc' },
    { header: 'Company Name', accessor: 'companyName' },
    {
      header: 'Email',
      accessor: (row) => row.companyEmails?.[0]?.correo || 'N/A'
    },
    {
      header: 'Phone',
      accessor: (row) => row.companyPhones?.[0]?.numero || 'N/A'
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            size="sm"
            variant="ghost"
            circle
            onClick={() => companyVM.openEdit(row)}
          >
            <Edit2 size={16} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            circle
            onClick={() => {
              companyVM.setSelectedCompany(row);
              companyVM.setIsDeleteOpen(true);
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
      {/* Reusing users-page layout styles */}
      <div className="users-page__header">
        <h1>Customers Management</h1>
        <Button
          onClick={() =>
            activeTab === 'person'
              ? customerVM.setIsFormOpen(true)
              : companyVM.setIsFormOpen(true)
          }
          leftIcon={<Plus size={20} />}
        >
          New {activeTab === 'person' ? 'Client' : 'Company'}
        </Button>
      </div>

      <div style={{ padding: '0 24px', marginBottom: '24px' }}>
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as 'person' | 'company')}
        />
      </div>

      <Card className="users-page__content">
        <div className="users-page__toolbar">
          <div className="users-page__search">
            <Search size={20} color="var(--text-secondary)" />
            <Input
              placeholder={`Search ${activeTab === 'person' ? 'customers' : 'companies'}...`}
              value={
                activeTab === 'person'
                  ? customerVM.searchTerm
                  : companyVM.searchTerm
              }
              onChange={(e) =>
                activeTab === 'person'
                  ? customerVM.setSearchTerm(e.target.value)
                  : companyVM.setSearchTerm(e.target.value)
              }
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

        {activeTab === 'person' ? (
          <>
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
          </>
        ) : (
          <>
            <Table
              data={companyVM.filteredCompanies}
              columns={companyColumns}
              isLoading={companyVM.isLoading}
            />
            <Pagination
              currentPage={companyVM.page}
              hasMore={companyVM.hasMore}
              onPageChange={companyVM.setPage}
            />
          </>
        )}
      </Card>
      {/* Modals for Natural Person */}
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
      {/* Modals for Company */}
      <Modal
        isOpen={companyVM.isFormOpen}
        onClose={() => companyVM.setIsFormOpen(false)}
        title={companyVM.selectedCompany ? 'Edit Company' : 'New Company'}
        size="lg"
        footer={
          <div className="users-modal__footer--end">
            <Button
              variant="outline"
              onClick={() => companyVM.setIsFormOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={
                companyVM.selectedCompany
                  ? companyVM.handleUpdate
                  : companyVM.handleCreate
              }
            >
              Save
            </Button>
          </div>
        }
      >
        <CompanyForm
          formData={companyVM.formData}
          onChange={companyVM.handleInputChange}
          setFormData={companyVM.setFormData}
          isEditMode={!!companyVM.selectedCompany}
        />
      </Modal>
      <Modal
        isOpen={companyVM.isDeleteOpen}
        onClose={() => companyVM.setIsDeleteOpen(false)}
        title="Confirm Deletion"
        size="sm"
        footer={
          <div className="users-modal__footer--end">
            <Button
              variant="outline"
              onClick={() => companyVM.setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: 'var(--error)', color: 'white' }}
              onClick={companyVM.handleDelete}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p>
          Are you sure you want to delete{' '}
          <strong>{companyVM.selectedCompany?.companyName}</strong>?
        </p>
      </Modal>
    </div>
  );
};

export const CustomersPage: React.FC = () => {
  return (
    <CustomersProvider>
      <CustomersLayout />
    </CustomersProvider>
  );
};
