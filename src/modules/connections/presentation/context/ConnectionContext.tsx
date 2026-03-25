import React, { createContext, useContext, type ReactNode } from 'react';
import { GetConnectionsUseCase } from '../../application/usecases/GetConnectionsUseCase';
import { GetRatesUseCase } from '../../application/usecases/GetRatesUseCase';
import { CreateConnectionUseCase } from '../../application/usecases/CreateConnectionUseCase';
import { UpdateConnectionUseCase } from '../../application/usecases/UpdateConnectionUseCase';
import { DeleteConnectionUseCase } from '../../application/usecases/DeleteConnectionUseCase';
import { FindConnectionsBySectorUseCase } from '../../application/usecases/FindConnectionsBySectorUseCase';
import { FindAllConnectionsByClientIdUseCase } from '../../application/usecases/FindAllConnectionsByClientIdUseCase';
import { FindConnectionWithPropertyByCadastralKeyUseCase } from '../../application/usecases/FindConnectionWithPropertyByCadastralKeyUseCase';
import { ConnectionRepositoryImpl } from '../../infrastructure/repositories/ConnectionRepositoryImpl';
import { CreateCompanyUseCase } from '@/modules/customers/application/usecases/CreateCompanyUseCase';
import { CreateCustomerUseCase } from '@/modules/customers/application/usecases/CreateCustomerUseCase';
import { CompanyRepositoryImpl } from '@/modules/customers/infrastructure/repositories/CompanyRepositoryImpl';
import { GetCustomerByIdentificationUseCase } from '@/modules/customers/application/usecases/GetCustomerByIdentificationUseCase';
import { CustomerRepositoryImpl } from '@/modules/customers/infrastructure/repositories/CustomerRepositoryImpl';
import { UpdateCustomerUseCase } from '@/modules/customers/application/usecases/UpdateCustomerUseCase';
import { UpdateCompanyUseCase } from '@/modules/customers/application/usecases/UpdateCompanyUseCase';

interface ConnectionContextType {
  getConnectionsUseCase: GetConnectionsUseCase;
  getRatesUseCase: GetRatesUseCase;
  createConnectionUseCase: CreateConnectionUseCase;
  updateConnectionUseCase: UpdateConnectionUseCase;
  deleteConnectionUseCase: DeleteConnectionUseCase;
  findConnectionsBySectorUseCase: FindConnectionsBySectorUseCase;
  findAllConnectionsByClientIdUseCase: FindAllConnectionsByClientIdUseCase;
  findConnectionWithPropertyByCadastralKeyUseCase: FindConnectionWithPropertyByCadastralKeyUseCase;
  getCustomerByIdentificationUseCase: GetCustomerByIdentificationUseCase;
  createCustomerUseCase: CreateCustomerUseCase;
  createCompanyUseCase: CreateCompanyUseCase;
  updateCustomerUseCase: UpdateCustomerUseCase;
  updateCompanyUseCase: UpdateCompanyUseCase;
}

const ConnectionContext = createContext<ConnectionContextType | null>(null);

export const ConnectionProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const connectionRepository = new ConnectionRepositoryImpl();
  const customerRepository = new CustomerRepositoryImpl();
  const companyRepository = new CompanyRepositoryImpl();

  const getConnectionsUseCase = new GetConnectionsUseCase(connectionRepository);
  const getRatesUseCase = new GetRatesUseCase(connectionRepository);
  const createConnectionUseCase = new CreateConnectionUseCase(connectionRepository);
  const updateConnectionUseCase = new UpdateConnectionUseCase(connectionRepository);
  const deleteConnectionUseCase = new DeleteConnectionUseCase(connectionRepository);
  const findConnectionsBySectorUseCase = new FindConnectionsBySectorUseCase(connectionRepository);
  const findAllConnectionsByClientIdUseCase = new FindAllConnectionsByClientIdUseCase(connectionRepository);
  const findConnectionWithPropertyByCadastralKeyUseCase = new FindConnectionWithPropertyByCadastralKeyUseCase(connectionRepository);
  const getCustomerByIdentificationUseCase = new GetCustomerByIdentificationUseCase(customerRepository);
  const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
  const createCompanyUseCase = new CreateCompanyUseCase(companyRepository);
  const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);
  const updateCompanyUseCase = new UpdateCompanyUseCase(companyRepository);

  const value = {
    getConnectionsUseCase,
    getRatesUseCase,
    createConnectionUseCase,
    updateConnectionUseCase,
    deleteConnectionUseCase,
    findConnectionsBySectorUseCase,
    findAllConnectionsByClientIdUseCase,
    findConnectionWithPropertyByCadastralKeyUseCase,
    getCustomerByIdentificationUseCase,
    createCustomerUseCase,
    createCompanyUseCase,
    updateCustomerUseCase,
    updateCompanyUseCase
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
