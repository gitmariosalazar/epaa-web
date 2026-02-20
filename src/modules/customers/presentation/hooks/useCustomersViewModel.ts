import { useState, useEffect } from 'react';
import type { Customer } from '../../domain/models/Customer';
import { useCustomersContext } from '../context/CustomersContext';

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

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  // Form Data
  const initialFormState: Omit<Customer, 'customerId'> & {
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
  const [formData, setFormData] = useState(initialFormState);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;

    if (type === 'number') finalValue = Number(value);
    if (name === 'deceased') finalValue = value === 'true';

    setFormData({ ...formData, [name]: finalValue });
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
      dateOfBirth: customer.dateOfBirth
        ? customer.dateOfBirth.split('T')[0]
        : null
    });
    setIsFormOpen(true);
  };

  // Filter
  const filteredCustomers = customers.filter(
    (customer) =>
      (customer.firstName?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      ) ||
      (customer.lastName?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      ) ||
      (customer.customerId || '').includes(searchTerm)
  );

  return {
    customers,
    filteredCustomers,
    isLoading,
    page,
    setPage,
    hasMore,
    searchTerm,
    setSearchTerm,
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
