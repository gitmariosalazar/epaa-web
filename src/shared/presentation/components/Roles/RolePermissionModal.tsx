import React, { useEffect, useState } from 'react';
import type { Role } from '@/modules/roles/domain/models/Role';
import type { Permission } from '@/modules/permissions/domain/models/Permission';
import { Modal } from '../Modal/Modal';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { ManageRolePermissionsUseCase } from '@/modules/roles/application/usecases/ManageRolePermissionsUseCase';
import { RolePermissionRepositoryImpl } from '@/modules/roles/infrastructure/repositories/RolePermissionRepositoryImpl';
import { PermissionRepositoryImpl } from '@/modules/permissions/infrastructure/repositories/PermissionRepositoryImpl';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import './RolePermissionModal.css';
import { CircularProgress } from '../CircularProgress';

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
  const [isSavingBatch, setIsSavingBatch] = useState(false);
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
      MessageToastCustom('error', 'Error al cargar los permisos del rol', 'Error');
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
        MessageToastCustom('info', 'Permiso removido del rol', 'Actualizado');
      } else {
        // Adding
        await useCase.assignPermission(role.rolId, permissionId);
        MessageToastCustom('success', 'Permiso asignado al rol', 'Actualizado');
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
      MessageToastCustom('error', 'Error al guardar la asignación', 'Error');
    }
  };

  const handleSaveAllBatch = async () => {
    if (!role) return;
    setIsSavingBatch(true);
    try {
      const ids = Array.from(assignedIds);
      await useCase.assignPermissionsBatch(role.rolId, ids);
      MessageToastCustom(
        'success',
        `Se sincronizaron ${ids.length} permisos exitosamente`,
        'Éxito'
      );
      onClose();
    } catch (error) {
      console.error('Failed to save permissions batch', error);
      MessageToastCustom('error', 'Error al sincronizar permisos en lote', 'Error');
    } finally {
      setIsSavingBatch(false);
    }
  };

  const filteredPermissions = permissions.filter(
    (p) =>
      (p.permissionName?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      ) ||
      (p.permissionDescription?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      ) ||
      (p.scopes?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Administrar Permisos: ${role?.name}`}
      size="lg"
      footer={
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="subtle" onClick={onClose}>
            Cerrar
          </Button>
          <Button
            onClick={handleSaveAllBatch}
            disabled={isSavingBatch || isLoading}
          >
            {isSavingBatch ? 'Guardando...' : `Guardar Todos (${assignedIds.size})`}
          </Button>
        </div>
      }
    >
      <div className="role-permission-modal">
        <div className="role-permission__search">
          <Input
            name="search"
            placeholder="Buscar por nombre, descripción o scope (ej: ot:leer)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <CircularProgress label="Cargando permisos..." />
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
                    {perm.scopes && (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          background: 'var(--primary-light-10, rgba(59, 130, 246, 0.1))',
                          color: 'var(--primary, #3b82f6)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          display: 'inline-block',
                          marginTop: '2px',
                          width: 'fit-content'
                        }}
                      >
                        Scope: {perm.scopes}
                      </span>
                    )}
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
                No se encontraron permisos.
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
