import React, { createContext, useContext, type ReactNode } from 'react';
import { CustomerRepositoryImpl } from '../../infrastructure/repositories/CustomerRepositoryImpl';
import { CompanyRepositoryImpl } from '../../infrastructure/repositories/CompanyRepositoryImpl';

// Use Cases - Customers
import { GetCustomersUseCase } from '../../application/usecases/GetCustomersUseCase';
import { CreateCustomerUseCase } from '../../application/usecases/CreateCustomerUseCase';
import { UpdateCustomerUseCase } from '../../application/usecases/UpdateCustomerUseCase';
import { DeleteCustomerUseCase } from '../../application/usecases/DeleteCustomerUseCase';
import { GetCustomerByIdUseCase } from '../../application/usecases/GetCustomerByIdUseCase';

// Use Cases - Companies
import { GetCompaniesUseCase } from '../../application/usecases/GetCompaniesUseCase';
import { CreateCompanyUseCase } from '../../application/usecases/CreateCompanyUseCase';
import { UpdateCompanyUseCase } from '../../application/usecases/UpdateCompanyUseCase';
import { DeleteCompanyUseCase } from '../../application/usecases/DeleteCompanyUseCase';
import { GetCompanyByIdUseCase } from '../../application/usecases/GetCompanyByIdUseCase';
import { GetGeneralCustomersUseCase } from '../../application/usecases/GetGeneralCustomersUseCase';
import { GeneralCustomerRepositoryImpl } from '../../infrastructure/repositories/GeneralCustomerRepositoryImpl';

interface CustomersContextType {
  // Customers
  getCustomersUseCase: GetCustomersUseCase;
  createCustomerUseCase: CreateCustomerUseCase;
  updateCustomerUseCase: UpdateCustomerUseCase;
  deleteCustomerUseCase: DeleteCustomerUseCase;
  getCustomerByIdUseCase: GetCustomerByIdUseCase;

  // Companies
  getCompaniesUseCase: GetCompaniesUseCase;
  createCompanyUseCase: CreateCompanyUseCase;
  updateCompanyUseCase: UpdateCompanyUseCase;
  deleteCompanyUseCase: DeleteCompanyUseCase;
  getCompanyByIdUseCase: GetCompanyByIdUseCase;

  // General Customers
  getGeneralCustomersUseCase: GetGeneralCustomersUseCase;
}

const CustomersContext = createContext<CustomersContextType | null>(null);

export const CustomersProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  // Repositories
  const customerRepository = new CustomerRepositoryImpl();
  const companyRepository = new CompanyRepositoryImpl();
  const generalCustomerRepository = new GeneralCustomerRepositoryImpl();

  // Use Cases - Customers
  const getCustomersUseCase = new GetCustomersUseCase(customerRepository);
  const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
  const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);
  const deleteCustomerUseCase = new DeleteCustomerUseCase(customerRepository);
  const getCustomerByIdUseCase = new GetCustomerByIdUseCase(customerRepository);

  // Use Cases - Companies
  const getCompaniesUseCase = new GetCompaniesUseCase(companyRepository);
  const createCompanyUseCase = new CreateCompanyUseCase(companyRepository);
  const updateCompanyUseCase = new UpdateCompanyUseCase(companyRepository);
  const deleteCompanyUseCase = new DeleteCompanyUseCase(companyRepository);
  const getCompanyByIdUseCase = new GetCompanyByIdUseCase(companyRepository);

  // Use Cases - General Customers
  const getGeneralCustomersUseCase = new GetGeneralCustomersUseCase(
    generalCustomerRepository
  );

  const value = {
    getCustomersUseCase,
    createCustomerUseCase,
    updateCustomerUseCase,
    deleteCustomerUseCase,
    getCustomerByIdUseCase,
    getCompaniesUseCase,
    createCompanyUseCase,
    updateCompanyUseCase,
    deleteCompanyUseCase,
    getCompanyByIdUseCase,
    getGeneralCustomersUseCase
  };

  return (
    <CustomersContext.Provider value={value}>
      {children}
    </CustomersContext.Provider>
  );
};

export const useCustomersContext = () => {
  const context = useContext(CustomersContext);
  if (!context) {
    throw new Error(
      'useCustomersContext must be used within a CustomersProvider'
    );
  }
  return context;
};
