import { useState, useEffect } from 'react';
import type { Customer } from '../../domain/models/Customer';
import { useCustomersContext } from '../context/CustomersContext';
import type { CreateCustomerRequest } from '../../domain/repositories/CustomerRepository';

export const useCustomersViewModel = () => {
  const {
    getCustomersUseCase,
    createCustomerUseCase,
    updateCustomerUseCase,
    deleteCustomerUseCase
  } = useCustomersContext();

  // State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  // Form Data
  const initialFormState: CreateCustomerRequest & {
    countryId?: string;
    provinceId?: string;
    cantonId?: string;
  } = {
    customerId: 0,
    firstName: '',
    lastName: '',
    emails: [],
    phoneNumbers: [],
    dateOfBirth: new Date(),
    sexId: 1,
    civilStatus: 1,
    address: '',
    professionId: 1,
    originCountry: 'ECUADOR',
    identificationType: 'CED',
    parishId: '',
    deceased: false,
    countryId: 'ECU',
    provinceId: '10',
    cantonId: '1001'
  };
  const [formData, setFormData] = useState<any>(initialFormState);

  // Load Data
  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const offset = (page - 1) * limit;
      const data = await getCustomersUseCase.execute(limit, offset);
      setCustomers(data);
      setHasMore(data.length === limit);
    } catch (error) {
      console.error('Failed to load customers', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [page]);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { name: string; value: any }
  ) => {
    let name: string;
    let value: any;
    let type: string | undefined;

    if ('target' in e) {
      name = e.target.name;
      value = e.target.value;
      type = e.target.type;
      
      if (type === 'number') value = Number(value);
      if (name === 'deceased') {
        const checkbox = e.target as HTMLInputElement;
        value = checkbox.checked;
      }
      if (name === 'dateOfBirth') value = new Date(value);
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    } else if ('countryId' in e) {
      // It's a location object
      setFormData((prev: any) => ({ 
        ...prev, 
        ...e
      }));
    } else {
      name = (e as any).name;
      value = (e as any).value;
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedCustomer(null);
  };

  const handleCreate = async () => {
    try {
      await createCustomerUseCase.execute(formData);
      setIsFormOpen(false);
      resetForm();
      loadCustomers();
    } catch (error) {
      console.error('Create failed', error);
      alert('Failed to create customer');
    }
  };

  const handleUpdate = async () => {
    if (!selectedCustomer) return;
    try {
      await updateCustomerUseCase.execute(
        selectedCustomer.customerId,
        formData
      );
      setIsFormOpen(false);
      resetForm();
      loadCustomers();
    } catch (error) {
      console.error('Update failed', error);
      alert('Failed to update customer');
    }
  };

  const handleDelete = async () => {
    if (!selectedCustomer) return;
    try {
      await deleteCustomerUseCase.execute(selectedCustomer.customerId);
      setIsDeleteOpen(false);
      resetForm();
      loadCustomers();
    } catch (error) {
      console.error('Delete failed', error);
      alert('Failed to delete customer');
    }
  };

  const openEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      ...customer,
      customerId: Number(customer.customerId),
      dateOfBirth: customer.dateOfBirth
        ? new Date(customer.dateOfBirth)
        : new Date(),
      address: customer.address || '',
      originCountry: customer.originCountry || '',
      emails: customer.emails || [],
      phoneNumbers: customer.phoneNumbers || [],
      countryId: 'ECU', // Correct ID for Ecuador
      provinceId: customer.parishId ? customer.parishId.substring(0, 2) : '10',
      cantonId: customer.parishId ? customer.parishId.substring(0, 4) : '1001',
      parishId: customer.parishId || ''
    });
    setIsFormOpen(true);
  };

  // Filter
  const filteredCustomers = customers.filter((customer) => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;

    const name = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    const id = customer.customerId || '';
    const email = customer.emails?.[0]?.toLowerCase() || '';
    const phone = customer.phoneNumbers?.[0] || '';

    switch (searchType) {
      case 'name':
        return name.includes(term);
      case 'id':
        return id.includes(term);
      case 'email':
        return email.includes(term);
      case 'phone':
        return phone.includes(term);
      case 'all':
      default:
        return (
          name.includes(term) ||
          id.includes(term) ||
          email.includes(term) ||
          phone.includes(term)
        );
    }
  });

  return {
    customers,
    filteredCustomers,
    isLoading,
    page,
    setPage,
    hasMore,
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType,
    isFormOpen,
    setIsFormOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    selectedCustomer,
    setSelectedCustomer,
    formData,
    handleInputChange,
    handleCreate,
    handleUpdate,
    handleDelete,
    openEdit,
    resetForm,
    setFormData
  };
};
