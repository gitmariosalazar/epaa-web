import { useState, useEffect } from 'react';
import type { Role } from '@/modules/roles/domain/models/Role';
import { useRolesContext } from '../context/RolesContext';

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
      } else {
        // Create
        await createRoleUseCase.execute({
          name: formData.name!,
          description: formData.description || '',
          isActive: formData.isActive ?? true,
          rolId: 0
        });
      }
      setIsCreateOpen(false);
      resetForm();
      loadRoles();
    } catch (error) {
      console.error('Failed to save role', error);
      alert('Failed to save role');
    }
  };

  const handleDelete = async (role: Role) => {
    if (confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRoleUseCase.execute(role.rolId);
        loadRoles();
      } catch (error) {
        console.error('Failed to delete role', error);
        alert('Failed to delete role');
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
    resetForm
  };
};
