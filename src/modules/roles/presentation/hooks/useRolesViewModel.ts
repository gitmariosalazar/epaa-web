import { useState, useEffect } from 'react';
import type { Role } from '@/modules/roles/domain/models/Role';
import { useRolesContext } from '../context/RolesContext';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';

export const useRolesViewModel = () => {
  const {
    getRolesUseCase,
    createRoleUseCase,
    updateRoleUseCase,
    deleteRoleUseCase
  } = useRolesContext();

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPermissionOpen, setIsPermissionOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const initialFormState: Partial<Role> = {
    name: '',
    description: '',
    isActive: true
  };

  const [formData, setFormData] = useState<Partial<Role>>(initialFormState);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await getRolesUseCase.execute(100, 0);
      setRoles(data);
    } catch (error) {
      console.error(error);
      MessageToastCustom('error', 'Error al cargar roles', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, [getRolesUseCase]);

  const handleSave = async () => {
    try {
      if (selectedRole) {
        // Update
        await updateRoleUseCase.execute(selectedRole.rolId, formData);
        MessageToastCustom('success', 'Rol actualizado correctamente', 'Éxito');
      } else {
        // Create
        await createRoleUseCase.execute({
          name: formData.name!,
          description: formData.description || '',
          isActive: formData.isActive ?? true,
          rolId: 0
        });
        MessageToastCustom('success', 'Rol creado correctamente', 'Éxito');
      }
      setIsCreateOpen(false);
      resetForm();
      loadRoles();
    } catch (error) {
      console.error('Failed to save role', error);
      MessageToastCustom('error', 'Error al guardar el rol', 'Error');
    }
  };

  const handleDelete = async (role: Role) => {
    const nextStatus = !role.isActive;
    const action = nextStatus ? 'activar' : 'desactivar';
    if (confirm(`¿Está seguro de que desea ${action} el rol "${role.name}"?`)) {
      try {
        await updateRoleUseCase.execute(role.rolId, { isActive: nextStatus });
        MessageToastCustom('success', `Rol ${nextStatus ? 'activado' : 'desactivado'} correctamente`, 'Éxito');
        loadRoles();
      } catch (error) {
        // Try fallback to deleteRoleUseCase
        try {
          await deleteRoleUseCase.execute(role.rolId);
          MessageToastCustom('success', 'Rol eliminado correctamente', 'Éxito');
          loadRoles();
        } catch (delError) {
          console.error('Failed to change role status/delete', delError);
          MessageToastCustom('error', 'No se pudo cambiar el estado del rol', 'Error');
        }
      }
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

  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedRole(null);
  };

  const filteredRoles = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    roles,
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
    refresh: loadRoles
  };
};
