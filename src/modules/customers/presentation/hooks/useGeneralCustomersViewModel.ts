import { useState, useEffect } from 'react';
import type { GeneralCustomer } from '../../domain/models/GeneralCustomer';
import { useCustomersContext } from '../context/CustomersContext';
import type { Customer } from '../../domain/models/Customer';
import type { Company } from '../../domain/models/Company';
import type { CreateCompanyRequest } from '../../domain/repositories/CompanyRepository';

export const useGeneralCustomersViewModel = () => {
  const {
    getGeneralCustomersUseCase,
    createCustomerUseCase,
    updateCustomerUseCase,
    deleteCustomerUseCase,
    getCustomerByIdUseCase,
    createCompanyUseCase,
    updateCompanyUseCase,
    deleteCompanyUseCase,
    getCompanyByIdUseCase
  } = useCustomersContext();

  // State
  const [generalCustomers, setGeneralCustomers] = useState<GeneralCustomer[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals generic
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [generalCustomerToDelete, setGeneralCustomerToDelete] =
    useState<GeneralCustomer | null>(null);

  // Customer Form
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const initialCustomerFormState: Omit<Customer, 'customerId'> & {
    customerId: string;
  } = {
    customerId: '', // Identity Type ID (Cedula)
    firstName: '',
    lastName: '',
    emails: [],
    phoneNumbers: [],
    dateOfBirth: null,
    sexId: 1,
    civilStatus: 1,
    address: '',
    professionId: 1,
    originCountry: 'ECUADOR',
    identificationType: 'CED',
    parishId: '',
    deceased: false
  };
  const [customerFormData, setCustomerFormData] = useState(
    initialCustomerFormState
  );

  // Company Form
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const initialCompanyFormState: CreateCompanyRequest = {
    companyName: '',
    socialReason: '',
    companyRuc: '',
    companyAddress: '',
    companyParishId: '',
    companyCountry: 'ECUADOR',
    companyEmails: [],
    companyPhones: [],
    identificationType: 'RUC'
  };
  const [companyFormData, setCompanyFormData] = useState<CreateCompanyRequest>(
    initialCompanyFormState
  );

  // Load Data
  const loadGeneralCustomers = async () => {
    setIsLoading(true);
    try {
      const offset = (page - 1) * limit;
      const data = await getGeneralCustomersUseCase.execute(limit, offset);
      setGeneralCustomers(data);
      setHasMore(data.length === limit);
    } catch (error) {
      console.error('Failed to load general customers', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGeneralCustomers();
  }, [page]);

  // Handlers - Customer
  const handleCustomerInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    if (type === 'number') finalValue = Number(value);
    if (name === 'deceased') finalValue = value === 'true';
    setCustomerFormData({ ...customerFormData, [name]: finalValue });
  };

  const resetCustomerForm = () => {
    setCustomerFormData(initialCustomerFormState);
    setSelectedCustomer(null);
  };

  const handleCreateCustomer = async () => {
    try {
      await createCustomerUseCase.execute(customerFormData);
      setIsCustomerFormOpen(false);
      resetCustomerForm();
      loadGeneralCustomers();
    } catch (error) {
      console.error('Create failed', error);
      alert('Failed to create customer');
    }
  };

  const handleUpdateCustomer = async () => {
    if (!selectedCustomer) return;
    try {
      await updateCustomerUseCase.execute(
        selectedCustomer.customerId,
        customerFormData
      );
      setIsCustomerFormOpen(false);
      resetCustomerForm();
      loadGeneralCustomers();
    } catch (error) {
      console.error('Update failed', error);
      alert('Failed to update customer');
    }
  };

  // Handlers - Company
  const handleCompanyInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCompanyFormData({ ...companyFormData, [e.target.name]: e.target.value });
  };

  const resetCompanyForm = () => {
    setCompanyFormData(initialCompanyFormState);
    setSelectedCompany(null);
  };

  const handleCreateCompany = async () => {
    try {
      await createCompanyUseCase.execute(companyFormData);
      setIsCompanyFormOpen(false);
      resetCompanyForm();
      loadGeneralCustomers();
    } catch (error) {
      console.error('Create failed', error);
      alert('Failed to create company');
    }
  };

  const handleUpdateCompany = async () => {
    if (!selectedCompany) return;
    try {
      await updateCompanyUseCase.execute(
        selectedCompany.companyId,
        companyFormData
      );
      setIsCompanyFormOpen(false);
      resetCompanyForm();
      loadGeneralCustomers();
    } catch (error) {
      console.error('Update failed', error);
      alert('Failed to update company');
    }
  };

  // Generic Handlers
  const [isViewOnly, setIsViewOnly] = useState(false);

  const handleEdit = async (
    generalCustomer: GeneralCustomer,
    viewOnly: boolean = false
  ) => {
    setIsLoading(true);
    setIsViewOnly(viewOnly);
    try {
      if (generalCustomer.identificationType === 'RUC') {
        const company = await getCompanyByIdUseCase.execute(
          generalCustomer.customerId
        );
        if (company) {
          setSelectedCompany(company);
          setCompanyFormData({
            companyName: company.companyName || '',
            socialReason: company.socialReason || '',
            companyRuc: company.companyRuc,
            companyAddress: company.companyAddress || '',
            companyParishId: company.companyParishId,
            companyCountry: company.companyCountry || 'ECUADOR',
            companyEmails: company.companyEmails.map((e) => e.correo),
            companyPhones: company.companyPhones.map((p) => p.numero),
            identificationType: company.identificationType
          });
          setIsCompanyFormOpen(true);
        }
      } else {
        const customer = await getCustomerByIdUseCase.execute(
          generalCustomer.customerId
        );
        if (customer) {
          setSelectedCustomer(customer);
          setCustomerFormData({
            ...customer,
            dateOfBirth: customer.dateOfBirth
              ? customer.dateOfBirth.split('T')[0]
              : null
          });
          setIsCustomerFormOpen(true);
        }
      }
    } catch (error) {
      console.error('Failed to load details for editing/viewing', error);
      alert('Could not load details');
    } finally {
      setIsLoading(false);
    }
  };

  const promptDelete = (generalCustomer: GeneralCustomer) => {
    setGeneralCustomerToDelete(generalCustomer);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!generalCustomerToDelete) return;
    try {
      if (generalCustomerToDelete.identificationType === 'RUC') {
        await deleteCompanyUseCase.execute(generalCustomerToDelete.customerId);
      } else {
        await deleteCustomerUseCase.execute(generalCustomerToDelete.customerId);
      }
      setIsDeleteOpen(false);
      setGeneralCustomerToDelete(null);
      loadGeneralCustomers();
    } catch (error) {
      console.error('Delete failed', error);
      alert('Failed to delete customer/company');
    }
  };

  // Filter
  const filteredGeneralCustomers = generalCustomers.filter(
    (generalCustomer) =>
      (generalCustomer.customerName?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      ) || (generalCustomer.customerId || '').includes(searchTerm)
  );

  return {
    generalCustomers,
    filteredGeneralCustomers,
    isLoading,
    page,
    setPage,
    hasMore,
    searchTerm,
    setSearchTerm,

    // Customer Modal State
    isCustomerFormOpen,
    setIsCustomerFormOpen,
    selectedCustomer,
    customerFormData,
    handleCustomerInputChange,
    handleCreateCustomer,
    handleUpdateCustomer,

    // Company Modal State
    isCompanyFormOpen,
    setIsCompanyFormOpen,
    selectedCompany,
    companyFormData,
    setCompanyFormData,
    handleCompanyInputChange,
    handleCreateCompany,
    handleUpdateCompany,

    // Generic Action Handlers
    handleEdit,
    promptDelete,
    isDeleteOpen,
    setIsDeleteOpen,
    handleDelete,
    generalCustomerToDelete,
    isViewOnly,
    setIsViewOnly
  };
};
