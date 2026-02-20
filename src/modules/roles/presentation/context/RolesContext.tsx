import React, { createContext, useContext, type ReactNode } from 'react';
import { GetRolesUseCase } from '@/modules/roles/application/usecases/GetRolesUseCase';
import { CreateRoleUseCase } from '@/modules/roles/application/usecases/CreateRoleUseCase';
import { UpdateRoleUseCase } from '@/modules/roles/application/usecases/UpdateRoleUseCase';
import { DeleteRoleUseCase } from '@/modules/roles/application/usecases/DeleteRoleUseCase';
import { RoleRepositoryImpl } from '@/modules/roles/infrastructure/repositories/RoleRepositoryImpl';

interface RolesContextType {
  getRolesUseCase: GetRolesUseCase;
  createRoleUseCase: CreateRoleUseCase;
  updateRoleUseCase: UpdateRoleUseCase;
  deleteRoleUseCase: DeleteRoleUseCase;
}

const RolesContext = createContext<RolesContextType | null>(null);

export const RolesProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const repository = new RoleRepositoryImpl();
  const getRolesUseCase = new GetRolesUseCase(repository);
  const createRoleUseCase = new CreateRoleUseCase(repository);
  const updateRoleUseCase = new UpdateRoleUseCase(repository);
  const deleteRoleUseCase = new DeleteRoleUseCase(repository);

  const value = {
    getRolesUseCase,
    createRoleUseCase,
    updateRoleUseCase,
    deleteRoleUseCase
  };

  return (
    <RolesContext.Provider value={value}>{children}</RolesContext.Provider>
  );
};

export const useRolesContext = () => {
  const context = useContext(RolesContext);
  if (!context) {
    throw new Error('useRolesContext must be used within RolesProvider');
  }
  return context;
};
