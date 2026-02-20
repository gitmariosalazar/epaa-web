import React from 'react';
import { Card } from '@/shared/presentation/components/Card/Card';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Table } from '@/shared/presentation/components/Table/Table';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Pagination } from '@/shared/presentation/components/Pagination/Pagination';
import { Plus, Search, RefreshCw, Trash2, Edit2 } from 'lucide-react';
import { useCompaniesViewModel } from '../hooks/useCompaniesViewModel';
import { CompanyForm } from '../components/CompanyForm';
import type { Column } from '@/shared/presentation/components/Table/Table';
import type { Company } from '../../domain/models/Company';

export const CompaniesPage: React.FC = () => {
  const companyVM = useCompaniesViewModel();

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
      <div className="users-page__header">
        <h1>Companies Management</h1>
        <Button
          onClick={() => companyVM.setIsFormOpen(true)}
          leftIcon={<Plus size={20} />}
        >
          New Company
        </Button>
      </div>

      <Card className="users-page__content">
        <div className="users-page__toolbar">
          <div className="users-page__search">
            <Search size={20} color="var(--text-secondary)" />
            <Input
              placeholder="Search companies..."
              value={companyVM.searchTerm}
              onChange={(e) => companyVM.setSearchTerm(e.target.value)}
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
          data={companyVM.filteredCompanies}
          columns={companyColumns}
          isLoading={companyVM.isLoading}
        />
        <Pagination
          currentPage={companyVM.page}
          hasMore={companyVM.hasMore}
          onPageChange={companyVM.setPage}
        />
      </Card>

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
