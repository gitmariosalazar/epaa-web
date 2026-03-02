import { useState, useCallback, useEffect } from 'react';
import type { User } from '@/modules/users/domain/models/User';
import type { UpdateUserRequest } from '@/modules/users/domain/models/UpdateUserRequest';
import type { ChangePasswordRequest } from '@/modules/users/domain/models/ChangePasswordRequest';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { useUsersContext } from '../context/UsersContext';

export const useProfileViewModel = () => {
  const { user: authUser } = useAuth();
  const { getProfileUseCase, updateUserUseCase, changePasswordUseCase } =
    useUsersContext();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!authUser?.username) return;

    try {
      setLoading(true);
      const userData = await getProfileUseCase.execute(authUser.username);
      setUser(userData);
    } catch (err) {
      console.error('Failed to fetch profile', err);
      setError('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  }, [authUser?.username, getProfileUseCase]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdateProfile = useCallback(
    async (data: UpdateUserRequest) => {
      if (!user) return;
      try {
        await updateUserUseCase.execute(user.username, data);
        await fetchProfile();
      } catch (err: any) {
        console.error('Failed to update profile', err);
        alert(err.response?.data?.message || 'Error updating profile.');
      }
    },
    [user, updateUserUseCase, fetchProfile]
  );

  const handleChangePassword = useCallback(
    async (data: ChangePasswordRequest) => {
      if (!user) return;
      try {
        await changePasswordUseCase.execute(user.username, data);
        alert('Password changed successfully');
        await fetchProfile();
      } catch (err: any) {
        console.error('Failed to change password', err);
        alert(err.response?.data?.message || 'Error changing password.');
      }
    },
    [user, changePasswordUseCase, fetchProfile]
  );

  return {
    user,
    loading,
    error,
    isEditModalOpen,
    isPasswordModalOpen,
    setIsEditModalOpen,
    setIsPasswordModalOpen,
    handleUpdateProfile,
    handleChangePassword
  };
};
