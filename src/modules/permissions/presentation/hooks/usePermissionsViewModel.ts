import { useState, useCallback, useEffect } from 'react';
import type { Permission } from '@/modules/permissions/domain/models/Permission';
import { usePermissionsContext } from '../context/PermissionsContext';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';

export const usePermissionsViewModel = () => {
  const {
    getPermissionsUseCase,
    createPermissionUseCase,
    updatePermissionUseCase,
    deletePermissionUseCase
  } = usePermissionsContext();

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPerm, setSelectedPerm] = useState<Permission | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<Partial<Permission>>({
    permissionName: '',
    permissionDescription: '',
    scopes: '',
    categoryId: '',
    isActive: true
  });

  const loadPermissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getPermissionsUseCase.execute();
      setPermissions(data);
    } catch (error) {
      console.error('Error fetching permissions', error);
      MessageToastCustom('error', 'Error al cargar permisos', 'Error');
    } finally {
      setIsLoading(false);
    }
  }, [getPermissionsUseCase]);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  const handleSave = useCallback(async () => {
    try {
      if (selectedPerm) {
        await updatePermissionUseCase.execute(
          selectedPerm.permissionId,
          formData
        );
        MessageToastCustom('success', 'Permiso actualizado correctamente', 'Éxito');
      } else {
        await createPermissionUseCase.execute({
          permissionName: formData.permissionName!,
          permissionDescription: formData.permissionDescription || '',
          scopes: formData.scopes || '',
          categoryId: formData.categoryId || 'General',
          isActive: true
        });
        MessageToastCustom('success', 'Permiso creado correctamente', 'Éxito');
      }
      setIsCreateOpen(false);
      resetForm();
      loadPermissions();
    } catch (error) {
      console.error('Failed to save permission', error);
      MessageToastCustom('error', 'Error al guardar el permiso', 'Error');
    }
  }, [
    createPermissionUseCase,
    updatePermissionUseCase,
    selectedPerm,
    formData,
    loadPermissions
  ]);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!confirm('¿Está seguro de que desea eliminar este permiso?')) return;
      try {
        await deletePermissionUseCase.execute(id);
        MessageToastCustom('success', 'Permiso eliminado correctamente', 'Éxito');
        loadPermissions();
      } catch (error) {
        console.error('Failed to delete', error);
        MessageToastCustom('error', 'Error al eliminar el permiso', 'Error');
      }
    },
    [deletePermissionUseCase, loadPermissions]
  );

  const openEdit = useCallback((perm: Permission) => {
    setSelectedPerm(perm);
    setFormData({
      permissionName: perm.permissionName,
      permissionDescription: perm.permissionDescription,
      scopes: perm.scopes || '',
      categoryId: perm.categoryId,
      isActive: perm.isActive
    });
    setIsCreateOpen(true);
  }, []);

  const openCreate = useCallback(() => {
    setSelectedPerm(null);
    resetForm();
    setIsCreateOpen(true);
  }, []);

  const closeCreate = useCallback(() => {
    setIsCreateOpen(false);
  }, []);

  const resetForm = () => {
    setFormData({
      permissionName: '',
      permissionDescription: '',
      scopes: '',
      categoryId: '',
      isActive: true
    });
    setSelectedPerm(null);
  };

  const filteredPermissions = permissions.filter(
    (p) =>
      (p.permissionName?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      ) ||
      (p.permissionDescription?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      ) ||
      (p.scopes?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (String(p.categoryId || '')?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return {
    permissions: filteredPermissions,
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
    closeCreate,
    refreshPermissions: loadPermissions
  };
};
