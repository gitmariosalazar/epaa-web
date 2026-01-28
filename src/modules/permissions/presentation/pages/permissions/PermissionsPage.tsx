import React, { useEffect, useState } from 'react';
import type { Permission } from '@/modules/permissions/domain/models/Permission';
import { GetPermissionsUseCase } from '@/modules/permissions/application/usecases/GetPermissionsUseCase';
import { CreatePermissionUseCase } from '@/modules/permissions/application/usecases/CreatePermissionUseCase';
import { UpdatePermissionUseCase } from '@/modules/permissions/application/usecases/UpdatePermissionUseCase';
import { DeletePermissionUseCase } from '@/modules/permissions/application/usecases/DeletePermissionUseCase';
import { PermissionRepositoryImpl } from '@/modules/permissions/infrastructure/repositories/PermissionRepositoryImpl';
import { Table } from '@/shared/presentation/components/Table/Table';
import type { Column } from '@/shared/presentation/components/Table/Table';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Card } from '@/shared/presentation/components/Card/Card';
import { Edit2, Plus, Trash2, Search, Check, X } from 'lucide-react';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import '@/shared/presentation/styles/Permission.css';

export const PermissionsPage: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPerm, setSelectedPerm] = useState<Permission | null>(null);
  const [formData, setFormData] = useState<Partial<Permission>>({
    permissionName: '',
    permissionDescription: '',
    categoryId: '',
    isActive: true
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Dependencies
  const repo = new PermissionRepositoryImpl();
  const getPermissions = new GetPermissionsUseCase(repo);
  const createPermission = new CreatePermissionUseCase(repo);
  const updatePermission = new UpdatePermissionUseCase(repo);
  const deletePermission = new DeletePermissionUseCase(repo);

  const loadPermissions = async () => {
    setIsLoading(true);
    try {
      const data = await getPermissions.execute();
      setPermissions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  const handleSave = async () => {
    try {
      if (selectedPerm) {
        await updatePermission.execute(selectedPerm.permissionId, formData);
      } else {
        await createPermission.execute({
          permissionName: formData.permissionName!,
          permissionDescription: formData.permissionDescription || '',
          categoryId: formData.categoryId || 'General',
          isActive: true
        });
      }
      setIsCreateOpen(false);
      setFormData({
        permissionName: '',
        permissionDescription: '',
        categoryId: '',
        isActive: true
      });
      setSelectedPerm(null);
      loadPermissions();
    } catch (error) {
      console.error('Failed to save permission', error);
      alert('Failed to save permission');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this permission?')) return;
    try {
      await deletePermission.execute(id);
      loadPermissions();
    } catch (error) {
      console.error('Failed to delete', error);
      alert('Failed to delete permission');
    }
  };

  const openEdit = (perm: Permission) => {
    setSelectedPerm(perm);
    setFormData({
      permissionName: perm.permissionName,
      permissionDescription: perm.permissionDescription,
      categoryId: perm.categoryId,
      isActive: perm.isActive
    });
    setIsCreateOpen(true);
  };

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
        <Button
          leftIcon={<Plus size={18} />}
          onClick={() => {
            setSelectedPerm(null);
            setFormData({
              permissionName: '',
              permissionDescription: '',
              categoryId: '',
              isActive: true
            });
            setIsCreateOpen(true);
          }}
        >
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
        <Table
          data={permissions.filter(
            (p) =>
              (p.permissionName?.toLowerCase() || '').includes(
                searchTerm.toLowerCase()
              ) ||
              (p.permissionDescription?.toLowerCase() || '').includes(
                searchTerm.toLowerCase()
              ) ||
              (p.categoryId?.toLowerCase() || '').includes(
                searchTerm.toLowerCase()
              )
          )}
          columns={columns}
          isLoading={isLoading}
        />
      </Card>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={selectedPerm ? 'Edit Permission' : 'Create Permission'}
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
