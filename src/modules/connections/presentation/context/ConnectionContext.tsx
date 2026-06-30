import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode
} from 'react';
import { GetConnectionsUseCase } from '../../application/usecases/GetConnectionsUseCase';
import { GetRatesUseCase } from '../../application/usecases/GetRatesUseCase';
import { CreateConnectionUseCase } from '../../application/usecases/CreateConnectionUseCase';
import { UpdateConnectionUseCase } from '../../application/usecases/UpdateConnectionUseCase';
import { DeleteConnectionUseCase } from '../../application/usecases/DeleteConnectionUseCase';
import { FindConnectionsBySectorUseCase } from '../../application/usecases/FindConnectionsBySectorUseCase';
import { FindAllConnectionsByClientIdUseCase } from '../../application/usecases/FindAllConnectionsByClientIdUseCase';
import { FindConnectionWithPropertyByCadastralKeyUseCase } from '../../application/usecases/FindConnectionWithPropertyByCadastralKeyUseCase';
import { GetAdvanceDashboardStatsUseCase } from '../../application/usecases/getAdvanceDashboardStats.usecase';
import { ConnectionRepositoryImpl } from '../../infrastructure/repositories/ConnectionRepositoryImpl';
import { CreateCompanyUseCase } from '@/modules/customers/application/usecases/CreateCompanyUseCase';
import { CreateCustomerUseCase } from '@/modules/customers/application/usecases/CreateCustomerUseCase';
import { CompanyRepositoryImpl } from '@/modules/customers/infrastructure/repositories/CompanyRepositoryImpl';
import { GetCustomerByIdentificationUseCase } from '@/modules/customers/application/usecases/GetCustomerByIdentificationUseCase';
import { CustomerRepositoryImpl } from '@/modules/customers/infrastructure/repositories/CustomerRepositoryImpl';
import { UpdateCustomerUseCase } from '@/modules/customers/application/usecases/UpdateCustomerUseCase';
import { UpdateCompanyUseCase } from '@/modules/customers/application/usecases/UpdateCompanyUseCase';
import { GetLiveUpdateMapConnectionsUseCase } from '../../application/usecases/GetLiveUpdateMapConnectionsUseCase';

interface ConnectionContextType {
  getConnectionsUseCase: GetConnectionsUseCase;
  getRatesUseCase: GetRatesUseCase;
  createConnectionUseCase: CreateConnectionUseCase;
  updateConnectionUseCase: UpdateConnectionUseCase;
  deleteConnectionUseCase: DeleteConnectionUseCase;
  findConnectionsBySectorUseCase: FindConnectionsBySectorUseCase;
  findAllConnectionsByClientIdUseCase: FindAllConnectionsByClientIdUseCase;
  findConnectionWithPropertyByCadastralKeyUseCase: FindConnectionWithPropertyByCadastralKeyUseCase;
  getAdvanceDashboardStatsUseCase: GetAdvanceDashboardStatsUseCase;
  getCustomerByIdentificationUseCase: GetCustomerByIdentificationUseCase;
  createCustomerUseCase: CreateCustomerUseCase;
  createCompanyUseCase: CreateCompanyUseCase;
  updateCustomerUseCase: UpdateCustomerUseCase;
  updateCompanyUseCase: UpdateCompanyUseCase;
  getLiveUpdateMapConnectionsUseCase: GetLiveUpdateMapConnectionsUseCase;
}

const ConnectionContext = createContext<ConnectionContextType | null>(null);

export const ConnectionProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const connectionRepository = useMemo(
    () => new ConnectionRepositoryImpl(),
    []
  );
  const customerRepository = useMemo(() => new CustomerRepositoryImpl(), []);
  const companyRepository = useMemo(() => new CompanyRepositoryImpl(), []);

  const value = useMemo<ConnectionContextType>(() => {
    return {
      getConnectionsUseCase: new GetConnectionsUseCase(connectionRepository),
      getRatesUseCase: new GetRatesUseCase(connectionRepository),
      createConnectionUseCase: new CreateConnectionUseCase(
        connectionRepository
      ),
      updateConnectionUseCase: new UpdateConnectionUseCase(
        connectionRepository
      ),
      deleteConnectionUseCase: new DeleteConnectionUseCase(
        connectionRepository
      ),
      findConnectionsBySectorUseCase: new FindConnectionsBySectorUseCase(
        connectionRepository
      ),
      findAllConnectionsByClientIdUseCase:
        new FindAllConnectionsByClientIdUseCase(connectionRepository),
      findConnectionWithPropertyByCadastralKeyUseCase:
        new FindConnectionWithPropertyByCadastralKeyUseCase(
          connectionRepository
        ),
      getAdvanceDashboardStatsUseCase: new GetAdvanceDashboardStatsUseCase(
        connectionRepository
      ),
      getCustomerByIdentificationUseCase:
        new GetCustomerByIdentificationUseCase(customerRepository),
      createCustomerUseCase: new CreateCustomerUseCase(customerRepository),
      createCompanyUseCase: new CreateCompanyUseCase(companyRepository),
      updateCustomerUseCase: new UpdateCustomerUseCase(customerRepository),
      updateCompanyUseCase: new UpdateCompanyUseCase(companyRepository),
      getLiveUpdateMapConnectionsUseCase:
        new GetLiveUpdateMapConnectionsUseCase(connectionRepository)
    };
  }, [connectionRepository, customerRepository, companyRepository]);

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
