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
import { Edit2, Plus, Search, SearchX } from 'lucide-react';
import '@/shared/presentation/styles/Table.css';
import '@/modules/accounting/presentation/styles/EntryDataFilters.css';
import '@/shared/presentation/styles/Roles.css';
import { MdAdd, MdClose, MdLockOpen } from 'react-icons/md';
import { useRolesViewModel } from '../../hooks/useRolesViewModel';

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
    resetForm
  } = useRolesViewModel();

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
      header={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <div className="roles-header" style={{ marginBottom: 0 }}>
            <h1 style={{ margin: 0 }}>Roles</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              Manage role access and details
            </p>
          </div>
          <Button
            leftIcon={<Plus size={18} />}
            onClick={() => {
              resetForm();
              setIsCreateOpen(true);
            }}
          >
            Create Role
          </Button>
        </div>
      }
      filters={
        <div className="entry-filters">
          <div className="entry-filter-group entry-filter-group--search">
            <label
              className="entry-filter-label"
              style={{ visibility: 'hidden' }}
            >
              Search
            </label>
            <div className="entry-filter-input-wrapper">
              <Input
                type="text"
                className="entry-filter-input"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="Search roles..."
                value={searchTerm}
                leftIcon={<Search size={18} />}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
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
              icon={SearchX}
              minHeight="300px"
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
