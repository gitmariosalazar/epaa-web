import { createContext, useContext } from 'react';
import { FindAllPropertiesUseCase } from '../../application/usecases/FindAllPropertiesUseCase';
import { FindPropertiesByOwnerUseCase } from '../../application/usecases/FindPropertiesByOwnerUseCase';
import { GetPropertyByIdUseCase } from '../../application/usecases/GetPropertyByIdUseCase';
import { PropertyRepositoryImpl } from '../../infrastructure/repositories/PropertyRepositoryImpl';

interface GetPropertiesContextType {
  getPropertyById: GetPropertyByIdUseCase;
  findAllProperties: FindAllPropertiesUseCase;
  findPropertiesByOwner: FindPropertiesByOwnerUseCase;
}

const GetPropertiesContext = createContext<GetPropertiesContextType | null>(
  null
);

export const GetPropertyContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // TODO: Inject dependencies
  const getPropertyByIdUseRepository = new PropertyRepositoryImpl();
  const findAllPropertiesUseRepository = new PropertyRepositoryImpl();
  const findPropertiesByOwnerUseRepository = new PropertyRepositoryImpl();

  const getPropertyByIdUseCase: GetPropertyByIdUseCase =
    new GetPropertyByIdUseCase(getPropertyByIdUseRepository);
  const findAllPropertiesUseCase: FindAllPropertiesUseCase =
    new FindAllPropertiesUseCase(findAllPropertiesUseRepository);
  const findPropertiesByOwnerUseCase: FindPropertiesByOwnerUseCase =
    new FindPropertiesByOwnerUseCase(findPropertiesByOwnerUseRepository);

  const value = {
    getPropertyById: getPropertyByIdUseCase,
    findAllProperties: findAllPropertiesUseCase,
    findPropertiesByOwner: findPropertiesByOwnerUseCase
  };

  return (
    <GetPropertiesContext.Provider value={value}>
      {children}
    </GetPropertiesContext.Provider>
  );
};

export const useGetPropertiesContext = () => {
  const context = useContext(GetPropertiesContext);
  if (!context) {
    throw new Error(
      'useGetProperties must be used within GetPropertyContextProvider'
    );
  }
  return context;
};
