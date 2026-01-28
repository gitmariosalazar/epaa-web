import React, { useEffect, useState } from 'react';
import type { Role } from '@/modules/roles/domain/models/Role';
import { GetRolesUseCase } from '@/modules/roles/application/usecases/GetRolesUseCase';
import { CreateRoleUseCase } from '@/modules/roles/application/usecases/CreateRoleUseCase';
import { UpdateRoleUseCase } from '@/modules/roles/application/usecases/UpdateRoleUseCase';
import { RoleRepositoryImpl } from '@/modules/roles/infrastructure/repositories/RoleRepositoryImpl';
import { RolePermissionModal } from '@/shared/presentation/components/Roles/RolePermissionModal';
import { Table } from '@/shared/presentation/components/Table/Table';
import type { Column } from '@/shared/presentation/components/Table/Table';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Card } from '@/shared/presentation/components/Card/Card';
import { Edit2, Plus, Search } from 'lucide-react';
import '@/shared/presentation/styles/Roles.css';
import { MdAdd, MdClose, MdLockOpen } from 'react-icons/md';

export const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPermissionOpen, setIsPermissionOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<Partial<Role>>({
    name: '',
    description: '',
    isActive: true
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Dependencies
  const repo = new RoleRepositoryImpl();
  const getRoles = new GetRolesUseCase(repo);
  const createRole = new CreateRoleUseCase(repo);
  const updateRole = new UpdateRoleUseCase(repo);

  const loadRoles = async () => {
    setIsLoading(true);
    try {
      const data = await getRoles.execute(100, 0);
      setRoles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleSave = async () => {
    try {
      if (selectedRole) {
        // Update
        await updateRole.execute(selectedRole.rolId, formData);
      } else {
        // Create
        await createRole.execute({
          name: formData.name!,
          description: formData.description || '',
          isActive: formData.isActive ?? true,
          rolId: 0
        });
      }
      setIsCreateOpen(false);
      setFormData({ name: '', description: '', isActive: true });
      setSelectedRole(null);
      loadRoles();
    } catch (error) {
      console.error('Failed to save role', error);
      alert('Failed to save role');
    }
  };

  const openEdit = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      isActive: role.isActive
    });
    setIsCreateOpen(true);
  };

  const openPermissions = (role: Role) => {
    setSelectedRole(role);
    setIsPermissionOpen(true);
  };

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
            onClick={() => openPermissions(role)} // Reusing openPermissions for now as entry point
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
            onClick={() => {
              if (confirm('Are you sure you want to delete this role?')) {
                alert('Delete logic here');
              }
            }}
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
    <div className="roles-page">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 'var(--spacing-lg)'
        }}
      >
        <div className="roles-header">
          <h1>Roles</h1>
          <p>Manage role access and details</p>
        </div>
        <Button
          leftIcon={<Plus size={18} />}
          onClick={() => {
            setSelectedRole(null);
            setFormData({ name: '', description: '', isActive: true });
            setIsCreateOpen(true);
          }}
        >
          Create Role
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
              placeholder="Search roles..."
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
          data={roles.filter(
            (r) =>
              r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              r.description.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          columns={columns}
          isLoading={isLoading}
        />
      </Card>

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
    </div>
  );
};
