import React from 'react';
import type { Role } from '@/modules/roles/domain/models/Role';
import { RolePermissionModal } from '@/shared/presentation/components/Roles/RolePermissionModal';
import { Table } from '@/shared/presentation/components/Table/Table';
import type { Column } from '@/shared/presentation/components/Table/Table';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Input } from '@/shared/presentation/components/Input/Input';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { Edit2 } from 'lucide-react';
import { RolesFilters } from '../../components/RolesFilters';
import '@/shared/presentation/styles/Table.css';
import '@/modules/accounting/presentation/styles/entry-data/EntryDataFilters.css';
import '@/shared/presentation/styles/Roles.css';
import { MdAdd, MdClose, MdLockOpen } from 'react-icons/md';
import { useRolesViewModel } from '../../hooks/useRolesViewModel';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

export const RolesPage: React.FC = () => {
  const {
    loading,
    searchTerm,
    isCreateOpen,
    isPermissionOpen,
    selectedRole,
    formData,
    filteredRoles,
    setSearchTerm,
    setIsCreateOpen,
    setIsPermissionOpen,
    setFormData,
    handleSave,
    handleDelete,
    openEdit,
    openPermissions,
    resetForm,
    refresh
  } = useRolesViewModel();

  const { t } = useTranslation();

  const columns: Column<Role>[] = [
    { header: 'ID', accessor: 'rolId' },
    { header: 'Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    {
      header: 'Active',
      accessor: (role) => (
        <span
          className={
            role.isActive
              ? 'profile-page__status-active'
              : 'profile-page__status-inactive'
          }
        >
          {role.isActive ? 'Active' : 'Disabled'}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: (role) => (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}
        >
          <Button
            size="sm"
            variant="ghost"
            title="Add Permission"
            onClick={() => openPermissions(role)}
            circle
            style={{ color: 'var(--success)' }}
          >
            <MdAdd size={16} />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => openEdit(role)}
            title="Edit Role"
            circle
            style={{ color: 'var(--blue)' }}
          >
            <Edit2 size={16} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => openPermissions(role)}
            title="View Permissions"
            circle
            style={{ color: 'var(--orange)' }}
          >
            <MdLockOpen size={16} />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            title="Remove Role"
            onClick={() => handleDelete(role)}
            circle
            style={{ color: 'var(--error)' }}
          >
            <MdClose size={16} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <PageLayout
      className="roles-page"
      filters={
        <RolesFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onRefresh={refresh}
          onCreateClick={() => {
            resetForm();
            setIsCreateOpen(true);
          }}
        />
      }
    >
      <div
        className="table-responsive-wrapper"
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Table
          data={filteredRoles}
          columns={columns}
          isLoading={loading}
          pagination={true}
          pageSize={10}
          emptyState={
            <EmptyState
              message="No se encontraron roles"
              icon={IoInformationCircleOutline}
              description={t(
                'common.noResultsDescription',
                'Intenta ajustar los filtros de búsqueda para ver los resultados.'
              )}
              minHeight="300px"
              variant="info"
            />
          }
        />
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={selectedRole ? 'Edit Role' : 'Create Role'}
        footer={
          <>
            <Button variant="subtle" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Description"
            value={formData.description || ''}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          {selectedRole && (
            <label
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
              Active
            </label>
          )}
        </div>
      </Modal>

      <RolePermissionModal
        isOpen={isPermissionOpen}
        onClose={() => setIsPermissionOpen(false)}
        role={selectedRole}
      />
    </PageLayout>
  );
};
