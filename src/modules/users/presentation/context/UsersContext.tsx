import React, { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { UserRepositoryImpl } from '@/modules/users/infrastructure/repositories/UserRepositoryImpl';
import { GetUsersUseCase } from '@/modules/users/application/usecases/GetUsersUseCase';
import { CreateUserUseCase } from '@/modules/users/application/usecases/CreateUserUseCase';
import { UpdateUserUseCase } from '@/modules/users/application/usecases/UpdateUserUseCase';
import { DeleteUserUseCase } from '@/modules/users/application/usecases/DeleteUserUseCase';
import { GetUserDetailUseCase } from '@/modules/users/application/usecases/GetUserDetailUseCase';
import { GetProfileUseCase } from '@/modules/users/application/usecases/GetProfileUseCase';
import { ChangePasswordUseCase } from '@/modules/users/application/usecases/ChangePasswordUseCase';

interface UsersContextType {
  getUsersUseCase: GetUsersUseCase;
  createUserUseCase: CreateUserUseCase;
  updateUserUseCase: UpdateUserUseCase;
  deleteUserUseCase: DeleteUserUseCase;
  getUserDetailUseCase: GetUserDetailUseCase;
  getProfileUseCase: GetProfileUseCase;
  changePasswordUseCase: ChangePasswordUseCase;
}

const UsersContext = createContext<UsersContextType | null>(null);

export const UsersProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const userRepository = useMemo(() => new UserRepositoryImpl(), []);

  const getUsersUseCase = useMemo(
    () => new GetUsersUseCase(userRepository),
    [userRepository]
  );
  const createUserUseCase = useMemo(
    () => new CreateUserUseCase(userRepository),
    [userRepository]
  );
  const updateUserUseCase = useMemo(
    () => new UpdateUserUseCase(userRepository),
    [userRepository]
  );
  const deleteUserUseCase = useMemo(
    () => new DeleteUserUseCase(userRepository),
    [userRepository]
  );
  const getUserDetailUseCase = useMemo(
    () => new GetUserDetailUseCase(userRepository),
    [userRepository]
  );
  const getProfileUseCase = useMemo(
    () => new GetProfileUseCase(userRepository),
    [userRepository]
  );
  const changePasswordUseCase = useMemo(
    () => new ChangePasswordUseCase(userRepository),
    [userRepository]
  );

  const value = {
    getUsersUseCase,
    createUserUseCase,
    updateUserUseCase,
    deleteUserUseCase,
    getUserDetailUseCase,
    getProfileUseCase,
    changePasswordUseCase
  };

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
};

export const useUsersContext = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsersContext must be used within a UsersProvider');
  }
  return context;
};
