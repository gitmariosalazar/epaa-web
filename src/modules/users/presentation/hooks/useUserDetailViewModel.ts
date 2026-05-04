import { useState, useCallback, useEffect } from 'react';
import type { User } from '@/modules/users/domain/models/User';
import type { UpdateUserRequest } from '@/modules/users/domain/models/UpdateUserRequest';
import type { ChangePasswordRequest } from '@/modules/users/domain/models/ChangePasswordRequest';
import { useUsersContext } from '../context/UsersContext';

export const useUserDetailViewModel = (username: string | undefined) => {
  const { getProfileUseCase, updateUserUseCase, changePasswordUseCase } =
    useUsersContext();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const fetchUser = useCallback(async () => {
    if (!username) return;

    try {
      setLoading(true);
      const userData = await getProfileUseCase.execute(username);
      setUser(userData);
    } catch (err) {
      console.error('Failed to fetch user', err);
      setError('Failed to load user data.');
    } finally {
      setLoading(false);
    }
  }, [username, getProfileUseCase]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleUpdateUser = useCallback(
    async (data: UpdateUserRequest) => {
      if (!user || !username) return;
      try {
        await updateUserUseCase.execute(username, data);
        await fetchUser();
      } catch (err: any) {
        console.error('Failed to update user', err);
        alert(err.response?.data?.message || 'Error updating user.');
      }
    },
    [user, username, updateUserUseCase, fetchUser]
  );

  const handleChangePassword = useCallback(
    async (data: ChangePasswordRequest) => {
      if (!user || !username) return;
      try {
        await changePasswordUseCase.execute(user.userId, data);
        alert('Password changed successfully');
        await fetchUser();
      } catch (err: any) {
        console.error('Failed to change password', err);
        alert(err.response?.data?.message || 'Error changing password.');
      }
    },
    [user, username, changePasswordUseCase, fetchUser]
  );

  return {
    user,
    loading,
    error,
    isEditModalOpen,
    isPasswordModalOpen,
    setIsEditModalOpen,
    setIsPasswordModalOpen,
    handleUpdateUser,
    handleChangePassword,
    fetchUser
  };
};
