import React, { useEffect, useState } from 'react';
import type { Role } from '@/modules/roles/domain/models/Role';
import type { Permission } from '@/modules/permissions/domain/models/Permission';
import { Modal } from '../Modal/Modal';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { ManageRolePermissionsUseCase } from '@/modules/roles/application/usecases/ManageRolePermissionsUseCase';
import { RolePermissionRepositoryImpl } from '@/modules/roles/infrastructure/repositories/RolePermissionRepositoryImpl';
import { PermissionRepositoryImpl } from '@/modules/permissions/infrastructure/repositories/PermissionRepositoryImpl';
import './RolePermissionModal.css';

interface RolePermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
}

export const RolePermissionModal: React.FC<RolePermissionModalProps> = ({
  isOpen,
  onClose,
  role
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [assignedIds, setAssignedIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Dependencies
  const rolePermissionRepo = new RolePermissionRepositoryImpl();
  const permissionRepo = new PermissionRepositoryImpl();
  const useCase = new ManageRolePermissionsUseCase(
    rolePermissionRepo,
    permissionRepo
  );

  useEffect(() => {
    if (isOpen && role) {
      loadData();
    } else {
      setPermissions([]);
      setAssignedIds(new Set());
      setSearchTerm('');
    }
  }, [isOpen, role]);

  const loadData = async () => {
    if (!role) return;
    setIsLoading(true);
    try {
      const { all, assigned } = await useCase.getRolePermissions(role.rolId);
      setPermissions(all);
      setAssignedIds(new Set(assigned.map((p) => p.permissionId)));
    } catch (error) {
      console.error('Failed to load permissions', error);
      alert('Failed to load permissions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (permissionId: number, currentStatus: boolean) => {
    if (!role) return;
    // Optimistic update
    const newSet = new Set(assignedIds);
    if (currentStatus) {
      newSet.delete(permissionId);
    } else {
      newSet.add(permissionId);
    }
    setAssignedIds(newSet);

    try {
      if (currentStatus) {
        // Removing
        await useCase.removePermission(role.rolId, permissionId);
      } else {
        // Adding
        await useCase.assignPermission(role.rolId, permissionId);
      }
    } catch (error) {
      console.error('Failed to update permission', error);
      // Revert
      setAssignedIds((prev) => {
        const revertSet = new Set(prev);
        if (currentStatus) revertSet.add(permissionId);
        else revertSet.delete(permissionId);
        return revertSet;
      });
      alert('Failed to save assignment');
    }
  };

  const filteredPermissions = permissions.filter(
    (p) =>
      (p.permissionName?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      ) ||
      (p.permissionDescription?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      )
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manage Permissions: ${role?.name}`}
      size="lg"
      footer={<Button onClick={onClose}>Done</Button>}
    >
      <div className="role-permission-modal">
        <div className="role-permission__search">
          <Input
            name="search"
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // icon={<Search size={16}/>}
          />
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="role-permission__list">
            {filteredPermissions.map((perm, index) => {
              const isAssigned = assignedIds.has(perm.permissionId);
              return (
                <label
                  key={`${perm.permissionId}-${index}`}
                  className="role-permission__item"
                >
                  <input
                    type="checkbox"
                    checked={isAssigned}
                    onChange={() => handleToggle(perm.permissionId, isAssigned)}
                  />
                  <div className="role-permission__info">
                    <span className="role-permission__name">
                      {perm.permissionName}
                    </span>
                    <span className="role-permission__desc">
                      {perm.permissionDescription}
                    </span>
                  </div>
                  <span className="role-permission__module">
                    {perm.categoryId || 'General'}
                  </span>
                </label>
              );
            })}
            {filteredPermissions.length === 0 && (
              <div
                style={{
                  color: 'var(--text-secondary)',
                  textAlign: 'center',
                  padding: '20px'
                }}
              >
                No permissions found.
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
