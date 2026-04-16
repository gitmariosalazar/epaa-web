import React from 'react';
import type { Permission } from '@/modules/permissions/domain/models/Permission';
import { Table } from '@/shared/presentation/components/Table/Table';
import type { Column } from '@/shared/presentation/components/Table/Table';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Input } from '@/shared/presentation/components/Input/Input';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { Edit2, Plus, Trash2, Search, Check, X, SearchX } from 'lucide-react';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import '@/shared/presentation/styles/Table.css';
import '@/modules/accounting/presentation/styles/entry-data/EntryDataFilters.css';
import '@/shared/presentation/styles/Permission.css';
import { usePermissionsViewModel } from '../../hooks/usePermissionsViewModel';

export const PermissionsPage: React.FC = () => {
  const {
    permissions,
    isLoading,
    isCreateOpen,
    selectedPerm,
    formData,
    searchTerm,
    setSearchTerm,
    setFormData,
    handleSave,
    handleDelete,
    openEdit,
    openCreate,
    closeCreate
  } = usePermissionsViewModel();

  const columns: Column<Permission>[] = [
    { header: 'ID', accessor: 'permissionId' },
    { header: 'Name', accessor: 'permissionName' },
    { header: 'Description', accessor: 'permissionDescription' },
    {
      header: 'Status',
      accessor: (perm) =>
        perm.isActive ? (
          <ColorChip
            color="var(--success)"
            label="Active"
            size="xs"
            variant="soft"
            icon={<Check size={16} />}
          />
        ) : (
          <ColorChip
            color="var(--error)"
            label="Inactive"
            size="xs"
            variant="soft"
            icon={<X size={16} />}
          />
        )
    },
    {
      header: 'Actions',
      accessor: (perm) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            size="sm"
            variant="ghost"
            circle
            onClick={() => openEdit(perm)}
          >
            <Edit2 size={16} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            circle
            style={{ color: 'var(--error)' }}
            onClick={() => handleDelete(perm.permissionId)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <PageLayout
      className="permissions-page"
      header={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <div className="permissions-header" style={{ marginBottom: 0 }}>
            <h1 style={{ margin: 0 }}>Permissions</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              Manage permission access and details
            </p>
          </div>
          <Button leftIcon={<Plus size={18} />} onClick={openCreate}>
            Create Permission
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
                placeholder="Search permissions..."
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
          data={permissions}
          columns={columns}
          isLoading={isLoading}
          pagination={true}
          pageSize={10}
          emptyState={
            <EmptyState
              message="No se encontraron permisos"
              description="Intenta ajustar los filtros de búsqueda para ver los resultados."
              icon={SearchX}
              minHeight="300px"
              variant="info"
            />
          }
        />
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={closeCreate}
        title={selectedPerm ? 'Edit Permission' : 'Create Permission'}
        footer={
          <>
            <Button variant="subtle" onClick={closeCreate}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Name"
            value={formData.permissionName || ''}
            onChange={(e) =>
              setFormData({ ...formData, permissionName: e.target.value })
            }
            placeholder="MODULE_ACTION"
          />
          <Input
            label="Description"
            value={formData.permissionDescription || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                permissionDescription: e.target.value
              })
            }
          />
          <Input
            label="Module"
            value={formData.categoryId || ''}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: e.target.value })
            }
            placeholder="e.g., Users"
          />
        </div>
      </Modal>
    </PageLayout>
  );
};
