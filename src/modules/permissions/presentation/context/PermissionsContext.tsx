import React, { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { PermissionRepositoryImpl } from '@/modules/permissions/infrastructure/repositories/PermissionRepositoryImpl';
import { GetPermissionsUseCase } from '@/modules/permissions/application/usecases/GetPermissionsUseCase';
import { CreatePermissionUseCase } from '@/modules/permissions/application/usecases/CreatePermissionUseCase';
import { UpdatePermissionUseCase } from '@/modules/permissions/application/usecases/UpdatePermissionUseCase';
import { DeletePermissionUseCase } from '@/modules/permissions/application/usecases/DeletePermissionUseCase';

interface PermissionsContextProps {
  getPermissionsUseCase: GetPermissionsUseCase;
  createPermissionUseCase: CreatePermissionUseCase;
  updatePermissionUseCase: UpdatePermissionUseCase;
  deletePermissionUseCase: DeletePermissionUseCase;
}

const PermissionsContext = createContext<PermissionsContextProps | undefined>(
  undefined
);

export const PermissionsProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  // Initialize repository and use cases using useMemo to instantiate once per provider mount (Singleton pattern per context)
  const repository = useMemo(() => new PermissionRepositoryImpl(), []);

  const getPermissionsUseCase = useMemo(
    () => new GetPermissionsUseCase(repository),
    [repository]
  );
  const createPermissionUseCase = useMemo(
    () => new CreatePermissionUseCase(repository),
    [repository]
  );
  const updatePermissionUseCase = useMemo(
    () => new UpdatePermissionUseCase(repository),
    [repository]
  );
  const deletePermissionUseCase = useMemo(
    () => new DeletePermissionUseCase(repository),
    [repository]
  );

  return (
    <PermissionsContext.Provider
      value={{
        getPermissionsUseCase,
        createPermissionUseCase,
        updatePermissionUseCase,
        deletePermissionUseCase
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissionsContext = (): PermissionsContextProps => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error(
      'usePermissionsContext must be used within a PermissionsProvider'
    );
  }
  return context;
};
