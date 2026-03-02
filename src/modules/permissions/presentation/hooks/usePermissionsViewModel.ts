import { useState, useCallback, useEffect } from 'react';
import type { Permission } from '@/modules/permissions/domain/models/Permission';
import { usePermissionsContext } from '../context/PermissionsContext';

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
      } else {
        await createPermissionUseCase.execute({
          permissionName: formData.permissionName!,
          permissionDescription: formData.permissionDescription || '',
          categoryId: formData.categoryId || 'General',
          isActive: true
        });
      }
      setIsCreateOpen(false);
      resetForm();
      loadPermissions();
    } catch (error) {
      console.error('Failed to save permission', error);
      alert('Failed to save permission');
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
      if (!confirm('Are you sure you want to delete this permission?')) return;
      try {
        await deletePermissionUseCase.execute(id);
        loadPermissions();
      } catch (error) {
        console.error('Failed to delete', error);
        alert('Failed to delete permission');
      }
    },
    [deletePermissionUseCase, loadPermissions]
  );

  const openEdit = useCallback((perm: Permission) => {
    setSelectedPerm(perm);
    setFormData({
      permissionName: perm.permissionName,
      permissionDescription: perm.permissionDescription,
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
      (p.categoryId?.toLowerCase() || '').includes(searchTerm.toLowerCase())
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
