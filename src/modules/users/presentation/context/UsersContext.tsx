import React, { createContext, useContext, type ReactNode } from 'react';
import { UserRepositoryImpl } from '@/modules/users/infrastructure/repositories/UserRepositoryImpl';
import { GetUsersUseCase } from '@/modules/users/application/usecases/GetUsersUseCase';
import { CreateUserUseCase } from '@/modules/users/application/usecases/CreateUserUseCase';
import { UpdateUserUseCase } from '@/modules/users/application/usecases/UpdateUserUseCase';
import { DeleteUserUseCase } from '@/modules/users/application/usecases/DeleteUserUseCase';
import { GetUserDetailUseCase } from '@/modules/users/application/usecases/GetUserDetailUseCase';

interface UsersContextType {
  getUsersUseCase: GetUsersUseCase;
  createUserUseCase: CreateUserUseCase;
  updateUserUseCase: UpdateUserUseCase;
  deleteUserUseCase: DeleteUserUseCase;
  getUserDetailUseCase: GetUserDetailUseCase;
}

const UsersContext = createContext<UsersContextType | null>(null);

export const UsersProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  // Singleton instances (created once per provider mount)
  // In a more complex app, we might use useMemo or a dedicated DI container.
  const userRepository = new UserRepositoryImpl();

  const getUsersUseCase = new GetUsersUseCase(userRepository);
  const createUserUseCase = new CreateUserUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository);
  const deleteUserUseCase = new DeleteUserUseCase(userRepository);
  const getUserDetailUseCase = new GetUserDetailUseCase(userRepository);

  const value = {
    getUsersUseCase,
    createUserUseCase,
    updateUserUseCase,
    deleteUserUseCase,
    getUserDetailUseCase
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
