import React from 'react';
import { Card } from '@/shared/presentation/components/Card/Card';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Table } from '@/shared/presentation/components/Table/Table';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Pagination } from '@/shared/presentation/components/Pagination/Pagination';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useCompaniesViewModel } from '../hooks/useCompaniesViewModel';
import { CompanyForm } from '../components/CompanyForm';
import { CustomerFilters } from '../components/CustomerFilters';
import type { Column } from '@/shared/presentation/components/Table/Table';
import type { Company } from '../../domain/models/Company';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

export const CompaniesPage: React.FC = () => {
  const companyVM = useCompaniesViewModel();
  const { t } = useTranslation();

  const companyColumns = useMemo<Column<Company>[]>(
    () => [
      {
        header: t('customers.form.companyName'),
        accessor: (row) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar name={row.companyName || 'S/N'} size="sm" />
            <div>
              <div style={{ fontWeight: 300 }}>{row.companyName}</div>
              <div
                style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}
              >
                {row.companyRuc}
              </div>
            </div>
          </div>
        )
      },
      {
        header: t('customers.form.email'),
        accessor: (row) => row.companyEmails?.[0]?.correo || 'N/A'
      },
      {
        header: t('customers.form.phone'),
        accessor: (row) => row.companyPhones?.[0]?.numero || 'N/A'
      },
      {
        header: t('common.actions'),
        accessor: (row) => (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              size="sm"
              variant="action"
              circle
              onClick={() => companyVM.openEdit(row)}
              title={t('common.edit')}
            >
              <Edit2 size={14} color="var(--text-secondary)" />
            </Button>
            <Button
              size="sm"
              variant="action"
              circle
              onClick={() => {
                companyVM.setSelectedCompany(row);
                companyVM.setIsDeleteOpen(true);
              }}
              title={t('common.delete')}
            >
              <Trash2 size={14} color="var(--error)" />
            </Button>
          </div>
        )
      }
    ],
    [t, companyVM]
  );

  return (
    <div className="users-page">
      <div className="users-page__header">
        <h1>{t('sidebar.companies')}</h1>
        <Button
          onClick={() => companyVM.setIsFormOpen(true)}
          leftIcon={<Plus size={20} />}
        >
          {t('customers.newCompany')}
        </Button>
      </div>

      <Card className="users-page__content">
        <CustomerFilters
          searchTerm={companyVM.searchTerm}
          onSearchTermChange={companyVM.setSearchTerm}
          searchType={companyVM.searchType}
          onSearchTypeChange={companyVM.setSearchType}
          searchOptions={[
            { value: 'all', label: t('customers.filters.allFields') },
            { value: 'name', label: t('customers.filters.nameOrSocialReason') },
            { value: 'id', label: t('customers.form.ruc') },
            { value: 'email', label: t('customers.form.email') },
            { value: 'phone', label: t('customers.form.phone') }
          ]}
          onRefresh={() => window.location.reload()}
          isLoading={companyVM.isLoading}
        />

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
        title={
          companyVM.selectedCompany
            ? t('customers.modals.editCompany')
            : t('customers.newCompany')
        }
        size="xl"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => companyVM.setIsFormOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={
                companyVM.selectedCompany
                  ? companyVM.handleUpdate
                  : companyVM.handleCreate
              }
            >
              {t('common.save')}
            </Button>
          </>
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
        title={t('customers.modals.confirmDelete')}
        size="sm"
        footer={
          <div className="users-modal__footer--end">
            <Button
              variant="outline"
              onClick={() => companyVM.setIsDeleteOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              style={{ backgroundColor: 'var(--error)', color: 'white' }}
              onClick={companyVM.handleDelete}
            >
              {t('common.delete')}
            </Button>
          </div>
        }
      >
        <p>
          {t('customers.modals.deleteMessage')}{' '}
          <strong>{companyVM.selectedCompany?.companyName}</strong>?
        </p>
      </Modal>
    </div>
  );
};
