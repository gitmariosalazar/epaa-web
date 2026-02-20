import React, { createContext, useContext, type ReactNode } from 'react';
import { GetConnectionsUseCase } from '../../application/usecases/GetConnectionsUseCase';
import { CreateConnectionUseCase } from '../../application/usecases/CreateConnectionUseCase';
import { UpdateConnectionUseCase } from '../../application/usecases/UpdateConnectionUseCase';
import { DeleteConnectionUseCase } from '../../application/usecases/DeleteConnectionUseCase';
import { ConnectionRepositoryImpl } from '../../infrastructure/repositories/ConnectionRepositoryImpl';
import { CreateCompanyUseCase } from '@/modules/customers/application/usecases/CreateCompanyUseCase';
import { CreateCustomerUseCase } from '@/modules/customers/application/usecases/CreateCustomerUseCase';
import { CompanyRepositoryImpl } from '@/modules/customers/infrastructure/repositories/CompanyRepositoryImpl';
import { GetCustomerByIdentificationUseCase } from '@/modules/customers/application/usecases/GetCustomerByIdentificationUseCase';
import { CustomerRepositoryImpl } from '@/modules/customers/infrastructure/repositories/CustomerRepositoryImpl';

interface ConnectionContextType {
  getConnectionsUseCase: GetConnectionsUseCase;
  createConnectionUseCase: CreateConnectionUseCase;
  updateConnectionUseCase: UpdateConnectionUseCase;
  deleteConnectionUseCase: DeleteConnectionUseCase;
  getCustomerByIdentificationUseCase: GetCustomerByIdentificationUseCase;
  createCustomerUseCase: CreateCustomerUseCase;
  createCompanyUseCase: CreateCompanyUseCase;
}

const ConnectionContext = createContext<ConnectionContextType | null>(null);

export const ConnectionProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const connectionRepository = new ConnectionRepositoryImpl();
  const customerRepository = new CustomerRepositoryImpl();
  const companyRepository = new CompanyRepositoryImpl();

  const getConnectionsUseCase = new GetConnectionsUseCase(connectionRepository);
  const createConnectionUseCase = new CreateConnectionUseCase(
    connectionRepository
  );
  const updateConnectionUseCase = new UpdateConnectionUseCase(
    connectionRepository
  );
  const deleteConnectionUseCase = new DeleteConnectionUseCase(
    connectionRepository
  );
  const getCustomerByIdentificationUseCase =
    new GetCustomerByIdentificationUseCase(customerRepository);
  const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
  const createCompanyUseCase = new CreateCompanyUseCase(companyRepository);

  const value = {
    getConnectionsUseCase,
    createConnectionUseCase,
    updateConnectionUseCase,
    deleteConnectionUseCase,
    getCustomerByIdentificationUseCase,
    createCustomerUseCase,
    createCompanyUseCase
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnectionsContext = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error(
      'useConnectionsContext must be used within ConnectionProvider'
    );
  }
  return context;
};
