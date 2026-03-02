import React from 'react';
import type { Permission } from '@/modules/permissions/domain/models/Permission';
import { Table } from '@/shared/presentation/components/Table/Table';
import type { Column } from '@/shared/presentation/components/Table/Table';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Card } from '@/shared/presentation/components/Card/Card';
import { Edit2, Plus, Trash2, Search, Check, X } from 'lucide-react';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
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
    <div className="permissions-page">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 'var(--spacing-lg)'
        }}
      >
        <div className="permissions-header">
          <h1>Permissions</h1>
          <p>Manage permission access and details</p>
        </div>
        <Button leftIcon={<Plus size={18} />} onClick={openCreate}>
          Create Permission
        </Button>
      </div>

      <Card>
        <div
          style={{
            padding: 'var(--spacing-md)',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '300px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)'
              }}
            />
            <input
              type="text"
              placeholder="Search permissions..."
              style={{
                width: '100%',
                padding: '8px 10px 8px 36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--surface)',
                color: 'var(--text-main)',
                outline: 'none'
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Table data={permissions} columns={columns} isLoading={isLoading} />
      </Card>

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
    </div>
  );
};
